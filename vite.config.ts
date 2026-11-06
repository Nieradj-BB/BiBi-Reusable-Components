import { fileURLToPath } from "node:url"

import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

const fromRoot = (path: string) => fileURLToPath(new URL(path, import.meta.url))

// Mirrors the tsconfig paths: registry items import the paths the shadcn CLI
// rewrites for apps (@/lib/utils, @/components/ui/*, @/components/*).
export const alias = [
  {
    find: /^@\/lib\/utils$/,
    replacement: fromRoot("./registry/bb/lib/utils.ts"),
  },
  { find: /^@\/lib\//, replacement: fromRoot("./registry/bb/lib/") },
  { find: /^@\/hooks\//, replacement: fromRoot("./registry/bb/hooks/") },
  { find: /^@\/components\/ui\//, replacement: fromRoot("./registry/bb/ui/") },
  { find: /^@\/components\//, replacement: fromRoot("./registry/bb/blocks/") },
  { find: /^@\/registry\//, replacement: fromRoot("./registry/") },
]

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: { alias },
})
