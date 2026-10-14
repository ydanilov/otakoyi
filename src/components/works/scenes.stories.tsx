import type { Meta, StoryObj } from "@storybook/nextjs-vite"

import { ParticleWordmark } from "./particle-wordmark"
import { VenueScene } from "./venue-scene"

/** 3D scenes built on the generative engine. Drag the controls to scrub them like scroll does. */
const meta = { title: "Works/Scenes", parameters: { layout: "fullscreen" } } satisfies Meta
export default meta

export const Wordmark: StoryObj<typeof ParticleWordmark> = {
  args: { text: "Otakoyi", seed: 7, scatter: 0 },
  argTypes: { scatter: { control: { type: "range", min: 0, max: 1, step: 0.01 } } },
  render: (args) => (
    <div className="bg-background">
      <ParticleWordmark {...args} className="h-[70vh] w-full" />
    </div>
  ),
}

export const WordmarkScattered: StoryObj<typeof ParticleWordmark> = {
  ...Wordmark,
  args: { text: "Otakoyi", seed: 7, scatter: 0.8 },
}

export const Venue: StoryObj<typeof VenueScene> = {
  args: { progress: 0 },
  argTypes: { progress: { control: { type: "range", min: 0, max: 1, step: 0.01 } } },
  render: (args) => <VenueScene {...args} className="h-[70vh] w-full" />,
  play: async ({ canvas }) => {
    await canvas.findByRole("img", { name: /3D venue/ })
  },
}

export const VenueLobby: StoryObj<typeof VenueScene> = { ...Venue, args: { progress: 0.5 } }
export const VenueStand: StoryObj<typeof VenueScene> = { ...Venue, args: { progress: 1 } }
