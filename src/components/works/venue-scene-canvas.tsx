"use client"
/* eslint-disable react-hooks/immutability, react-hooks/refs --
   R3F idiom: the three.js scene graph (camera, uniforms, instance matrices) is mutated every
   frame inside useFrame, outside React's render. These objects are never React state. */

import { Suspense, useEffect, useMemo, useRef, useState } from "react"
import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber"
import { Environment, Lightformer, PerformanceMonitor } from "@react-three/drei"
import { Bloom, EffectComposer, Noise, Vignette } from "@react-three/postprocessing"
import * as THREE from "three"
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js"
import { MeshoptDecoder } from "three/examples/jsm/libs/meshopt_decoder.module.js"

import { generativePalette, type GenerativeMode } from "@/lib/tokens.generated"
import { works, type WorkId } from "./registry"
import { meshVertexShader, rippleFragmentShader } from "./shaders"
import venuePeople from "./venue-people.json"

export type VenueSceneCanvasProps = {
  /** 0..1 — camera position along the tour (stand → lobby → music → museum). */
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
  Screen_MusicSideL: { work: "lattice", seed: 8, density: 0.45 },
  Screen_MusicSideR: { work: "lattice", seed: 9, density: 0.45 },
  Screen_MuseumBack: { work: "signal-field", seed: 64, density: 0.55 },
  Screen_MuseumLeft: { work: "contour", seed: 12, density: 0.45 },
  Screen_MuseumRight: { work: "contour", seed: 13, density: 0.45 },
  Screen_MuseumFloor: { work: "contour", seed: 21, density: 0.35 },
}

// ---------------------------------------------------------------------------------- camera
/**
 * The rooms stand on an arc around an empty floor (placement from build-venue.py). Each stop is
 * a composed shot in that room's own coordinates — subject on the right third, the copy panel on
 * the left — and each move between stops is its own camera move: crane out, sweep across the
 * dark, push in. Progress holds on a stop for a moment, then eases through the move.
 */
type ZoneName = keyof typeof venuePeople.zones
type Shot = { pos: THREE.Vector3Tuple; look: THREE.Vector3Tuple; fov: number }

const ORDER: ZoneName[] = ["stand", "lobby", "music", "museum"]

const SHOTS: Record<ZoneName, Shot> = {
  // High three-quarter: the interactive floor and the people standing on it.
  stand: { pos: [-3.2, 5.6, 9.4], look: [-1.7, 0.2, -0.4], fov: 34 },
  // Low, frontal and level: architecture lines stay vertical, the wall sits on the right third.
  lobby: { pos: [-3.1, 1.5, 12.6], look: [-2.9, 2.7, -2.2], fov: 32 },
  // Behind the crowd, slightly below eye level: silhouettes against the LED wall.
  music: { pos: [-2.2, 1.25, 11.8], look: [-2.6, 3.2, -2.5], fov: 40 },
  // Inside the room: wide, so walls and floor wrap the frame.
  museum: { pos: [1.1, 1.5, 4.6], look: [-0.6, 1.9, -3.1], fov: 54 },
}

/** How each move flies: height of the arc, how far it pulls back, and the bank into the turn. */
const MOVES = [
  { name: "crane", height: 9.5, pull: 5, approach: 9, inner: 0.35, bank: 0.05 },
  { name: "track", height: 1.15, pull: 3, approach: 8, inner: 0.12, bank: -0.035 },
  { name: "rise", height: 8, pull: 2, approach: 6, inner: 0.22, bank: 0.06 },
] as const

/** Hold on a stop for this share of each segment at both ends. */
const HOLD = 0.1

function toWorld(zone: ZoneName, [x, y, z]: THREE.Vector3Tuple) {
  const { x: zx, z: zz, yaw } = venuePeople.zones[zone]
  const c = Math.cos(yaw)
  const s = Math.sin(yaw)
  return new THREE.Vector3(zx + x * c + z * s, y, zz - x * s + z * c)
}

function zoneCenter(zone: ZoneName, y: number) {
  return toWorld(zone, [0, y, 0])
}

type Segment = {
  pos: THREE.CatmullRomCurve3
  look: THREE.CatmullRomCurve3
  fov: [number, number]
  bank: number
}

const SEGMENTS: Segment[] = ORDER.slice(0, -1).map((from, i) => {
  const to = ORDER[i + 1]!
  const move = MOVES[i]!
  const a = toWorld(from, SHOTS[from].pos)
  const b = toWorld(to, SHOTS[to].pos)
  // Back out along the room's own axis, sweep through the open floor, push in along the next.
  const outA = toWorld(from, [SHOTS[from].pos[0], 0, SHOTS[from].pos[2] + move.pull])
  const inB = toWorld(to, [SHOTS[to].pos[0] * 0.5, 0, SHOTS[to].pos[2] + move.approach])
  const mid = a
    .clone()
    .lerp(b, 0.5)
    .multiplyScalar(1 - move.inner)
  outA.y = THREE.MathUtils.lerp(a.y, move.height, 0.55)
  mid.y = move.height
  inB.y = THREE.MathUtils.lerp(b.y, move.height, 0.4)
  return {
    pos: new THREE.CatmullRomCurve3([a, outA, mid, inB, b], false, "centripetal"),
    // Keep the old room in frame while pulling out (a reveal), then turn to the new one.
    look: new THREE.CatmullRomCurve3(
      [
        toWorld(from, SHOTS[from].look),
        zoneCenter(from, 1.6),
        zoneCenter(to, 2.2),
        toWorld(to, SHOTS[to].look),
      ],
      false,
      "centripetal",
    ),
    fov: [SHOTS[from].fov, SHOTS[to].fov],
    bank: move.bank,
  }
})

