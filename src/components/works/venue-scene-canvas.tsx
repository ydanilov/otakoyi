"use client"

import { useEffect, useMemo, useRef } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import * as THREE from "three"

import { generativePalette, type GenerativeMode } from "@/lib/tokens.generated"
import { works, type WorkId } from "./registry"
import { seeded } from "./runtime"
import { meshVertexShader } from "./shaders"

export type VenueSceneCanvasProps = {
  /** 0..1 — camera position along the tour (stage → lobby → stand). */
  progress: number
  palette: GenerativeMode
  /** Live time on the screens and smoothed camera. Off → frozen, deterministic frame. */
  animate: boolean
  onReady?: () => void
}

const FROZEN_TIME = 12

/** Camera keyframes: [position, look-at], evenly spaced over progress 0..1. */
const KEYS: [THREE.Vector3Tuple, THREE.Vector3Tuple][] = [
  [
    [0, 2.4, 12],
    [0, 2.2, -1.5],
  ],
  [
    [-2.5, 1.7, 5.5],
    [0.5, 2.4, -1.8],
  ],
  [
    [12, 2.2, 9],
    [16, 3, -2],
  ],
  [
    [18.5, 1.6, 4.2],
    [16, 3.2, -2],
  ],
  [
    [31, 8, 9],
    [32, 0, 0],
  ],
  [
    [35.5, 3, 5],
    [32, 0.4, 0],
  ],
]
const posCurve = new THREE.CatmullRomCurve3(KEYS.map(([p]) => new THREE.Vector3(...p)))
const lookCurve = new THREE.CatmullRomCurve3(KEYS.map(([, l]) => new THREE.Vector3(...l)))

/** One shared clock so every screen in the venue plays the same moment. */
function useScreenMaterial(work: WorkId, seed: number, density: number, w: number, h: number) {
  return useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: meshVertexShader,
        fragmentShader: works[work].fragmentShader,
        uniforms: {
          uTime: { value: FROZEN_TIME },
          uSeed: { value: seed },
          uDensity: { value: density },
          uResolution: { value: new THREE.Vector2(w * 240, h * 240) },
          uC1: { value: new THREE.Color() },
          uC2: { value: new THREE.Color() },
          uC3: { value: new THREE.Color() },
          uC4: { value: new THREE.Color() },
        },
        toneMapped: false,
      }),
    [work, seed, density, w, h],
  )
}

function Screen({
  work,
  seed,
  density,
  size,
  materials,
  ...props
}: {
  work: WorkId
  seed: number
  density: number
  size: [number, number]
  materials: React.RefObject<THREE.ShaderMaterial[]>
} & React.ComponentProps<"mesh">) {
  const material = useScreenMaterial(work, seed, density, size[0], size[1])
  useEffect(() => {
    const list = materials.current
    list.push(material)
    return () => {
      list.splice(list.indexOf(material), 1)
      material.dispose()
    }
  }, [material, materials])
  return (
    <mesh {...props} material={material}>
      <planeGeometry args={size} />
    </mesh>
  )
}

function Audience({ color }: { color: THREE.Color }) {
  const mesh = useRef<THREE.InstancedMesh>(null)
  const rows = 8
  const cols = 14
  useEffect(() => {
    const m = mesh.current
    if (!m) return
    const rand = seeded(42)
    const o = new THREE.Object3D()
    let i = 0
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        o.position.set((c - (cols - 1) / 2) * 0.7, 0.35, 2.4 + r * 0.9)
        o.scale.set(0.5, 0.7 + rand() * 0.25, 0.45)
        o.updateMatrix()
        m.setMatrixAt(i++, o.matrix)
      }
    }
    m.instanceMatrix.needsUpdate = true
  }, [])
  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, rows * cols]}>
      <boxGeometry />
      <meshStandardMaterial color={color} roughness={0.8} />
    </instancedMesh>
  )
}

