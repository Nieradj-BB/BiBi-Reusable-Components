import { spawnSync } from "node:child_process"
import { existsSync, readFileSync } from "node:fs"

import { describe, expect, it } from "vitest"

type Item = { name: string; type: string; files?: { path: string }[] }

const registry = JSON.parse(readFileSync("registry.json", "utf8")) as {
  name: string
  items: Item[]
}

describe("registry.json", () => {
  it("is the bb registry with unique item names", () => {
    expect(registry.name).toBe("bb")
    const names = registry.items.map((item) => item.name)
    expect(new Set(names).size).toBe(names.length)
  })

  it("keeps the theme item in sync with registry/bb/theme/theme.css", () => {
    const result = spawnSync(
      process.execPath,
      ["scripts/sync-theme.mjs", "--check"],
      { encoding: "utf8" }
    )
    expect(result.stderr).toBe("")
    expect(result.status).toBe(0)
  })

  it("keeps item sources under registry/bb", () => {
    for (const item of registry.items) {
      for (const file of item.files ?? []) {
        expect(file.path).toMatch(/^registry\/bb\//)
      }
    }
  })
})

describe("registry dependencies", () => {
  type FullItem = Item & {
    dependencies?: string[]
    registryDependencies?: string[]
  }
  const items = registry.items as FullItem[]
  const ownPrefix = "Nieradj-BB/BiBi-Reusable-Components/"

  it("are pinned to package.json and the release tag", () => {
    const result = spawnSync(
      process.execPath,
      ["scripts/pin-registry.mjs", "--check"],
      { encoding: "utf8" }
    )
    expect(result.stderr).toBe("")
    expect(result.status).toBe(0)
  })

  it("match the imports of every item", () => {
    const aliasToItem = (specifier: string) => {
      if (specifier === "@/lib/utils") return "utils"
      const ui = specifier.match(/^@\/components\/ui\/(.+)$/)
      if (ui) return ui[1]
      const block = specifier.match(/^@\/components\/([^/]+)\/.+$/)
      return block?.[1]
    }

    for (const item of items) {
      if (item.name === "theme" || !item.files) continue
      // Declared but not built yet; the strict registry build catches these.
      if (item.files.some((file) => !existsSync(file.path))) continue
      const packages = new Set<string>()
      const own = new Set<string>()
      for (const file of item.files) {
        const source = readFileSync(file.path, "utf8")
        for (const [, specifier] of source.matchAll(/from "([^"]+)"/g)) {
          if (specifier.startsWith("@/")) {
            const name = aliasToItem(specifier)
            if (name && name !== item.name) own.add(name)
          } else if (specifier !== "react" && specifier !== "react-dom") {
            const parts = specifier.split("/")
            packages.add(
              specifier.startsWith("@") ? parts.slice(0, 2).join("/") : parts[0]
            )
          }
        }
      }
      if (item.name === "chart") packages.add("react-is")

      const declaredPackages = (item.dependencies ?? []).map((spec) =>
        spec.slice(0, spec.lastIndexOf("@"))
      )
      const declaredItems = (item.registryDependencies ?? []).map(
        (address) => address.slice(ownPrefix.length).split("#")[0]
      )
      if (item.name !== "utils") own.add("theme")

      expect(declaredPackages.sort(), item.name).toEqual([...packages].sort())
      expect(declaredItems.sort(), item.name).toEqual([...own].sort())
    }
  })
})
