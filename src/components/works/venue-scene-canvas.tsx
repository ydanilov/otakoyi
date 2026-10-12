"use client"
/* eslint-disable react-hooks/immutability, react-hooks/refs --
   R3F idiom: the three.js scene graph (camera, uniforms, instance matrices) is mutated every
   frame inside useFrame, outside React's render. These objects are never React state. */

import { Suspense, useEffect, useMemo, useRef, useState } from "react"
import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber"
import { PerformanceMonitor } from "@react-three/drei"
import { Bloom, EffectComposer, Noise, Vignette } from "@react-three/postprocessing"
import * as THREE from "three"
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js"
import { MeshoptDecoder } from "three/examples/jsm/libs/meshopt_decoder.module.js"
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js"

import { generativePalette, type GenerativeMode } from "@/lib/tokens.generated"
import { works, type WorkId } from "./registry"
import { seeded } from "./runtime"
import { meshVertexShader, rippleFragmentShader } from "./shaders"

export type VenueSceneCanvasProps = {
  /** 0..1 — camera position along the tour (stage → lobby → stand). */
  progress: number
  palette: GenerativeMode
  /** Live time, people, camera drift. Off → frozen, deterministic frame. */
  animate: boolean
  onReady?: () => void
}

/** Built by scripts/blender/build-venue.py — lighting is baked in Cycles. */
const MODEL = "/models/venue.glb"
const VENUE_BAKE = "/models/venue-bake.jpg"
const FLOOR_BAKE = "/models/floor-bake.jpg"
const FROZEN_TIME = 12

/** Which live work plays on which screen of the model. */
const SCREENS: Record<string, { work: WorkId; seed: number; density: number }> = {
  Screen_Stage: { work: "signal-field", seed: 11, density: 0.4 },
  Screen_Lobby: { work: "lattice", seed: 3, density: 0.3 },
  Screen_StandFloor: { work: "contour", seed: 4, density: 0.5 },
  Screen_StandWall: { work: "signal-field", seed: 27, density: 0.5 },
}

/**
 * Camera keyframes [position, look-at] at 35-ish mm, evenly spaced over progress 0..1:
 * wide stage → close on the backdrop → lobby reveal → brand wall → stand from above → on the stand.
 */
const KEYS: [THREE.Vector3Tuple, THREE.Vector3Tuple][] = [
  [
    [0, 2.2, 13],
    [0, 2.4, -1.5],
  ],
  [
    [-3.2, 1.6, 6.4],
    [0.8, 2.6, -1.9],
  ],
  [
    [11.5, 2.4, 10],
    [16, 3, -2],
  ],
  [
    [19.5, 1.7, 7.5],
    [16, 3.2, -2.2],
  ],
  [
    [29, 6.5, 10.5],
    [32, 0.4, 0],
  ],
  [
    [38, 3.6, 10],
    [31.5, 0.7, -0.6],
  ],
]
const posCurve = new THREE.CatmullRomCurve3(
  KEYS.map(([p]) => new THREE.Vector3(...p)),
  false,
  "centripetal",
)
const lookCurve = new THREE.CatmullRomCurve3(
  KEYS.map(([, l]) => new THREE.Vector3(...l)),
  false,
  "centripetal",
)
const ease = (t: number) => t * t * (3 - 2 * t)

function screenMaterial(work: WorkId, seed: number, density: number, aspect: number) {
  return new THREE.ShaderMaterial({
    vertexShader: meshVertexShader,
    fragmentShader: works[work].fragmentShader,
    uniforms: {
      uTime: { value: FROZEN_TIME },
      uSeed: { value: seed },
      uDensity: { value: density },
      uResolution: { value: new THREE.Vector2(1024 * aspect, 1024) },
      uC1: { value: new THREE.Color() },
      uC2: { value: new THREE.Color() },
      uC3: { value: new THREE.Color() },
      uC4: { value: new THREE.Color() },
    },
    toneMapped: false,
  })
}

// ---------------------------------------------------------------------------------- people
const PEOPLE = 26
/** Each walker loops between two points; stand visitors converge on the interactive floor. */
type Walker = {
  from: THREE.Vector2
  to: THREE.Vector2
  speed: number
  phase: number
  height: number
}

