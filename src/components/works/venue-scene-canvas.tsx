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
  Screen_MusicSideL: { work: "lattice", seed: 8, density: 0.45 },
  Screen_MusicSideR: { work: "lattice", seed: 9, density: 0.45 },
  Screen_MuseumBack: { work: "signal-field", seed: 64, density: 0.55 },
  Screen_MuseumLeft: { work: "contour", seed: 12, density: 0.45 },
  Screen_MuseumRight: { work: "contour", seed: 13, density: 0.45 },
  Screen_MuseumFloor: { work: "contour", seed: 21, density: 0.35 },
}

/**
 * Camera keyframes [position, look-at] at 35-ish mm, evenly spaced over progress 0..1:
 * stand from above → on the stand → lobby → towards the concert → music stage → museum entrance → inside.
 */
const KEYS: [THREE.Vector3Tuple, THREE.Vector3Tuple][] = [
  // 0 — exhibition stand from above            (stop 1 at progress 0)
  [
    [29, 6.5, 10.5],
    [32, 0.4, 0],
  ],
  // on the stand, among the visitors
  [
    [38, 3.6, 10],
    [31.5, 0.7, -0.6],
  ],
  // 2/6 — office lobby, brand wall              (stop 2)
  [
    [19.5, 1.8, 8],
    [16, 3.1, -2.2],
  ],
  // crossing towards the concert
  [
    [8, 3.2, 14],
    [2, 2.6, -1],
  ],
  // 4/6 — music: behind the crowd, stage ahead  (stop 3)
  [
    [0.6, 2.1, 12.5],
    [0, 3.0, -2.5],
  ],
  // entering the immersive room
  [
    [-11, 2.2, 10],
    [-16, 2.2, -1.5],
  ],
  // 1 — museum, inside the projections          (stop 4)
  [
    [-16, 1.75, 5.6],
    [-16, 2.1, -3],
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

/** Visitors standing on the interactive floor, from the same placement list that built the model. */
const STAND_FEET = venuePeople.feet.filter(([x, z]) => x! > 28 && x! < 36 && z! > -3.2 && z! < 3.8)

// ---------------------------------------------------------------------------------- venue
function Venue({ progress, palette, animate, onReady }: VenueSceneCanvasProps) {
  const gltf = useLoader(GLTFLoader, MODEL, (loader) => loader.setMeshoptDecoder(MeshoptDecoder))
  const [venueMap, floorMap] = useLoader(THREE.TextureLoader, [VENUE_BAKE, FLOOR_BAKE])
  const { invalidate } = useThree()
  const colors = generativePalette[palette]
  const materials = useRef<THREE.ShaderMaterial[]>([])
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
    // Each visitor standing on the floor sends out slow rings from their feet.
    const box = new THREE.Box3().setFromObject(src)
    const size = Math.max(box.max.x - box.min.x, box.max.z - box.min.z) || 6.5
    const cx = (box.min.x + box.max.x) / 2
    const cz = (box.min.z + box.max.z) / 2
    const points = m.uniforms.uPoints!.value as THREE.Vector3[]
    STAND_FEET.slice(0, points.length).forEach(([x, z], i) => {
      points[i]!.set((x! - cx) / size + 0.5, 1 - ((z! - cz) / size + 0.5), 1)
    })
    return { mesh, material: m }
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