function Venue({ progress, palette, animate, onReady }: VenueSceneCanvasProps) {
  const { invalidate } = useThree()
  const colors = generativePalette[palette]
  const dark = palette === "dark"
  // Neutrals derived from the token palette (gen-4 of the dark mode is the near-white ink).
  const { bg, structure } = useMemo(() => {
    const white = new THREE.Color(generativePalette.dark["gen-4"])
    return {
      bg: white.clone().multiplyScalar(dark ? 0.04 : 0.99),
      structure: white.clone().multiplyScalar(dark ? 0.085 : 0.89),
    }
  }, [dark])
  const materials = useRef<THREE.ShaderMaterial[]>([])
  const look = useRef(new THREE.Vector3(...KEYS[0]![1]))
  const smoothed = useRef(progress)
  const reported = useRef(false)

  useEffect(() => invalidate(), [progress, palette, animate, invalidate])

  useFrame((state, delta) => {
    const camera = state.camera
    smoothed.current = animate
      ? THREE.MathUtils.damp(smoothed.current, progress, 3.5, delta)
      : progress
    const t = THREE.MathUtils.clamp(smoothed.current, 0, 1)
    camera.position.copy(posCurve.getPoint(t))
    look.current.copy(lookCurve.getPoint(t))
    // A touch of pointer parallax — the room responds when you look around.
    if (animate) {
      camera.position.x += state.pointer.x * 0.35
      camera.position.y += state.pointer.y * 0.2
    }
    camera.lookAt(look.current)

    const time = animate ? FROZEN_TIME + state.clock.elapsedTime : FROZEN_TIME
    for (const m of materials.current) {
      const u = m.uniforms
      u.uTime!.value = time
      u.uC1!.value.set(colors["gen-1"])
      u.uC2!.value.set(colors["gen-2"])
      u.uC3!.value.set(colors["gen-3"])
      u.uC4!.value.set(colors["gen-4"])
    }
    if (animate && Math.abs(smoothed.current - progress) > 0.0005) state.invalidate()
    if (!reported.current) {
      reported.current = true
      requestAnimationFrame(() => onReady?.())
    }
  })

  return (
    <>
      <color attach="background" args={[bg]} />
      <fog attach="fog" args={[bg, 12, 42]} />
      <ambientLight intensity={dark ? 0.35 : 0.9} />
      <directionalLight position={[10, 12, 8]} intensity={dark ? 0.4 : 0.8} />

      {/* Floor: slightly glossy so the screens bleed light onto it. */}
      <mesh rotation-x={-Math.PI / 2} position={[16, 0, 2]}>
        <planeGeometry args={[80, 40]} />
        <meshStandardMaterial color={structure} roughness={0.35} metalness={0.35} />
      </mesh>
      <gridHelper args={[80, 80, structure, structure]} position={[16, 0.002, 2]} />

      {/* 1 — Conference: stage backdrop LED wall, stage, audience. */}
      <group position={[0, 0, 0]}>
        <Screen
          work="signal-field"
          seed={11}
          density={0.4}
          size={[11, 3.6]}
          position={[0, 2.6, -1.9]}
          materials={materials}
        />
        <mesh position={[0, 0.3, -0.6]}>
          <boxGeometry args={[11.5, 0.6, 3]} />
          <meshStandardMaterial color={structure} roughness={0.6} />
        </mesh>
        <Audience color={structure} />
        <pointLight position={[0, 2.5, 1.5]} intensity={18} distance={14} color={colors["gen-2"]} />
      </group>

      {/* 2 — Office lobby: tall always-on brand wall, reception desk, columns. */}
      <group position={[16, 0, 0]}>
        <Screen
          work="lattice"
          seed={3}
          density={0.3}
          size={[4.2, 6]}
          position={[0, 3.1, -2]}
          materials={materials}
        />
        <mesh position={[-3.2, 0.55, 1]}>
          <boxGeometry args={[3, 1.1, 0.9]} />
          <meshStandardMaterial color={structure} roughness={0.4} metalness={0.2} />
        </mesh>
        {[-4.5, 4.5].map((x) => (
          <mesh key={x} position={[x, 3.5, -1.6]}>
            <cylinderGeometry args={[0.35, 0.35, 7, 24]} />
            <meshStandardMaterial color={structure} roughness={0.5} />
          </mesh>
        ))}
        <pointLight position={[0, 3, 1]} intensity={14} distance={10} color={colors["gen-1"]} />
      </group>

      {/* 3 — Exhibition stand: interactive floor projection, back wall with a screen, kiosk. */}
      <group position={[32, 0, 0]}>
        <Screen
          work="contour"
          seed={4}
          density={0.5}
          size={[6.5, 6.5]}
          rotation-x={-Math.PI / 2}
          position={[0, 0.01, 0.5]}
          materials={materials}
        />
        <mesh position={[0, 1.6, -3]}>
          <boxGeometry args={[7, 3.2, 0.3]} />
          <meshStandardMaterial color={structure} roughness={0.6} />
        </mesh>
        <Screen
          work="signal-field"
          seed={27}
          density={0.5}
          size={[2.6, 1.5]}
          position={[1.6, 2, -2.84]}
          materials={materials}
        />
        <mesh position={[-2.4, 0.6, -1.6]}>
          <boxGeometry args={[0.8, 1.2, 0.6]} />
          <meshStandardMaterial color={structure} roughness={0.4} />
        </mesh>
        <pointLight position={[0, 2.5, 1]} intensity={14} distance={10} color={colors["gen-3"]} />
      </group>
    </>
  )
}

export default function VenueSceneCanvas(props: VenueSceneCanvasProps) {
  return (
    <Canvas
      camera={{ position: KEYS[0]![0], fov: 42, near: 0.1, far: 120 }}
      dpr={[1, 1.75]}
      frameloop={props.animate ? "always" : "demand"}
      gl={{ antialias: true, preserveDrawingBuffer: true, powerPreference: "high-performance" }}
      eventSource={typeof document !== "undefined" ? document.body : undefined}
      eventPrefix="client"
      aria-hidden
    >
      <Venue {...props} />
    </Canvas>
  )
}