function makeWalkers(seed: number): Walker[] {
  const r = seeded(seed)
  const out: Walker[] = []
  for (let i = 0; i < PEOPLE; i++) {
    const zone = i < 8 ? "conference" : i < 13 ? "lobby" : "stand"
    let from: THREE.Vector2
    let to: THREE.Vector2
    if (zone === "conference") {
      // Down the centre aisle towards the stage, well in front of the camera.
      from = new THREE.Vector2(-0.35 + r() * 0.7, 5.6 + r() * 0.6)
      to = new THREE.Vector2(-0.35 + r() * 0.7, 1.9 + r() * 0.5)
    } else if (zone === "lobby") {
      from = new THREE.Vector2(10.5 + r() * 3, -0.8 + r() * 3)
      to = new THREE.Vector2(18.5 + r() * 3, -0.8 + r() * 3)
    } else {
      // From the aisle on the left towards the stand — "the stand everyone walks towards".
      from = new THREE.Vector2(23 + r() * 3, -1 + r() * 4)
      to = new THREE.Vector2(29.8 + r() * 4.5, -1.6 + r() * 4)
    }
    out.push({ from, to, speed: 0.035 + r() * 0.04, phase: r() * 2, height: 1.62 + r() * 0.22 })
  }
  return out
}

function walkerPos(w: Walker, time: number, out: THREE.Vector2) {
  // Ping-pong with a pause at each end, eased so people slow down as they arrive.
  const t = (time * w.speed + w.phase) % 2
  const k = t < 1 ? t : 2 - t
  const s = ease(Math.min(1, Math.max(0, (k - 0.1) / 0.8)))
  return out.copy(w.from).lerp(w.to, s)
}

/** Merge parts into one smooth-shaded geometry, so a mannequin part is a single instanced draw. */
function merge(parts: THREE.BufferGeometry[]) {
  const g = mergeGeometries(
    parts.map((p) => p.toNonIndexed()),
    false,
  )!
  return g
}

function People({
  animate,
  floorCenter,
  floorSize,
  rippleRef,
}: {
  animate: boolean
  floorCenter: THREE.Vector2
  floorSize: number
  rippleRef: React.RefObject<THREE.ShaderMaterial | null>
}) {
  const body = useRef<THREE.InstancedMesh>(null)
  const legL = useRef<THREE.InstancedMesh>(null)
  const legR = useRef<THREE.InstancedMesh>(null)
  const walkers = useMemo(() => makeWalkers(19), [])
  // A slim gallery mannequin: torso + shoulders + head + arms; legs swing from the hip.
  const geo = useMemo(() => {
    const torso = new THREE.CapsuleGeometry(0.15, 0.42, 4, 12).translate(0, 1.18, 0)
    const shoulders = new THREE.CapsuleGeometry(0.07, 0.3, 4, 8)
      .rotateZ(Math.PI / 2)
      .translate(0, 1.42, 0)
    const head = new THREE.SphereGeometry(0.105, 16, 12).translate(0, 1.66, 0)
    const armL = new THREE.CapsuleGeometry(0.045, 0.5, 4, 8).translate(-0.24, 1.16, 0)
    const armR = new THREE.CapsuleGeometry(0.045, 0.5, 4, 8).translate(0.24, 1.16, 0)
    // Leg pivots at the hip (y = 0.88): geometry hangs below the origin.
    const leg = new THREE.CapsuleGeometry(0.065, 0.72, 4, 8).translate(0, -0.44, 0)
    return { body: merge([torso, shoulders, head, armL, armR]), leg }
  }, [])
  const tmp = useMemo(
    () => ({
      o: new THREE.Object3D(),
      l: new THREE.Object3D(),
      p: new THREE.Vector2(),
      q: new THREE.Vector2(),
    }),
    [],
  )

  useFrame((state) => {
    const b = body.current
    const L = legL.current
    const R = legR.current
    if (!b || !L || !R) return
    const time = animate ? FROZEN_TIME + state.clock.elapsedTime : FROZEN_TIME
    const ripples = rippleRef.current?.uniforms.uPoints?.value as THREE.Vector3[] | undefined
    let n = 0
    walkers.forEach((w, i) => {
      const p = walkerPos(w, time, tmp.p).clone()
      const ahead = walkerPos(w, time + 0.3, tmp.q)
      const moving = p.distanceTo(ahead) > 0.01
      const stride = moving && animate ? Math.sin(time * 7 + i * 1.7) : 0
      const y = inStand(p) ? 0.125 : 0
      const s = w.height / 1.75
      tmp.o.position.set(p.x, y + Math.abs(stride) * 0.025, p.y)
      if (moving) tmp.o.lookAt(ahead.x, tmp.o.position.y, ahead.y)
      tmp.o.scale.setScalar(s)
      tmp.o.updateMatrix()
      b.setMatrixAt(i, tmp.o.matrix)
      for (const [mesh, side] of [
        [L, -1],
        [R, 1],
      ] as const) {
        tmp.l.position.set(side * 0.085, 0.88, 0)
        tmp.l.rotation.set(stride * side * 0.45, 0, 0)
        tmp.l.updateMatrix()
        tmp.l.matrix.premultiply(tmp.o.matrix)
        mesh.setMatrixAt(i, tmp.l.matrix)
      }
      // Visitors on the interactive floor drive the ripples.
      if (ripples && n < ripples.length) {
        const u = (p.x - floorCenter.x) / floorSize + 0.5
        const v = (p.y - floorCenter.y) / floorSize + 0.5
        if (u > 0 && u < 1 && v > 0 && v < 1) ripples[n++]!.set(u, 1 - v, 1)
      }
    })
    if (ripples) for (let k = n; k < ripples.length; k++) ripples[k]!.z = 0
    b.instanceMatrix.needsUpdate = true
    L.instanceMatrix.needsUpdate = true
    R.instanceMatrix.needsUpdate = true
  })

  return (
    <>
      <instancedMesh ref={body} args={[geo.body, undefined, PEOPLE]} frustumCulled={false}>
        <meshStandardMaterial color="dimgray" roughness={0.55} metalness={0.1} />
      </instancedMesh>
      <instancedMesh ref={legL} args={[geo.leg, undefined, PEOPLE]} frustumCulled={false}>
        <meshStandardMaterial color="dimgray" roughness={0.55} metalness={0.1} />
      </instancedMesh>
      <instancedMesh ref={legR} args={[geo.leg, undefined, PEOPLE]} frustumCulled={false}>
        <meshStandardMaterial color="dimgray" roughness={0.55} metalness={0.1} />
      </instancedMesh>
    </>
  )
}

