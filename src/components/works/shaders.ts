// GLSL sources for generative works. Every shader receives the same uniforms
// (the work contract): uTime, uSeed, uDensity, uResolution, uC1..uC4.

export const vertexShader = /* glsl */ `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}
`

const common = /* glsl */ `
precision highp float;
varying vec2 vUv;
uniform float uTime;
uniform float uSeed;
uniform float uDensity;
uniform vec2 uResolution;
uniform vec3 uC1;
uniform vec3 uC2;
uniform vec3 uC3;
uniform vec3 uC4;

float hash(vec2 p) {
  p = fract(p * vec2(123.34, 456.21) + uSeed * 0.137);
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
             mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
}

float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  for (int i = 0; i < 5; i++) {
    v += a * noise(p);
    p *= 2.02;
    a *= 0.5;
  }
  return v;
}

vec2 aspectUv() {
  vec2 uv = vUv;
  uv.x *= uResolution.x / max(uResolution.y, 1.0);
  return uv;
}
`

/** Signal Field — domain-warped noise, slow tidal motion. */
export const signalField = /* glsl */ `
${common}
void main() {
  vec2 uv = aspectUv() * (1.5 + uDensity * 3.0);
  float t = uTime * 0.06;
  vec2 q = vec2(fbm(uv + t), fbm(uv + vec2(5.2, 1.3) - t));
  vec2 r = vec2(fbm(uv + 4.0 * q + vec2(1.7, 9.2) + t), fbm(uv + 4.0 * q + vec2(8.3, 2.8)));
  float f = fbm(uv + 4.0 * r);
  vec3 col = mix(uC2 * 0.18, uC2, clamp(f * f * 2.0, 0.0, 1.0));
  col = mix(col, uC3, clamp(length(q) * 0.6, 0.0, 1.0) * 0.55);
  col = mix(col, uC1, smoothstep(0.62, 0.9, f));
  col *= 0.35 + 0.65 * f;
  gl_FragColor = vec4(col, 1.0);
}
`

/** Contour — iso-lines over a noise height map, like a living topographic print. */
export const contour = /* glsl */ `
${common}
void main() {
  vec2 uv = aspectUv() * (1.0 + uDensity * 2.0);
  float h = fbm(uv * 1.6 + vec2(uTime * 0.03, -uTime * 0.02));
  float bands = 10.0 + uDensity * 30.0;
  float l = abs(fract(h * bands) - 0.5) / fwidth(h * bands);
  float line = 1.0 - clamp(l, 0.0, 1.0);
  vec3 bg = uC4 * 0.04;
  vec3 col = mix(bg, mix(uC2, uC1, h), line);
  col += uC3 * smoothstep(0.7, 0.75, h) * 0.15;
  gl_FragColor = vec4(col, 1.0);
}
`

/** Lattice — a drifting grid of cells that pulse with noise. */
export const lattice = /* glsl */ `
${common}
void main() {
  vec2 uv = aspectUv();
  float cells = 8.0 + floor(uDensity * 40.0);
  vec2 g = uv * cells;
  vec2 id = floor(g);
  vec2 f = fract(g) - 0.5;
  float n = noise(id * 0.15 + uTime * 0.08);
  float size = 0.08 + 0.38 * n;
  float d = max(abs(f.x), abs(f.y));
  float sq = 1.0 - smoothstep(size, size + 0.02, d);
  vec3 col = mix(uC4 * 0.03, mix(uC2, uC1, step(0.72, n)), sq);
  col = mix(col, uC3, sq * step(0.9, hash(id)) * 0.8);
  gl_FragColor = vec4(col, 1.0);
}
`

/** Vertex shader for generative works mapped onto 3D surfaces (screens in the venue scene). */
export const meshVertexShader = /* glsl */ `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`

/**
 * Particle wordmark. Each point has a target (a pixel of the wordmark) and a seeded scatter
 * position. uScatter (scroll) blends between them; the pointer pushes points away.
 * uTime is frozen when site motion is off, so the frame is deterministic.
 */
export const particleVertexShader = /* glsl */ `
uniform float uTime;
uniform float uScatter;
uniform vec2 uPointer;
uniform float uPointerStrength;
uniform float uSize;
uniform float uPixelRatio;
attribute vec3 aScatter;
attribute float aRandom;
varying float vRandom;
varying float vGlow;

void main() {
  vRandom = aRandom;
  float t = uTime * (0.25 + aRandom * 0.35);
  vec3 drift = vec3(sin(t + aRandom * 31.0), cos(t * 1.3 + aRandom * 17.0), sin(t * 0.7)) * 0.012;
  float s = smoothstep(0.0, 1.0, clamp(uScatter * (0.7 + aRandom * 0.6), 0.0, 1.0));
  vec3 p = mix(position + drift, aScatter, s);

  vec2 d = p.xy - uPointer;
  float dist = length(d);
  float push = uPointerStrength * smoothstep(0.16, 0.0, dist);
  p.xy += normalize(d + 1e-5) * push * 0.08;
  p.z += push * 0.4;
  vGlow = push;

  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  gl_Position = projectionMatrix * mv;
  gl_PointSize = uSize * uPixelRatio * (0.6 + aRandom * 0.8) * (1.0 + push * 1.5) / -mv.z;
}
`

export const particleFragmentShader = /* glsl */ `
precision highp float;
uniform vec3 uC1;
uniform vec3 uC2;
uniform vec3 uC3;
uniform vec3 uC4;
varying float vRandom;
varying float vGlow;

void main() {
  vec2 c = gl_PointCoord - 0.5;
  float r = length(c);
  if (r > 0.5) discard;
  float a = smoothstep(0.5, 0.1, r);
  vec3 col = vRandom < 0.08 ? uC1 : vRandom < 0.55 ? uC4 : vRandom < 0.8 ? uC2 : uC3;
  col = mix(col, uC1, vGlow);
  gl_FragColor = vec4(col, a * (0.55 + vGlow * 0.45));
}
`

/**
 * Ripples from visitors on an interactive floor. uPoints: up to 8 visitors as (u, v, active)
 * in the floor's UV space. Additive, so it lights up the generative floor underneath.
 */
export const rippleFragmentShader = /* glsl */ `
precision highp float;
varying vec2 vUv;
uniform float uTime;
uniform vec3 uPoints[8];
uniform vec3 uColor;

void main() {
  float a = 0.0;
  for (int i = 0; i < 8; i++) {
    vec3 p = uPoints[i];
    if (p.z < 0.5) continue;
    float d = distance(vUv, p.xy);
    float ring = sin(d * 70.0 - uTime * 5.0 + float(i)) * 0.5 + 0.5;
    a += pow(ring, 6.0) * smoothstep(0.22, 0.0, d);
    a += smoothstep(0.035, 0.0, d) * 0.8; // footprint glow
  }
  gl_FragColor = vec4(uColor * a * 0.9, a);
}
`
