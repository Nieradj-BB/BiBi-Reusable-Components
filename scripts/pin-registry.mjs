// Pins every item in registry.json to this release, so one tagged install
// resolves a consistent set of files and packages:
//
// - `dependencies` get the exact version from package.json (`pkg@x.y.z`).
// - registryDependencies on this repo get the release tag
//   (`Nieradj-BB/BiBi-Reusable-Components/utils#v<package.json version>`).
//   The shadcn CLI does not pass the ref of the item an app adds on to that
//   item's registryDependencies; an untagged dependency would resolve to the
//   default branch and overwrite the tagged files.
//
//   node scripts/pin-registry.mjs          write registry.json
//   node scripts/pin-registry.mjs --check  exit 1 when registry.json is out of date
import { readFileSync, writeFileSync } from "node:fs"
import { fileURLToPath } from "node:url"

const root = fileURLToPath(new URL("..", import.meta.url))
const registryPath = `${root}registry.json`
const packagePath = `${root}package.json`

export const repoAddress = "Nieradj-BB/BiBi-Reusable-Components"

function packageName(spec) {
  const at = spec.lastIndexOf("@")
  return at > 0 ? spec.slice(0, at) : spec
}

export function pinnedRegistry(registry, pkg) {
  const tag = `v${pkg.version}`
  const names = new Set(registry.items.map((item) => item.name))
  const errors = []

  const items = registry.items.map((item) => {
    if (item.name === "theme") return item
    const next = { ...item }
    if (item.dependencies) {
      next.dependencies = item.dependencies.map((spec) => {
        const name = packageName(spec)
        const version = pkg.dependencies?.[name]
        if (!version) {
          errors.push(
            `${item.name}: ${name} is not in package.json dependencies`
          )
          return spec
        }
        return `${name}@${version}`
      })
    }
    if (item.registryDependencies) {
      next.registryDependencies = item.registryDependencies.map((address) => {
        if (!address.startsWith(`${repoAddress}/`)) {
          errors.push(
            `${item.name}: registryDependency "${address}" is not an address in ${repoAddress}`
          )
          return address
        }
        const dependency = address.slice(repoAddress.length + 1).split("#")[0]
        if (!names.has(dependency)) {
          errors.push(`${item.name}: unknown registry item "${dependency}"`)
        }
        return `${repoAddress}/${dependency}#${tag}`
      })
    }
    return next
  })

  return { registry: { ...registry, items }, errors }
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const current = JSON.parse(readFileSync(registryPath, "utf8"))
  const pkg = JSON.parse(readFileSync(packagePath, "utf8"))
  const { registry, errors } = pinnedRegistry(current, pkg)
  if (errors.length > 0) {
    process.stderr.write(`${errors.join("\n")}\n`)
    process.exit(1)
  }
  const changed = JSON.stringify(registry) !== JSON.stringify(current)
  if (process.argv.includes("--check")) {
    if (changed) {
      process.stderr.write(
        "registry.json is not pinned to package.json: run npm run build:registry\n"
      )
      process.exit(1)
    }
  } else if (changed) {
    const { format } = await import("prettier")
    const text = await format(JSON.stringify(registry), { parser: "json" })
    writeFileSync(registryPath, text)
  }
}
