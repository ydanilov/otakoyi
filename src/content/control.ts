/**
 * Otakoyi Control — the branded control app that ships with every installation.
 * Copy follows docs/brief.md (no trailing periods at the end of a block).
 */

export const controlApp = {
  name: "Otakoyi Control",
  path: "/control",
  /** Leads every mention of the app: what it is for, before anything else. */
  lead: "The controller for your generative installation — change what it does in real time",
  /** One line, both ends of the range: a simple controller or a full VJ console. */
  promise:
    "From a simple controller for the lobby to a full VJ console for the show — branded for you, on phone and tablet",
  included:
    "Free forever. No subscription, no hidden payments — it comes with your installation and stays yours",
} as const

/**
 * The App Store listing. The iPhone and iPad app is not published yet: keep this `null` until it
 * is — the /control hero then shows the badge with a "Coming soon" caption instead of a link.
 */
export const appStoreUrl: string | null = null

export type ControlScreen = {
  src: string
  alt: string
  width: number
  height: number
  device: "phone" | "tablet"
}

/** Real app screens (Figma file "OSC"), exported 1:1 and served through next/image. */
export const controlScreens = {
  phonePult: {
    src: "/control/phone-pult.webp",
    alt: "Phone controller for a lobby installation: scene buttons, logo, live data and audio switches, a brightness slider",
    width: 402,
    height: 874,
    device: "phone",
  },
  phonePrompts: {
    src: "/control/phone-prompts.webp",
    alt: "Phone controller with prompt presets for generative visuals and an A/B prompt mix slider",
    width: 402,
    height: 874,
    device: "phone",
  },
  phoneLoading: {
    src: "/control/phone-loading.webp",
    alt: "The app opening in a client's brand: the client's logo and loading image while it connects to the installation",
    width: 402,
    height: 874,
    device: "phone",
  },
  phoneInstallation: {
    src: "/control/phone-installation.webp",
    alt: "Installation panel on a phone: status, controllers, Flash, Restart and Blackout buttons and Idle mode",
    width: 402,
    height: 874,
    device: "phone",
  },
  tabletVj: {
    src: "/control/tablet-vj.webp",
    alt: "VJ console on a tablet: layer faders, knobs for hue, speed, zoom and rotation, a camera thumbstick and scene buttons",
    width: 1210,
    height: 834,
    device: "tablet",
  },
  tabletPrompts: {
    src: "/control/tablet-prompts.webp",
    alt: "Prompt presets for generative visuals on a tablet, with a prompt mix and room sound levels",
    width: 1210,
    height: 834,
    device: "tablet",
  },
} as const satisfies Record<string, ControlScreen>

export const controlUseCases = [
  {
    eyebrow: "Lobbies and permanent installations",
    title: "A simple controller on a phone",
    body: "Reception and facilities staff switch scenes and modes, set the brightness and run safe actions. Nothing to learn, nothing to break",
    points: ["Real-time control", "Scenes and modes", "Brightness", "Safe actions only"],
    screen: controlScreens.phonePult,
  },
  {
    eyebrow: "Live events and shows",
    title: "A full VJ console on a tablet",
    body: "Your operator plays the installation live: faders, knobs, thumbsticks, layer groups and prompt presets for generative visuals, with ×0.2 fine adjustment for the precise moments",
    points: [
      "Real-time control",
      "Faders, knobs and thumbsticks",
      "Layer groups",
      "Prompt presets",
      "×0.2 fine adjustment",
    ],
    screen: controlScreens.tabletVj,
  },
] as const

export const controlSteps = [
  {
    title: "Show the QR",
    body: "The installation shows a pairing code on its own screen",
  },
  {
    title: "Scan it",
    body: "Point the phone or tablet camera at it. No accounts, no passwords",
  },
  {
    title: "Run the show",
    body: "The controller opens in your brand — from then on you steer the installation live, in real time",
  },
] as const

export const controlFeatures = [
  {
    title: "Live, in real time",
    body: "The controller for your generative installation — change what it does while it runs, and see it on the screens at once",
  },
  {
    title: "Your brand, built in",
    body: "Your colours, logo and loading image. We design it for your installation; you never configure a thing",
  },
  {
    title: "Phone and tablet",
    body: "Every delivery ships both layouts: a calm controller for the phone and a console for the tablet",
  },
  {
    title: "Pair by QR",
    body: "Scan the code on the installation's screen and you are in. No accounts or passwords to manage",
  },
  {
    title: "One in control, everyone in sync",
    body: "One device controls at a time and every other one sees the live state. Hand over with one tap",
  },
  {
    title: "The studio has your back",
    body: "We can always take over remotely, so help is one message away during the show",
  },
  {
    title: "Installation actions",
    body: "Flash to identify a screen, Restart, Blackout (hold to confirm), Idle mode to stop reacting to people, and an activity log",
  },
  {
    title: "Works in a browser too",
    body: "A web version runs in any browser on the installation's network — a backup that is always there",
  },
] as const

export const controlFaq = [
  {
    q: "Does the control app cost extra?",
    a: "No. Free forever. No subscription, no hidden payments — it comes with your installation and stays yours",
  },
  {
    q: "Can I download it from the App Store?",
    a: "Not yet. The iPhone and iPad app is in beta and coming to the App Store. The web version works today in any browser on the installation's network",
  },
  {
    q: "Do my staff need accounts or passwords?",
    a: "No. They scan the QR on the installation's screen and get control within seconds",
  },
  {
    q: "What if two people try to control it at once?",
    a: "One device controls at a time and everyone else sees the live state. Handing over takes one tap, and the studio can always take over remotely",
  },
  {
    q: "Can we change the branding ourselves?",
    a: "You don't need to. We design the controller for your installation in your colours, logo and loading image as part of the delivery",
  },
  {
    q: "What does it work with?",
    a: "Made for Otakoyi installations. We build the dashboard for each project around what you need to run",
  },
  {
    q: "What runs on the installation computer?",
    a: "Works on Windows, macOS and Linux. The bridge sets itself up and starts together with the installation — nothing to configure",
  },
  {
    q: "Is there an Android version?",
    a: "Later. Until then, Android phones and tablets can use the web version in the browser",
  },
] as const
