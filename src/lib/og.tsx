import { readFile } from "node:fs/promises"
import { join } from "node:path"
import { ImageResponse } from "next/og"
import sharp from "sharp"

import { site } from "@/config/site"
import { colorHex } from "@/lib/tokens.generated"

/** Shared Open Graph card: 1200 × 630, dark theme, wordmark + eyebrow + title, optional photo. */
export const ogSize = { width: 1200, height: 630 }
export const ogContentType = "image/png"

const c = colorHex.dark
const font = (file: string) => readFile(join(process.cwd(), "assets/og", file))

/** Photos live in /public as webp; Satori only reads png/jpeg, so re-encode and crop to the slot. */
async function photo(src: string, width: number, height: number) {
  const buf = await sharp(join(process.cwd(), "public", src))
    .resize(width, height, { fit: "cover", position: "attention" })
    .jpeg({ quality: 82 })
    .toBuffer()
  return `data:image/jpeg;base64,${buf.toString("base64")}`
}

type OgCard = {
  eyebrow: string
  title: string
  /** Path under /public. Portrait photos sit in a right-hand panel, landscape ones fill the card. */
  image?: string
  layout?: "split" | "bleed"
}

export async function ogImage({ eyebrow, title, image, layout = "bleed" }: OgCard) {
  const [rocker, geist, mono] = await Promise.all([
    font("NewRocker-Regular.ttf"),
    font("Geist-Medium.ttf"),
    font("GeistMono-Medium.ttf"),
  ])
  const split = layout === "split"
  const panel = 500
  const img = image ? await photo(image, split ? panel : ogSize.width, ogSize.height) : undefined
  const titleSize = title.length > 48 ? 60 : title.length > 28 ? 72 : 88

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
      {img && (
        // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text -- Satori canvas, not DOM
        <img
          src={img}
          width={split ? panel : ogSize.width}
          height={ogSize.height}
          style={{ position: "absolute", top: 0, right: 0, objectFit: "cover" }}
        />
      )}
      {img && !split && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: ogSize.width,
            height: ogSize.height,
            display: "flex",
            backgroundImage: `linear-gradient(90deg, ${c.background} 0%, ${c.background}e6 38%, ${c.background}00 78%)`,
          }}
        />
      )}
      <div
        style={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          width: split || !img ? ogSize.width - (split ? panel : 0) : 760,
          height: "100%",
          padding: "64px 72px",
        }}
      >
        <div style={{ display: "flex", fontFamily: "New Rocker", fontSize: 56, lineHeight: 1 }}>
          {site.name}
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              fontFamily: "Geist Mono",
              fontSize: 22,
              letterSpacing: 4,
              textTransform: "uppercase",
              color: c.signal,
              marginBottom: 24,
            }}
          >
            <div style={{ width: 40, height: 3, background: c.signal, marginRight: 16 }} />
            {eyebrow}
          </div>
          <div
            style={{
              display: "flex",
              fontSize: titleSize,
              lineHeight: 1.02,
              letterSpacing: -2,
              fontWeight: 500,
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
        { name: "New Rocker", data: rocker, weight: 400, style: "normal" },
        { name: "Geist", data: geist, weight: 500, style: "normal" },
        { name: "Geist Mono", data: mono, weight: 500, style: "normal" },
      ],
    },
  )
}
