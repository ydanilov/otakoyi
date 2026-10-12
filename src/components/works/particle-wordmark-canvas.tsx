"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import * as THREE from "three"

import { generativePalette, type GenerativeMode } from "@/lib/tokens.generated"
import { seeded } from "./runtime"
import { particleFragmentShader, particleVertexShader } from "./shaders"

export type ParticleWordmarkCanvasProps = {
  text: string
  seed: number
  palette: GenerativeMode
  /** 0 = wordmark assembled, 1 = fully scattered. */
  scatter: number
  /** Live time + pointer. Off → frozen, deterministic frame. */
  animate: boolean
  onReady?: () => void
}

const MAX_POINTS = 14000
const FROZEN_TIME = 4

/** Rasterise the wordmark and return points in a unit box (x ∈ [-1, 1]) plus its aspect. */
function sampleText(text: string, seed: number) {
  const fontSize = 240
  const family = getComputedStyle(document.body).fontFamily || "sans-serif"
  const font = `600 ${fontSize}px ${family}`
  const probe = document.createElement("canvas").getContext("2d")!
  probe.font = font
  const w = Math.ceil(probe.measureText(text).width) + 40
  const h = Math.ceil(fontSize * 1.2)
  const canvas = document.createElement("canvas")
  canvas.width = w
  canvas.height = h
  const ctx = canvas.getContext("2d")!
  ctx.font = font
  ctx.fillStyle = generativePalette.dark["gen-4"] // any opaque fill: only alpha is sampled
  ctx.textBaseline = "middle"
  ctx.fillText(text, 20, h / 2)
  const data = ctx.getImageData(0, 0, w, h).data

  const all: number[] = []
  const step = 3
  for (let y = 0; y < h; y += step) {
    for (let x = 0; x < w; x += step) {
      if ((data[(y * w + x) * 4 + 3] ?? 0) > 128) all.push(x, y)
    }
  }
  const rand = seeded(seed)
  const total = all.length / 2
  const keep = Math.min(total, MAX_POINTS)
  const ratio = keep / Math.max(1, total)
  const out: number[] = []
  for (let i = 0; i < total && out.length / 3 < keep; i++) {
    if (rand() > ratio) continue
    const x = all[i * 2]!
    const y = all[i * 2 + 1]!
    out.push((x / w) * 2 - 1, -((y / h) * 2 - 1) * (h / w), 0)
  }
  return { points: new Float32Array(out), aspect: w / h }
}

function Points({ text, seed, palette, scatter, animate, onReady }: ParticleWordmarkCanvasProps) {
  const { viewport, gl, invalidate } = useThree()
  const [sample, setSample] = useState<{ points: Float32Array; aspect: number } | null>(null)
  const material = useRef<THREE.ShaderMaterial>(null)
  const group = useRef<THREE.Group>(null)
  const pointer = useRef(new THREE.Vector2(9, 9))
  const strength = useRef(0)
  const reported = useRef(false)

  useEffect(() => {
    let alive = true
    document.fonts.ready.then(() => alive && setSample(sampleText(text, seed)))
    return () => {
      alive = false
    }
  }, [text, seed])

  const geometry = useMemo(() => {
    if (!sample) return null
    const n = sample.points.length / 3
    const rand = seeded(seed * 7 + 1)
    const scatterPos = new Float32Array(n * 3)
    const random = new Float32Array(n)
    for (let i = 0; i < n; i++) {
      scatterPos[i * 3] = (rand() - 0.5) * 6
      scatterPos[i * 3 + 1] = (rand() - 0.5) * 4
      scatterPos[i * 3 + 2] = (rand() - 0.5) * 3
      random[i] = rand()
    }
    const g = new THREE.BufferGeometry()
    g.setAttribute("position", new THREE.BufferAttribute(sample.points, 3))
    g.setAttribute("aScatter", new THREE.BufferAttribute(scatterPos, 3))
    g.setAttribute("aRandom", new THREE.BufferAttribute(random, 1))
    return g
  }, [sample, seed])

  const colors = generativePalette[palette]
  const uniforms = useMemo(
    () => ({
      uTime: { value: FROZEN_TIME },
      uScatter: { value: 0 },
      uPointer: { value: new THREE.Vector2(9, 9) },
      uPointerStrength: { value: 0 },
      uSize: { value: 9 },
      uPixelRatio: { value: 1 },
      uC1: { value: new THREE.Color() },
      uC2: { value: new THREE.Color() },
      uC3: { value: new THREE.Color() },
      uC4: { value: new THREE.Color() },
    }),
    [],
  )

  useEffect(() => invalidate(), [scatter, palette, animate, geometry, invalidate])

  useFrame((state, delta) => {
    const m = material.current
    const grp = group.current
    if (!m || !grp || !sample) return
    // Fit the wordmark to ~86% of the viewport width (and keep it within 55% of the height).
    const scale = Math.min(
      (viewport.width * 0.86) / 2,
      (viewport.height * 0.55 * sample.aspect) / 2,
    )
    grp.scale.setScalar(scale)

    const u = m.uniforms
    u.uTime.value = animate ? FROZEN_TIME + state.clock.elapsedTime : FROZEN_TIME
    u.uScatter.value = THREE.MathUtils.damp(u.uScatter.value, scatter, animate ? 6 : 1000, delta)
    u.uPixelRatio.value = gl.getPixelRatio()
    u.uSize.value = Math.max(5, 10 * (viewport.width / 6))
    u.uC1.value.set(colors["gen-1"])
    u.uC2.value.set(colors["gen-2"])
    u.uC3.value.set(colors["gen-3"])
    u.uC4.value.set(colors["gen-4"])

    // Pointer in wordmark space; strength eases in and out so the field feels physical.
    const target = animate && state.pointer.lengthSq() > 0 ? 1 : 0
    strength.current = THREE.MathUtils.damp(strength.current, target, 4, delta)
    pointer.current.set(
      (state.pointer.x * viewport.width) / 2 / scale,
      (state.pointer.y * viewport.height) / 2 / scale,
    )
    u.uPointer.value.lerp(pointer.current, Math.min(1, delta * 10))
    u.uPointerStrength.value = strength.current

    if (!reported.current) {
      reported.current = true
      requestAnimationFrame(() => onReady?.())
    }
  })

  if (!geometry) return null
  return (
    <group ref={group}>
      <points geometry={geometry}>
        <shaderMaterial
          ref={material}
          vertexShader={particleVertexShader}
          fragmentShader={particleFragmentShader}
          uniforms={uniforms}
          transparent
          depthWrite={false}
          blending={palette === "dark" ? THREE.AdditiveBlending : THREE.NormalBlending}
        />
      </points>
    </group>
  )
}

export default function ParticleWordmarkCanvas(props: ParticleWordmarkCanvasProps) {
  return (
    <Canvas
      camera={{ position: [0, 0, 2.4], fov: 45 }}
      dpr={[1, 1.75]}
      frameloop={props.animate ? "always" : "demand"}
      gl={{ antialias: false, alpha: true, preserveDrawingBuffer: true }}
      eventSource={typeof document !== "undefined" ? document.body : undefined}
      eventPrefix="client"
      aria-hidden
    >
      <Points {...props} />
    </Canvas>
  )
}
