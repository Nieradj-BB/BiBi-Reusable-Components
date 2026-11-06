// Copies registry/bb/theme/theme.css into the `theme` item of registry.json
// (cssVars, css, dependencies), so `npx shadcn add .../theme` gives an app the
// same tokens, @theme mapping and base layer that Storybook uses.
//
//   node scripts/sync-theme.mjs          write registry.json
//   node scripts/sync-theme.mjs --check  exit 1 when registry.json is out of date
import { readFileSync, writeFileSync } from "node:fs"
import { fileURLToPath } from "node:url"

const root = fileURLToPath(new URL("..", import.meta.url))
const themePath = `${root}registry/bb/theme/theme.css`
const registryPath = `${root}registry.json`
const packagePath = `${root}package.json`

/** Parses the small, regular CSS subset theme.css is written in. */
export function parseCss(source) {
  const css = source.replace(/\/\*[\s\S]*?\*\//g, "")
  let index = 0

  function parseBlock() {
    const entries = []
    let buffer = ""
    while (index < css.length) {
      const char = css[index]
      if (char === "{") {
        index += 1
        const prelude = buffer.trim().replace(/\s+/g, " ")
        buffer = ""
        entries.push({ type: "block", prelude, entries: parseBlock() })
      } else if (char === "}") {
        index += 1
        pushStatement(entries, buffer)
        return entries
      } else if (char === ";") {
        index += 1
        pushStatement(entries, buffer)
        buffer = ""
      } else {
        buffer += char
        index += 1
      }
    }
    pushStatement(entries, buffer)
    return entries
  }

  function pushStatement(entries, raw) {
    const text = raw.trim().replace(/\s+/g, " ")
    if (!text) return
    if (text.startsWith("@")) {
      entries.push({ type: "at", text })
      return
    }
    const colon = text.indexOf(":")
    entries.push({
      type: "decl",
      property: text.slice(0, colon).trim(),
      value: text.slice(colon + 1).trim(),
    })
  }

  return parseBlock()
}

function normaliseSelector(prelude) {
  return prelude
    .split(",")
    .map((part) => part.trim())
    .join(", ")
}

function toObject(entries) {
  const object = {}
  for (const entry of entries) {
    if (entry.type === "decl") object[entry.property] = entry.value
    if (entry.type === "at") object[entry.text] = {}
    if (entry.type === "block") {
      object[normaliseSelector(entry.prelude)] = toObject(entry.entries)
    }
  }
  return object
}

function vars(entries) {
  const result = {}
  for (const entry of entries) {
    if (entry.type !== "decl" || !entry.property.startsWith("--")) {
      throw new Error(
        `Only custom properties are allowed here: ${entry.property ?? entry.text}`
      )
    }
    result[entry.property.slice(2)] = entry.value
  }
  return result
}

export function themeItemFields(source, figtreeVersion) {
  const light = {}
  const theme = {}
  const css = {}
  const dependencies = []

  for (const entry of parseCss(source)) {
    if (entry.type === "at" && entry.text.startsWith("@import")) {
      const name = entry.text.match(/@import\s+["']([^"']+)["']/)?.[1]
      if (name === "@fontsource-variable/figtree") {
        dependencies.push(`${name}@${figtreeVersion}`)
      }
      css[entry.text] = {}
    } else if (entry.type === "block" && entry.prelude === ":root") {
      Object.assign(light, vars(entry.entries))
    } else if (entry.type === "block" && entry.prelude === "@theme inline") {
      Object.assign(theme, vars(entry.entries))
    } else if (entry.type === "block") {
      css[entry.prelude] = toObject(entry.entries)
    } else {
      throw new Error(
        `Unexpected top-level CSS in theme.css: ${JSON.stringify(entry)}`
      )
    }
  }

  return { dependencies, cssVars: { theme, light }, css }
}

export function syncedRegistry() {
  const registry = JSON.parse(readFileSync(registryPath, "utf8"))
  const pkg = JSON.parse(readFileSync(packagePath, "utf8"))
  const fields = themeItemFields(
    readFileSync(themePath, "utf8"),
    pkg.dependencies["@fontsource-variable/figtree"]
  )
  const items = registry.items.map((item) =>
    item.name === "theme"
      ? {
          name: item.name,
          type: item.type,
          title: item.title,
          description: item.description,
          categories: item.categories,
          ...fields,
        }
      : item
  )
  return { ...registry, items }
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const next = syncedRegistry()
  const current = JSON.parse(readFileSync(registryPath, "utf8"))
  const changed = JSON.stringify(next) !== JSON.stringify(current)
  if (process.argv.includes("--check")) {
    if (changed) {
      process.stderr.write(
        "registry.json is out of date with theme.css: run npm run build:registry\n"
      )
      process.exit(1)
    }
  } else if (changed) {
    const { format } = await import("prettier")
    const text = await format(JSON.stringify(next), { parser: "json" })
    writeFileSync(registryPath, text)
  }
}
