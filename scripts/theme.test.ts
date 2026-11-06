import { readFileSync } from "node:fs"

import { describe, expect, it } from "vitest"

// The fixed values from docs/decisions.md (decisions 3, 11, 20). Changing a
// value here needs an explicit decision first.
const colours = {
  background: "#f3fafd",
  foreground: "#0a0a0c",
  card: "#ffffff",
  "card-foreground": "#0a0a0c",
  popover: "#ffffff",
  "popover-foreground": "#0a0a0c",
  primary: "#222a54",
  "primary-foreground": "#ffffff",
  secondary: "#e9edf6",
  "secondary-foreground": "#222a54",
  muted: "#f5f5f6",
  "muted-foreground": "#72727b",
  accent: "#f5f5f6",
  "accent-foreground": "#0a0a0c",
  destructive: "#dc3545",
  "destructive-foreground": "#ffffff",
  success: "#67b871",
  border: "#e8e8eb",
  "border-strong": "#c9c9d1",
  input: "#e8e8eb",
  ring: "#0298d5",
  "brand-navy": "#222a54",
  "brand-cyan": "#0298d5",
  "brand-cyan-foreground": "#ffffff",
  "brand-sky": "#35b8e7",
  "brand-ice": "#e6f5fc",
  "chart-1": "#0298d5",
  "chart-2": "#4a5aa8",
  "chart-3": "#ea580c",
}

const themeValues = {
  "radius-sm": "0.25rem",
  "radius-md": "0.375rem",
  "radius-lg": "0.5rem",
  "radius-xl": "0.75rem",
  "shadow-tile": "0 1px 2px rgb(34 42 84 / 0.05)",
  "shadow-tile-hover": "0 4px 14px rgb(34 42 84 / 0.1)",
  "shadow-card": "0 1px 3px rgb(34 42 84 / 0.08)",
  "shadow-panel": "-1px 0 20px rgb(34 42 84 / 0.07)",
  "ease-enter": "cubic-bezier(0.2, 0.7, 0.3, 1)",
}

const css = readFileSync("registry/bb/theme/theme.css", "utf8").replace(
  /\/\*[\s\S]*?\*\//g,
  ""
)

function declarations(selector: string) {
  const start = css.indexOf(`${selector} {`)
  expect(start, `${selector} block`).toBeGreaterThanOrEqual(0)
  const body = css.slice(start, css.indexOf("}", start))
  return Object.fromEntries(
    [...body.matchAll(/--([\w-]+):\s*([^;]+);/g)].map(([, name, value]) => [
      name,
      value.replace(/\s+/g, " ").trim(),
    ])
  )
}

describe("theme.css", () => {
  it("keeps every colour at its fixed value and adds none", () => {
    expect(declarations(":root")).toEqual(colours)
  })

  it("maps every colour into Tailwind and nothing else", () => {
    const theme = declarations("@theme inline")
    const mapped = Object.keys(theme).filter((name) =>
      name.startsWith("color-")
    )
    expect(mapped.sort()).toEqual(
      Object.keys(colours)
        .map((name) => `color-${name}`)
        .sort()
    )
    for (const name of Object.keys(colours)) {
      expect(theme[`color-${name}`]).toBe(`var(--${name})`)
    }
  })

  it("keeps the radius scale, shadows and easing", () => {
    const theme = declarations("@theme inline")
    for (const [name, value] of Object.entries(themeValues)) {
      expect(theme[name], name).toBe(value)
    }
  })

  it("keeps the entrance animation off under reduced motion", () => {
    expect(css).toMatch(
      /@utility animate-enter \{[\s\S]*320ms cubic-bezier\(0\.2, 0\.7, 0\.3, 1\)[\s\S]*prefers-reduced-motion: reduce[\s\S]*animation: none/
    )
  })
})
