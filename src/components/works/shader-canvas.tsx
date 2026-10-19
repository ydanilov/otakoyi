"use client"

import { useEffect, useMemo, useRef } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import * as THREE from "three"

import { generativePalette } from "@/lib/tokens.generated"

/** Four colors in the order gen-1 (highlight), gen-2 (base), gen-3 (secondary), gen-4 (ink). */
export type BrandColors = readonly [string, string, string, string]

/** Where a surface sits in a field shared with other surfaces (see `aspectUv` in shaders.ts). */
export type WorkDomain = {
  o: readonly [number, number]
  u: readonly [number, number]
  v: readonly [number, number]
}

/** Live pointer in field coordinates; `on` fades the reaction in and out. Mutated, not rendered. */
export type WorkPointer = { x: number; y: number; on: boolean }

import { vertexShader } from "./shaders"

export type ShaderCanvasProps = {
  fragmentShader: string
  seed: number
  density: number
  /** Client brand colors. Overrides the token palette when set. */
  brandColors?: BrandColors
  animate: boolean
  /** Fixed time used when `animate` is false — makes renders deterministic for visual tests. */
  frozenTime: number
  /** Called after the first frame has been drawn. */
  onReady?: () => void
  /** Sample a field shared with other surfaces instead of this canvas' own UV. */
  domain?: WorkDomain
  /** React to a pointer (in field coordinates). */
  pointer?: { current: WorkPointer | null }
}

function Plane({
  fragmentShader,
  seed,
  density,
  brandColors,
  animate,
  frozenTime,
  onReady,
  domain,
  pointer,
}: ShaderCanvasProps) {
  const reported = useRef(false)
  const material = useRef<THREE.ShaderMaterial>(null)
  const { size, invalidate } = useThree()
  const colors = brandColors
    ? {
        "gen-1": brandColors[0],
        "gen-2": brandColors[1],
        "gen-3": brandColors[2],
        "gen-4": brandColors[3],
      }
    : generativePalette

  const uniforms = useMemo(
    () => ({
      uTime: { value: frozenTime },
      uSeed: { value: seed },
      uDensity: { value: density },
      uResolution: { value: new THREE.Vector2(size.width, size.height) },
      uC1: { value: new THREE.Color(colors["gen-1"]) },
      uC2: { value: new THREE.Color(colors["gen-2"]) },
      uC3: { value: new THREE.Color(colors["gen-3"]) },
      uC4: { value: new THREE.Color(colors["gen-4"]) },
      uDomOn: { value: 0 },
      uDomO: { value: new THREE.Vector2() },
      uDomU: { value: new THREE.Vector2(1, 0) },
      uDomV: { value: new THREE.Vector2(0, 1) },
      uPointer: { value: new THREE.Vector2(-9, -9) },
      uPointerAmt: { value: 0 },
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps -- uniforms are mutated in useFrame
    [],
  )

  // In demand mode, re-render when the contract props change.
  useEffect(() => {
    invalidate()
  }, [seed, density, brandColors, frozenTime, invalidate])

  useFrame((state, delta) => {
    const m = material.current
    if (!m) return
    const u = m.uniforms
    u.uTime.value = animate ? frozenTime + state.clock.elapsedTime : frozenTime
    u.uSeed.value = seed
    u.uDensity.value = density
    u.uResolution.value.set(state.size.width, state.size.height)
    u.uC1.value.set(colors["gen-1"])
    u.uC2.value.set(colors["gen-2"])
    u.uC3.value.set(colors["gen-3"])
    u.uC4.value.set(colors["gen-4"])
    u.uDomOn.value = domain ? 1 : 0
    if (domain) {
      u.uDomO.value.set(domain.o[0], domain.o[1])
      u.uDomU.value.set(domain.u[0], domain.u[1])
      u.uDomV.value.set(domain.v[0], domain.v[1])
    }
    const p = pointer?.current
    if (p) {
      if (p.on) u.uPointer.value.set(p.x, p.y)
      const target = p.on ? 1 : 0
      u.uPointerAmt.value += (target - u.uPointerAmt.value) * Math.min(1, delta * 4)
    }
    if (!reported.current) {
      reported.current = true
      requestAnimationFrame(() => onReady?.())
    }
  })

  return (
    <mesh>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        ref={material}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
      />
    </mesh>
  )
}

export default function ShaderCanvas(props: ShaderCanvasProps) {
  return (
    <Canvas
      orthographic
      dpr={[1, 1.75]}
      // Measure the element's own size, not its on-screen box: works warped onto a screen in a
      // photo (matrix3d) would otherwise render at the shrunken, transformed size.
      resize={{ offsetSize: true }}
      frameloop={props.animate ? "always" : "demand"}
      gl={{ antialias: false, preserveDrawingBuffer: true, powerPreference: "high-performance" }}
      aria-hidden
    >
      <Plane {...props} />
    </Canvas>
  )
}
