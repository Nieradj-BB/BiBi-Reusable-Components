import { describe, expect, it } from "vitest"

import { cn } from "@/lib/utils"

describe("cn", () => {
  it("keeps the last radius", () => {
    expect(cn("rounded-md", "rounded-xl")).toBe("rounded-xl")
  })

  it("keeps the last theme shadow", () => {
    expect(cn("shadow-card", "shadow-tile")).toBe("shadow-tile")
    expect(cn("shadow-tile", "hover:shadow-tile-hover", "shadow-panel")).toBe(
      "hover:shadow-tile-hover shadow-panel"
    )
  })

  it("treats theme shadows and default shadows as one group", () => {
    expect(cn("shadow-sm", "shadow-card")).toBe("shadow-card")
  })

  it("merges the heading font with other font families, not with weights", () => {
    expect(cn("font-sans", "font-heading")).toBe("font-heading")
    expect(cn("font-heading", "font-bold")).toBe("font-heading font-bold")
  })

  it("keeps text colour and text size apart", () => {
    expect(cn("text-sm text-muted-foreground", "text-brand-cyan")).toBe(
      "text-sm text-brand-cyan"
    )
  })

  it("drops falsy values", () => {
    expect(cn("p-5", false, undefined, null, "gap-3")).toBe("p-5 gap-3")
  })
})