const inStand = (p: THREE.Vector2) => p.x > 28 && p.x < 36 && p.y > -3.2 && p.y < 3.8

// ---------------------------------------------------------------------------------- venue
function Venue({ progress, palette, animate, onReady }: VenueSceneCanvasProps) {
  const gltf = useLoader(GLTFLoader, MODEL, (loader) => loader.setMeshoptDecoder(MeshoptDecoder))
  const [venueMap, floorMap] = useLoader(THREE.TextureLoader, [VENUE_BAKE, FLOOR_BAKE])
  const { invalidate } = useThree()
  const colors = generativePalette[palette]
  const materials = useRef<THREE.ShaderMaterial[]>([])
  const ripple = useRef<THREE.ShaderMaterial>(null)
  const look = useRef(new THREE.Vector3(...KEYS[0]![1]))
  const smoothed = useRef(progress)
  const reported = useRef(false)

  // Baked maps are display-referred (AgX in Blender): show them as-is, unlit.
  const scene = useMemo(() => {
    const root = gltf.scene.clone(true)
    const list: THREE.ShaderMaterial[] = []
    let floorScreen: THREE.Mesh | undefined
    for (const tex of [venueMap!, floorMap!]) {
      tex.flipY = false
      tex.colorSpace = THREE.SRGBColorSpace
      tex.anisotropy = 8
    }
    root.traverse((o) => {
      if (!(o as THREE.Mesh).isMesh) return
      const mesh = o as THREE.Mesh
      const screen = SCREENS[mesh.name]
      if (screen) {
        mesh.geometry.computeBoundingBox()
        const s = new THREE.Vector3()
        mesh.geometry.boundingBox!.getSize(s)
        const dims = [s.x, s.y, s.z].sort((a, b) => b - a)
        const m = screenMaterial(screen.work, screen.seed, screen.density, dims[0]! / dims[1]!)
        mesh.material = m
        list.push(m)
        if (mesh.name === "Screen_StandFloor") floorScreen = mesh
      } else if (mesh.name.startsWith("Floor")) {
        mesh.material = new THREE.MeshBasicMaterial({ map: floorMap, toneMapped: false })
      } else {
        mesh.material = new THREE.MeshBasicMaterial({ map: venueMap, toneMapped: false })
      }
    })
    materials.current = list
    return { root, floorScreen }
  }, [gltf, venueMap, floorMap])

  // Ripple overlay sits just above the interactive floor and shares its UVs.
  const rippleMesh = useMemo(() => {
    const src = scene.floorScreen
    if (!src) return null
    const geo = src.geometry.clone()
    const m = new THREE.ShaderMaterial({
      vertexShader: meshVertexShader,
      fragmentShader: rippleFragmentShader,
      uniforms: {
        uTime: { value: FROZEN_TIME },
        uPoints: { value: Array.from({ length: 8 }, () => new THREE.Vector3()) },
        uColor: { value: new THREE.Color() },
      },
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      toneMapped: false,
    })
    const mesh = new THREE.Mesh(geo, m)
    mesh.position.copy(src.position)
    mesh.position.y += 0.004
    mesh.quaternion.copy(src.quaternion)
    return { mesh, material: m }
  }, [scene])

  useEffect(() => {
    ripple.current = rippleMesh?.material ?? null
  }, [rippleMesh])

  const floorInfo = useMemo(() => {
    const box = new THREE.Box3().setFromObject(scene.floorScreen ?? new THREE.Object3D())
    const c = new THREE.Vector3()
    const s = new THREE.Vector3()
    box.getCenter(c)
    box.getSize(s)
    return { center: new THREE.Vector2(c.x, c.z), size: Math.max(s.x, s.z) || 6.5 }
  }, [scene])

  useEffect(() => invalidate(), [progress, palette, animate, invalidate])

  useFrame((state, delta) => {
    const camera = state.camera
    smoothed.current = animate
      ? THREE.MathUtils.damp(smoothed.current, progress, 2.6, delta)
      : progress
    const t = THREE.MathUtils.clamp(smoothed.current, 0, 1)
    camera.position.copy(posCurve.getPoint(t))
    look.current.copy(lookCurve.getPoint(t))
    const time = animate ? FROZEN_TIME + state.clock.elapsedTime : FROZEN_TIME
    if (animate) {
      // Handheld drift + pointer parallax: the room answers when you look around.
      camera.position.x += Math.sin(time * 0.35) * 0.06 + state.pointer.x * 0.4
      camera.position.y += Math.sin(time * 0.5) * 0.04 + state.pointer.y * 0.22
    }
    camera.lookAt(look.current)

    for (const m of materials.current) {
      const u = m.uniforms
      u.uTime!.value = time
      u.uC1!.value.set(colors["gen-1"])
      u.uC2!.value.set(colors["gen-2"])
      u.uC3!.value.set(colors["gen-3"])
      u.uC4!.value.set(colors["gen-4"])
    }
    if (rippleMesh) {
      rippleMesh.material.uniforms.uTime!.value = time
      rippleMesh.material.uniforms.uColor!.value.set(colors["gen-1"])
    }
    if (animate && Math.abs(smoothed.current - progress) > 0.0005) state.invalidate()
    if (!reported.current) {
      reported.current = true
      requestAnimationFrame(() => onReady?.())
    }
  })

  return (
    <>
      <color attach="background" args={["black"]} />
      <fog attach="fog" args={["black", 18, 46]} />
      {/* People are the only lit objects: a dim key so they read as silhouettes with a rim. */}
      <hemisphereLight args={[colors["gen-2"], "black", 0.35]} />
      <directionalLight position={[4, 6, -8]} intensity={1.6} color={colors["gen-2"]} />
      <directionalLight position={[-6, 8, 10]} intensity={0.35} />
      <primitive object={scene.root} />
      {rippleMesh && <primitive object={rippleMesh.mesh} />}
      <People
        animate={animate}
        floorCenter={floorInfo.center}
        floorSize={floorInfo.size}
        rippleRef={ripple}
      />
    </>
  )
}

