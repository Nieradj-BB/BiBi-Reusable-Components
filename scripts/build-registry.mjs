// Builds public/r with `shadcn build` after syncing the theme item and pinning
// every item to this release (scripts/pin-registry.mjs).
//
//   node scripts/build-registry.mjs           skips items whose files do not exist yet (with a warning)
//   node scripts/build-registry.mjs --strict  fails when any declared file is missing (CI)
import { spawnSync } from "node:child_process"
import { existsSync, readFileSync, rmSync, writeFileSync } from "node:fs"
import { fileURLToPath } from "node:url"

const root = fileURLToPath(new URL("..", import.meta.url))
const strict = process.argv.includes("--strict")

for (const script of ["scripts/sync-theme.mjs", "scripts/pin-registry.mjs"]) {
  const sync = spawnSync(process.execPath, [script], {
    cwd: root,
    stdio: "inherit",
  })
  if (sync.status !== 0) process.exit(sync.status ?? 1)
}

const registry = JSON.parse(readFileSync(`${root}registry.json`, "utf8"))
const missing = registry.items.flatMap((item) =>
  (item.files ?? [])
    .filter((file) => !existsSync(`${root}${file.path}`))
    .map((file) => ({ item: item.name, path: file.path }))
)

let registryFile = "registry.json"
if (missing.length > 0) {
  const list = missing.map(({ item, path }) => `  ${item}: ${path}`).join("\n")
  if (strict) {
    process.stderr.write(`Missing registry files:\n${list}\n`)
    process.exit(1)
  }
  process.stderr.write(`Skipping items with missing files:\n${list}\n`)
  const skip = new Set(missing.map(({ item }) => item))
  registryFile = "registry.partial.json"
  writeFileSync(
    `${root}${registryFile}`,
    JSON.stringify({
      ...registry,
      items: registry.items.filter((item) => !skip.has(item.name)),
    })
  )
}

const npx = process.platform === "win32" ? "npx.cmd" : "npx"
const build = spawnSync(npx, ["shadcn", "build", registryFile], {
  cwd: root,
  stdio: "inherit",
  shell: process.platform === "win32",
})
if (registryFile !== "registry.json") rmSync(`${root}${registryFile}`)
process.exit(build.status ?? 1)