const smootherstep = (x: number) => x * x * x * (x * (x * 6 - 15) + 10)

/** progress 0..1 → camera position, look target, fov and roll. */
function cameraAt(progress: number, pos: THREE.Vector3, look: THREE.Vector3) {
  const n = SEGMENTS.length
  const p = THREE.MathUtils.clamp(progress, 0, 1) * n
  const i = Math.min(Math.floor(p), n - 1)
  const seg = SEGMENTS[i]!
  const raw = THREE.MathUtils.clamp((p - i - HOLD) / (1 - 2 * HOLD), 0, 1)
  const u = smootherstep(raw)
  seg.pos.getPointAt(u, pos)
  seg.look.getPoint(u, look)
  const swing = Math.sin(Math.PI * u)
  return {
    // Widen in flight for speed, settle back to the shot's lens on arrival.
    fov: THREE.MathUtils.lerp(seg.fov[0], seg.fov[1], u) + swing * 9,
    roll: swing * seg.bank,
  }
}

const START = toWorld("stand", SHOTS.stand.pos).toArray()

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
/** Standing visitors (scripts/blender/people.py): one mesh, glossy oil-black like sculpture. */
const PEOPLE_MODEL = "/models/people.glb"

function People() {
  const gltf = useLoader(GLTFLoader, PEOPLE_MODEL, (loader) =>
    loader.setMeshoptDecoder(MeshoptDecoder),
  )
  const object = useMemo(() => {
    const root = gltf.scene.clone(true)
    const oil = new THREE.MeshPhysicalMaterial({
      color: "black",
      roughness: 0.16,
      metalness: 0,
      clearcoat: 1,
      clearcoatRoughness: 0.035,
      envMapIntensity: 1.5,
    })
    root.traverse((o) => {
      if ((o as THREE.Mesh).isMesh) (o as THREE.Mesh).material = oil
    })
    return root
  }, [gltf])
  return <primitive object={object} />
}

/** Visitors standing on the interactive floor, in its UV space (from the same placement list). */
const RIPPLES = venuePeople.ripples

// ---------------------------------------------------------------------------------- venue
function Venue({ progress, palette, animate, onReady }: VenueSceneCanvasProps) {
  const gltf = useLoader(GLTFLoader, MODEL, (loader) => loader.setMeshoptDecoder(MeshoptDecoder))
  const [venueMap, floorMap] = useLoader(THREE.TextureLoader, [VENUE_BAKE, FLOOR_BAKE])
  const { invalidate } = useThree()
  const colors = generativePalette[palette]
  const materials = useRef<THREE.ShaderMaterial[]>([])
  const look = useRef(new THREE.Vector3())
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
    // Each visitor standing on the floor sends out slow rings from their feet.
    const points = m.uniforms.uPoints!.value as THREE.Vector3[]
    RIPPLES.slice(0, points.length).forEach(([u, v], i) => {
      points[i]!.set(u!, v!, 1)
    })
    return { mesh, material: m }
  }, [scene])

  useEffect(() => invalidate(), [progress, palette, animate, invalidate])

  useFrame((state, delta) => {
    const camera = state.camera
    smoothed.current = animate
      ? THREE.MathUtils.damp(smoothed.current, progress, 2.6, delta)
      : progress
    const shot = cameraAt(smoothed.current, camera.position, look.current)
    const time = animate ? FROZEN_TIME + state.clock.elapsedTime : FROZEN_TIME
    if (animate) {
      // Handheld drift + pointer parallax: the room answers when you look around.
      camera.position.x += Math.sin(time * 0.35) * 0.06 + state.pointer.x * 0.4
      camera.position.y += Math.sin(time * 0.5) * 0.04 + state.pointer.y * 0.22
    }
    camera.lookAt(look.current)
    camera.rotateZ(shot.roll)
    const lens = camera as THREE.PerspectiveCamera
    if (Math.abs(lens.fov - shot.fov) > 0.01) {
      lens.fov = shot.fov
      lens.updateProjectionMatrix()
    }

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
      <fog attach="fog" args={["black", 16, 52]} />
      {/* Reflections for the glossy visitors: light shapes where the screens and LED strips are. */}
      <Environment resolution={256} frames={1}>
        <Lightformer
          form="rect"
          intensity={3}
          color={colors["gen-2"]}
          position={[0, 2.5, -6]}
          scale={[12, 4, 1]}
        />
        <Lightformer
          form="rect"
          intensity={2.5}
          color={colors["gen-1"]}
          position={[6, 0.5, 4]}
          scale={[10, 0.4, 1]}
          rotation-y={-Math.PI / 2}
        />
        <Lightformer
          form="rect"
          intensity={1.5}
          color={colors["gen-3"]}
          position={[-6, 3, 2]}
          scale={[4, 6, 1]}
          rotation-y={Math.PI / 2}
        />
        <Lightformer
          form="rect"
          intensity={1.2}
          position={[0, 8, 0]}
          scale={[10, 10, 1]}
          rotation-x={Math.PI / 2}
        />
      </Environment>
      <directionalLight position={[4, 6, -8]} intensity={1.2} color={colors["gen-2"]} />
      <primitive object={scene.root} />
      {rippleMesh && <primitive object={rippleMesh.mesh} />}
      <People />
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
      camera={{ position: START, fov: SHOTS.stand.fov, near: 0.1, far: 140 }}
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