function Effects({ high }: { high: boolean }) {
  return (
    <EffectComposer multisampling={0}>
      <Bloom
        mipmapBlur
        luminanceThreshold={0.55}
        luminanceSmoothing={0.2}
        intensity={high ? 1.1 : 0.7}
      />
      <Noise opacity={0.035} premultiply />
      <Vignette offset={0.28} darkness={0.75} />
    </EffectComposer>
  )
}

export default function VenueSceneCanvas(props: VenueSceneCanvasProps) {
  // Quality tiers: start high, step down (dpr, effects) if the device can't hold the frame rate.
  const [tier, setTier] = useState<2 | 1 | 0>(2)
  // [min, max]: never render above the screen's own pixel ratio.
  const dpr: [number, number] = [1, tier === 2 ? 1.75 : tier === 1 ? 1.25 : 1]
  return (
    <Canvas
      camera={{ position: KEYS[0]![0], fov: 38, near: 0.1, far: 120 }}
      dpr={dpr}
      frameloop={props.animate ? "always" : "demand"}
      gl={{ antialias: false, preserveDrawingBuffer: true, powerPreference: "high-performance" }}
      eventSource={typeof document !== "undefined" ? document.body : undefined}
      eventPrefix="client"
      aria-hidden
    >
      <PerformanceMonitor
        onDecline={() => setTier((t) => (t > 0 ? ((t - 1) as 1 | 0) : 0))}
        flipflops={2}
      >
        <Suspense fallback={null}>
          <Venue {...props} />
          {tier > 0 && <Effects high={tier === 2} />}
        </Suspense>
      </PerformanceMonitor>
    </Canvas>
  )
}
