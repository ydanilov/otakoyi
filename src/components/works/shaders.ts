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

// Optional shared field: a work on one of several surfaces samples one continuous field
// (uDomO + vUv.x * uDomU + vUv.y * uDomV), so content flows across walls and floor.
uniform float uDomOn;
uniform vec2 uDomO;
uniform vec2 uDomU;
uniform vec2 uDomV;
// Pointer in field coordinates (same space as aspectUv) and how strongly it acts (0 = off).
uniform vec2 uPointer;
uniform float uPointerAmt;

vec2 aspectUv() {
  if (uDomOn > 0.5) return uDomO + vUv.x * uDomU + vUv.y * uDomV;
  vec2 uv = vUv;
  uv.x *= uResolution.x / max(uResolution.y, 1.0);
  return uv;
}

// The pointer bends the field around it, like a hand in front of a projection.
vec2 pointerWarp(vec2 uv) {
  vec2 d = uv - uPointer;
  float r2 = dot(d, d);
  float k = uPointerAmt * exp(-r2 * 9.0);
  float a = k * 1.6;
  d = mat2(cos(a), -sin(a), sin(a), cos(a)) * d;
  return uPointer + d * (1.0 + k * 0.35);
}
float pointerGlow(vec2 uv) {
  vec2 d = uv - uPointer;
  return uPointerAmt * exp(-dot(d, d) * 22.0);
}
`

/** Signal Field — domain-warped noise, slow tidal motion. */
export const signalField = /* glsl */ `
${common}
void main() {
  vec2 base = pointerWarp(aspectUv());
  vec2 uv = base * (1.5 + uDensity * 3.0);
  float t = uTime * 0.06;
  vec2 q = vec2(fbm(uv + t), fbm(uv + vec2(5.2, 1.3) - t));
  vec2 r = vec2(fbm(uv + 4.0 * q + vec2(1.7, 9.2) + t), fbm(uv + 4.0 * q + vec2(8.3, 2.8)));
  float f = fbm(uv + 4.0 * r);
  vec3 col = mix(uC2 * 0.18, uC2, clamp(f * f * 2.0, 0.0, 1.0));
  col = mix(col, uC3, clamp(length(q) * 0.6, 0.0, 1.0) * 0.55);
  col = mix(col, uC1, smoothstep(0.62, 0.9, f));
  col *= 0.35 + 0.65 * f;
  col += uC1 * pointerGlow(base) * 0.35;
  gl_FragColor = vec4(col, 1.0);
}
`

/** Contour — iso-lines over a noise height map, like a living topographic print. */
export const contour = /* glsl */ `
${common}
void main() {
  vec2 base = pointerWarp(aspectUv());
  vec2 uv = base * (1.0 + uDensity * 2.0);
  // The pointer raises a hill in the terrain: iso-lines gather into rings around it and glow.
  vec2 pd = base - uPointer;
  float hill = uPointerAmt * exp(-dot(pd, pd) * 14.0);
  float h0 = fbm(uv * 1.6 + vec2(uTime * 0.03, -uTime * 0.02));
  float h = h0 + hill * 0.45;
  float bands = 10.0 + uDensity * 30.0;
  float l = abs(fract(h * bands) - 0.5) / fwidth(h * bands);
  float line = 1.0 - clamp(l, 0.0, 1.0);
  vec3 bg = uC4 * 0.04;
  vec3 col = mix(bg, mix(uC2, uC1, h), line);
  col += uC1 * line * smoothstep(0.1, 0.8, hill) * 0.9;
  col += uC3 * smoothstep(0.7, 0.75, h0) * 0.15;
  gl_FragColor = vec4(col, 1.0);
}
`

/** Lattice — a drifting grid of cells that pulse with noise. */
export const lattice = /* glsl */ `
${common}
void main() {
  vec2 uv = pointerWarp(aspectUv());
  float cells = 8.0 + floor(uDensity * 40.0);
  vec2 g = uv * cells;
  vec2 id = floor(g);
  vec2 f = fract(g) - 0.5;
  float n = noise(id * 0.15 + uTime * 0.08);
  // Cells near the pointer swell and light up in accent, like people stepping in front of a wall.
  vec2 c = (id + 0.5) / cells - uPointer;
  float near = uPointerAmt * exp(-dot(c, c) * 18.0);
  float size = min(0.46, 0.08 + 0.38 * n + near * 0.32);
  float d = max(abs(f.x), abs(f.y));
  float sq = 1.0 - smoothstep(size, size + 0.02, d);
  vec3 col = mix(uC4 * 0.03, mix(uC2, uC1, step(0.72, n)), sq);
  col = mix(col, uC3, sq * step(0.9, hash(id)) * 0.8);
  col = mix(col, uC1, sq * smoothstep(0.25, 0.75, near));
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

/**
 * Bloom — a flower of translucent silk and smoke. Layers of broad petals billow like ink in
 * water, light glows through their edges, a warm core opens, and every so often the whole bloom
 * drifts up into smoke while the next one opens underneath. Each bloom differs (petal counts,
 * curl, tilt) from the seed, so the screen never repeats within a day.
 */
export const bloom = /* glsl */ `
${common}
#define PI 3.14159265
float h1(float n) { return fract(sin(n * 127.1 + uSeed * 3.7) * 43758.5453); }
mat2 rot(float a) { float c = cos(a), s = sin(a); return mat2(c, -s, s, c); }

vec3 bloomAt(vec2 uv, float t, float cyc, float ph, inout float dens) {
  float s0 = h1(cyc);
  float undo = smoothstep(0.62, 1.0, ph) * 0.92;
  float open = smoothstep(0.0, 0.45, ph);
  vec2 q = uv;
  q.y -= undo * undo * 0.35;                              // drifts up as it comes undone
  q = rot((s0 - 0.5) * 0.9 + t * 0.03) * q;
  q.y *= 0.82;                                            // a little taller than wide
  vec3 col = vec3(0.0);
  float size = (0.36 + 0.08 * uDensity) * (0.35 + 0.65 * open) * (1.0 + undo * 0.35);
  for (int k = 0; k < 7; k++) {
    float fk = float(k);
    float lk = 1.0 - fk * 0.1;
    float n = 3.0 + floor(h1(cyc + fk * 7.0) * 3.0);
    float dir = mod(fk, 2.0) < 1.0 ? 1.0 : -1.0;
    vec2 wq = q + (vec2(fbm(q * 2.1 + vec2(fk * 1.3, t * 0.35)), fbm(q * 2.1 + vec2(t * -0.3, fk * 2.1))) - 0.5) * (0.2 + undo * 0.35);
    float r = length(wq);
    float a = atan(wq.y, wq.x);
    float curl = 0.7 * sin(r * 7.0 - t * 0.8 + fk);
    float lobe = 0.5 + 0.5 * cos(a * n + h1(cyc + fk * 3.3) * 6.28 + dir * t * 0.06 + curl);
    float R = size * lk;
    float edge = R * (0.42 + 0.58 * pow(lobe, 1.4)) * (1.0 + (fbm(vec2(a * 3.0 + fk, t * 0.15 + fk)) - 0.5) * 0.35);
    float sheet = smoothstep(edge, edge * 0.35, r);
    float rim = exp(-pow((r - edge * 0.93) / (0.012 + 0.03 * lk), 2.0)) * (0.35 + 0.65 * lobe);
    float streak = fbm(vec2(a * 14.0 / n + curl, r * 2.5 - t * 0.12 + fk));
    float erode = smoothstep(undo * 1.1 - 0.1, undo * 1.1 + 0.05, fbm(wq * 4.0 + fk + t * 0.4) + (1.0 - r / max(edge, 1e-3)) * 0.4);
    float depth = fk / 6.0;                               // 0 outer … 1 core
    vec3 tint = mix(mix(uC2, uC3, smoothstep(0.0, 0.6, depth + streak * 0.3)), uC1, smoothstep(0.55, 1.0, depth + 0.25 * (1.0 - r / max(R, 1e-3))));
    tint = mix(tint, uC3, 0.25 * sin(a * 2.0 + fk + t * 0.2) + 0.1);   // iridescent drift
    col *= 1.0 - sheet * 0.32 * erode;                    // inner layers shade the ones behind
    col += tint * (sheet * (0.13 + 0.2 * streak) + rim * 0.42) * erode;
    dens += sheet * 0.2 * erode;
  }
  return col;
}

void main() {
  vec2 uv = vUv - 0.5;
  uv.x *= uResolution.x / max(uResolution.y, 1.0);
  float t = uTime;
  float period = 18.0;
  float T = t / period;
  float cyc = floor(T);
  float ph = fract(T);
  vec2 c = vec2((h1(cyc + 1.3) - 0.5) * 0.18, (h1(cyc + 2.1) - 0.5) * 0.08);
  float dens = 0.0;
  vec3 col = bloomAt((uv - c) * mix(1.12, 0.94, ph), t, cyc, ph, dens);
  // the previous bloom still dissolving into smoke for the first moments of the next one
  if (ph < 0.2) {
    vec2 cp = vec2((h1(cyc - 1.0 + 1.3) - 0.5) * 0.18, (h1(cyc - 1.0 + 2.1) - 0.5) * 0.08);
    float d2 = 0.0;
    col += bloomAt((uv - cp) * 0.94, t, cyc - 1.0, 0.92 + ph * 0.4, d2) * (1.0 - ph / 0.2);
  }
  // smoke rising from the bloom
  vec2 sp = uv - c;
  float sm = fbm(vec2(sp.x * 2.4 + fbm(sp * 3.0 + t * 0.05) * 1.5, sp.y * 1.6 - t * 0.09));
  float column = smoothstep(0.55, 0.0, abs(sp.x) * 1.4) * smoothstep(-0.25, 0.35, sp.y);
  col += mix(uC2, uC3, sm) * smoothstep(0.42, 0.8, sm) * column * 0.22;
  // floating dust
  vec2 gp = (uv + vec2(0.0, t * 0.01)) * 170.0;
  col += uC1 * step(0.9972, hash(floor(gp))) * smoothstep(0.5, 0.05, length(fract(gp) - 0.5)) * 0.6;
  col = 1.0 - exp(-col * 1.15);                           // soft tone map keeps silk translucent
  col = mix(vec3(dot(col, vec3(0.333))), col, 1.3);       // keep the hue in the bright core
  col += uC4 * 0.02;
  col *= smoothstep(1.3, 0.3, length(uv));
  col += (hash(vUv * uResolution + fract(t)) - 0.5) * 0.02;
  gl_FragColor = vec4(max(col, 0.0), 1.0);
}
`

/**
 * Ribbed Glass — a soft ring of light seen through fluted glass. Each vertical rib is a small
 * cylinder lens: it flips and stretches its own slice of the light, splits it into colour at the
 * edges and catches a thin specular line. Film grain on top. The pointer pulls the light.
 */
export const ribbedGlass = /* glsl */ `
${common}
float asp() { return uResolution.x / max(uResolution.y, 1.0); }

// The light behind the glass: a slow ring with a cool rim, a warm hot spot and a white core.
vec3 scene(vec2 p, float t) {
  float a = asp();
  float sc = min(a, 1.0);
  vec2 c = vec2(a * mix(0.5, 0.64, sc) + 0.06 * sin(t * 0.13 + uSeed), mix(0.62, 0.52, sc) + 0.05 * cos(t * 0.11));
  c = mix(c, uPointer, 0.22 * uPointerAmt);
  vec2 d = (p - c) / sc;
  float r = length(d * vec2(1.0, 0.9));
  float ang = atan(d.y, d.x);
  float R = 0.34 + 0.025 * sin(t * 0.21);
  float ring = exp(-pow((r - R) / 0.07, 2.0));
  float halo = exp(-pow((r - R) / 0.2, 2.0));
  vec3 cyan = mix(uC4, uC1, 0.15);
  float ha = t * 0.19 + 2.3 + uSeed * 0.3;
  vec2 hp = vec2(cos(ha), sin(ha)) * R;
  float hot = exp(-dot(d - hp, d - hp) / 0.012);
  float cool = 1.0 - smoothstep(0.0, 0.6, hot);
  vec3 col = uC2 * halo * 0.5 * cool;
  col += uC2 * ring * (0.9 + 0.6 * sin(ang + t * 0.27)) * cool;
  col += cyan * ring * smoothstep(-0.4, 1.0, cos(ang - 0.7 + t * 0.17)) * 2.2 * cool;
  col += uC1 * pow(ring, 2.0) * smoothstep(0.3, 1.0, cos(ang - 0.4 + t * 0.17)) * 2.0;
  col += uC3 * hot * 3.0;
  col += mix(uC3, uC1, 0.5) * exp(-dot(d - hp, d - hp) / 0.0025) * 1.5;
  // The pointer brings a little light of its own.
  col += cyan * pointerGlow(p) * 0.25;
  return col;
}

void main() {
  vec2 p = aspectUv();
  float t = uTime;
  float ribs = 10.0 + uDensity * 30.0;
  // Ribs keep a similar on-screen width on phones and desktops.
  float w = (0.5 + 0.5 * min(asp(), 1.0)) / ribs;
  float x = p.x / w;
  float id = floor(x);
  float s = fract(x) - 0.5;
  float cx = (id + 0.5) * w;
  float j = hash(vec2(id, 7.0)) - 0.5;
  // Cylinder lens: the slice is flipped and magnified, more at the edges; colour splits there.
  float k = 1.9 + j * 1.4;
  float bend = s * w;
  float yb = (s * s) * 0.06 + j * 0.03;
  vec3 col;
  col.r = scene(vec2(cx + bend * (1.0 - k * 0.94), p.y + yb), t).r;
  col.g = scene(vec2(cx + bend * (1.0 - k), p.y + yb), t).g;
  col.b = scene(vec2(cx + bend * (1.0 - k * 1.08), p.y + yb), t).b;
  // Glass body: a soft cylinder shade, a dark seam and a thin specular line at each edge.
  float e = 0.5 - abs(s);
  col *= 0.55 + 0.45 * cos(s * 2.8);
  col *= smoothstep(0.0, 0.05, e);
  vec3 behind = scene(vec2(cx, p.y), t);
  float lum = dot(behind, vec3(0.3, 0.5, 0.2));
  float spec = exp(-pow((e - 0.06) / 0.014, 2.0)) * step(0.0, s);
  col += (uC1 * 0.05 + behind * 1.4) * spec * (0.2 + lum);
  // Soft tone curve, then film grain.
  col = 1.0 - exp(-col * 1.15);
  float g = hash(gl_FragCoord.xy + fract(t * 7.0) * 113.0) - 0.5;
  col += g * 0.07;
  gl_FragColor = vec4(max(col, 0.0), 1.0);
}
`
