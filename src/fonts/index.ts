import localFont from "next/font/local"

// Self-hosted Geist (no network at build time; works in Next and Storybook alike).
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
})

// Wordmark only: New Rocker (SIL OFL 1.1, see NewRocker-OFL.txt), latin subset.
export const fontLogo = localFont({
  src: "./NewRocker-Regular.woff2",
  variable: "--font-new-rocker",
  weight: "400",
  display: "swap",
})
