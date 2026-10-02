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
