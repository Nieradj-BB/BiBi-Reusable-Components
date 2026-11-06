import type { Preview } from "@storybook/react-vite"

import "../src/styles.css"

import { brandContrastSelector } from "./brand-contrast"

const preview: Preview = {
  parameters: {
    layout: "padded",
    controls: {
      matchers: { color: /(background|color)$/i, date: /Date$/i },
    },
    backgrounds: {
      options: {
        background: { name: "Background", value: "var(--background)" },
        card: { name: "Card", value: "var(--card)" },
      },
    },
    a11y: {
      // Every story fails its test on an axe violation.
      test: "error",
      config: {
        rules: [{ id: "color-contrast", selector: brandContrastSelector }],
      },
    },
    options: {
      storySort: {
        order: [
          "Foundations",
          [
            "Colours",
            "Typography",
            "Spacing",
            "Radius & Shadows",
            "Icons & Focus",
          ],
          "Components",
        ],
      },
    },
  },
  initialGlobals: {
    backgrounds: { value: "background" },
  },
  tags: ["autodocs"],
}

export default preview
