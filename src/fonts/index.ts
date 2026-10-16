import localFont from "next/font/local"

// Self-hosted Geist (no network at build time; works in Next and Storybook alike).
// Subset to Latin + punctuation/arrows/€ used on the site (~34 KB each instead of ~70 KB).
export const fontSans = localFont({
  src: "./Geist-Variable.woff2",
  variable: "--font-geist-sans",
  weight: "100 900",
  display: "swap",
})

export const fontMono = localFont({
  src: "./GeistMono-Variable.woff2",
  variable: "--font-geist-mono",
  weight: "100 900",
  display: "swap",
  // Small labels only: don't compete with the body face for the first paint.
  preload: false,
})

// Wordmark only: New Rocker (SIL OFL 1.1, see NewRocker-OFL.txt), latin subset.
export const fontLogo = localFont({
  src: "./NewRocker-Regular.woff2",
  variable: "--font-new-rocker",
  weight: "400",
  display: "swap",
})
