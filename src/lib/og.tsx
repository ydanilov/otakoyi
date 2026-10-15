import { readFile } from "node:fs/promises"
import { join } from "node:path"
import { ImageResponse } from "next/og"

import { site } from "@/config/site"
import { themeHex } from "@/lib/tokens.generated"

/** Open Graph / Twitter card size. */
export const ogSize = { width: 1200, height: 630 }
export const ogContentType = "image/png"

const ASSETS = join(process.cwd(), "src/assets/og")
const c = themeHex.dark

/** Token hex → rgba (the OG renderer ignores 8-digit hex). */
const alpha = (hex: string, a: number) => {
  const n = parseInt(hex.slice(1), 16)
  // eslint-disable-next-line no-restricted-syntax -- composes a token value, not a raw color
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${a})`
}

const fonts = Promise.all([
  readFile(join(ASSETS, "Geist-Medium.ttf")),
  readFile(join(ASSETS, "GeistMono-Regular.ttf")),
  readFile(join(ASSETS, "NewRocker-Regular.ttf")),
])

/** Background photos are pre-cropped JPEGs (scripts/build-og-assets.py); next/og cannot read WebP. */
async function background(name: string) {
  try {
    const buf = await readFile(join(ASSETS, "bg", `${name}.jpg`))
    return `data:image/jpeg;base64,${buf.toString("base64")}`
  } catch {
    return null
  }
}

type OgOptions = {
  /** Small mono line above the title. */
  eyebrow: string
  title: string
  /** File name in src/assets/og/bg without extension. Falls back to the home photo. */
  bg?: string
}

/** The shared social card: site photo, dark scrim, wordmark, eyebrow and title in brand type. */
export async function renderOg({ eyebrow, title, bg = "home" }: OgOptions) {
  const [sans, mono, logo] = await fonts
  const photo = (await background(bg)) ?? (await background("home"))
  const long = title.length > 48

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        position: "relative",
        background: c.background,
        color: c.foreground,
        fontFamily: "Geist",
      }}
    >
      {photo && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={photo}
          alt=""
          width={ogSize.width}
          height={ogSize.height}
          style={{ position: "absolute", top: 0, left: 0 }}
        />
      )}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: ogSize.width,
          height: ogSize.height,
          display: "flex",
          backgroundImage: `linear-gradient(90deg, ${alpha(c.background, 0.94)} 0%, ${alpha(c.background, 0.82)} 42%, ${alpha(c.background, 0.35)} 72%, ${alpha(c.background, 0.1)} 100%)`,
        }}
      />
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: ogSize.width,
          height: ogSize.height,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "56px 64px",
        }}
      >
        <div style={{ display: "flex", fontFamily: "New Rocker", fontSize: 52 }}>{site.name}</div>
        <div style={{ display: "flex", flexDirection: "column", maxWidth: 760 }}>
          <div
            style={{
              display: "flex",
              fontFamily: "Geist Mono",
              fontSize: 22,
              letterSpacing: 4,
              textTransform: "uppercase",
              color: c.signal,
              marginBottom: 20,
            }}
          >
            {eyebrow}
          </div>
          <div
            style={{
              display: "flex",
              fontSize: long ? 64 : 80,
              lineHeight: 1,
              letterSpacing: long ? -2 : -3,
            }}
          >
            {title}
          </div>
        </div>
      </div>
    </div>,
    {
      ...ogSize,
      fonts: [
        { name: "Geist", data: sans, weight: 500, style: "normal" },
        { name: "Geist Mono", data: mono, weight: 400, style: "normal" },
        { name: "New Rocker", data: logo, weight: 400, style: "normal" },
      ],
    },
  )
}
