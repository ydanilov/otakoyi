"use client"

import { useEffect, useMemo, useRef } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import * as THREE from "three"

import { generativePalette, type GenerativeMode } from "@/lib/tokens.generated"

/** Four colors in the order gen-1 (highlight), gen-2 (base), gen-3 (secondary), gen-4 (ink). */
export type BrandColors = readonly [string, string, string, string]
import { vertexShader } from "./shaders"

export type ShaderCanvasProps = {
  fragmentShader: string
  seed: number
  density: number
  palette: GenerativeMode
  /** Client brand colors. Overrides the token palette when set. */
  brandColors?: BrandColors
  animate: boolean
  /** Fixed time used when `animate` is false — makes renders deterministic for visual tests. */
  frozenTime: number
  /** Called after the first frame has been drawn. */
  onReady?: () => void
}

function Plane({
  fragmentShader,
  seed,
  density,
  palette,
  brandColors,
  animate,
  frozenTime,
  onReady,
}: ShaderCanvasProps) {
  const reported = useRef(false)
  const material = useRef<THREE.ShaderMaterial>(null)
  const { size, invalidate } = useThree()
  const tokenColors = generativePalette[palette]
  const colors = brandColors
    ? {
        "gen-1": brandColors[0],
        "gen-2": brandColors[1],
        "gen-3": brandColors[2],
        "gen-4": brandColors[3],
      }
    : tokenColors

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
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps -- uniforms are mutated in useFrame
    [],
  )

  // In demand mode, re-render when the contract props change.
  useEffect(() => {
    invalidate()
  }, [seed, density, palette, brandColors, frozenTime, invalidate])

  useFrame((state) => {
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
