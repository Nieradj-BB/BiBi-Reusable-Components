# CLAUDE.md

Blue Bricks UI library: a Tailwind 4 theme and React 19 components (shadcn/ui new-york-v4 API on Radix via `radix-ui`), distributed as a shadcn registry from this GitHub repo. Decisions in `docs/decisions.md` are binding.

## Hard rules

1. Blank slate: never mention or reference any existing app, product or internal project in code, comments, stories, docs or commit text. The repo name is fine.
2. Colours are fixed. Use theme tokens only (`bg-primary`, `text-muted-foreground`, `bg-brand-cyan`, `border-border`, `var(--chart-1)`). No hex/rgb/hsl, no Tailwind palette or `white`/`black` classes, no arbitrary colours. Opacity modifiers only where the visual spec uses them (`hover:bg-brand-cyan/90`, `hover:bg-primary/90`, `hover:bg-destructive/90`, scrim `bg-primary/40`). Never add or change a colour value.
3. Radius: `rounded-md` controls, `rounded-xl` cards/panels/dialogs/popovers, `rounded-full` pills/avatars/switches, `rounded-sm` only for chart bar ends. Shadows: `shadow-tile`, `shadow-tile-hover`, `shadow-card`, `shadow-panel` only.
4. Font: `font-sans` (Figtree); headings h1 to h3 get weight 800, `text-primary` and tracking from the base layer, so set only the size. `font-heading` for KPI numbers and empty-state titles. Icons: `lucide-react` only, sized with `size-*`, decorative icons `aria-hidden`.
5. Focus: every interactive element has `focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring` unless the visual spec shows another treatment. Do not add `outline-none` or `outline-hidden` to those elements: in Tailwind 4 they set `--tw-outline-style: none` and the focus outline disappears (lint blocks the bare classes). Containers that must never show focus may use `focus:outline-none`.
6. Accessibility: WCAG 2.2 AA for keyboard, focus, names, labels, roles and 24px+ targets. Contrast failures caused by brand cyan are accepted; every other contrast must pass.
7. Light mode only: no `dark:` variants.
8. English names for components, props, variants, stories and docs. Sample UI text in stories is neutral Dutch (projects, clients, invoices, documents, fictional names).
9. Code: TypeScript strict, no `any`, no `@ts-ignore`, no `var`, no `console.log`. Function components with `ref` as a prop (React 19, no `forwardRef`), named exports, `data-slot` attributes like shadcn v4, `cva` for variants, `cn()` for every conditional or merged class list (no template literals). Sparse comments.
10. Exact dependency versions. Do not run `npm install`, `npx shadcn add` or change `package.json` while building a component: report missing packages instead.

## Layout and imports

| Path                                   | What                                                        | Import it as                 |
| -------------------------------------- | ----------------------------------------------------------- | ---------------------------- |
| `registry/bb/theme/theme.css`          | Theme: tokens, `@theme inline`, base layer, `animate-enter` | (CSS)                        |
| `registry/bb/lib/utils.ts`             | `cn()`                                                      | `@/lib/utils`                |
| `registry/bb/ui/<name>.tsx`            | Single-file components                                      | `@/components/ui/<name>`     |
| `registry/bb/blocks/<name>/<file>.tsx` | Multi-file components (`data-table`, `app-shell`)           | `@/components/<name>/<file>` |
| `registry/bb/hooks/<name>.ts`          | Shared hooks, if ever needed                                | `@/hooks/<name>`             |
| `stories/foundations/`                 | Foundations pages                                           |                              |
| `docs/components/<name>.md`            | One docs page per component                                 |                              |

Items import each other only through these aliases (never relative paths between items, never `@/registry/...`). tsconfig `paths` and the Vite aliases map them to the sources here; the shadcn CLI rewrites them to the app's aliases on install. Within one block, files import each other through `@/components/<block>/<file>` too.

Radix: `import { Dialog as DialogPrimitive } from "radix-ui"` (unified package), `Slot.Root` from `radix-ui` for `asChild`. Toast: `Toaster` in `@/components/ui/sonner`, apps call `toast()` from `sonner`. Tables: `@tanstack/react-table` v9. Charts: `recharts` v3 with colours as `var(--chart-n)`.

Installed packages (exact versions in `package.json`): react, react-dom, radix-ui, lucide-react, class-variance-authority, clsx, tailwind-merge, @fontsource-variable/figtree, sonner, recharts, react-is, @tanstack/react-table, react-hook-form, @hookform/resolvers, zod.

## Adding or changing a component

1. **Source**: `registry/bb/ui/<name>.tsx` (or a block folder). Start from the shadcn new-york-v4 source for API and behaviour, then restyle to the visual spec with theme tokens.
2. **Stories**: `<name>.stories.tsx` next to the source. Title `Components/<Category>/<Name>`; categories are `Actions`, `Inputs & forms`, `Data display`, `Feedback`, `Overlays`, `Navigation & layout`. One story per gallery example; the story name is the text after the middle dot of the example's specId. Export it in PascalCase (`Button · outline` → `export const Outline`); when the text has more than one word, also set `name` to the text with only its first letter capitalised (`Button · size icon` → `export const SizeIcon: Story = { name: "Size icon" }`, `Card · header, body and footer` → `export const HeaderBodyAndFooter: Story = { name: "Header, body and footer" }`). Interactive behaviour gets a `play` function with assertions (use `canvas`, `userEvent` and `expect` from the play context and `storybook/test`; overlays render in a portal, so query them with `within(document.body)`). Stories run as tests with axe set to `error`: a violation fails the build.
3. **Docs page**: `docs/components/<name>.md`, where `<name>` is the registry item name (`sonner.md` for Toast, `form-rhf.md` for the react-hook-form binding), with these sections: purpose; when to use / when not to; install (`npx shadcn@latest add Nieradj-BB/BiBi-Reusable-Components/<name>#<tag>`); usage example; props table; variants and states; accessibility notes.
4. **Registry entry**: the item is already declared in `registry.json` (name, type, title, description, files). Add any extra files, `dependencies` as `package@version` and `registryDependencies` as full GitHub addresses (`Nieradj-BB/BiBi-Reusable-Components/utils`, `Nieradj-BB/BiBi-Reusable-Components/button`), always including `theme` and `utils`. A bare name like `button` means the stock shadcn item, never ours. `npm run build:registry` then pins them (`scripts/pin-registry.mjs`): exact versions from `package.json` and `#v<package.json version>` on every own address, because the shadcn CLI does not pass an app's `#tag` on to registry dependencies. Unit tests fail when the pinning drifts or an item's dependencies do not match its imports. Block files need `"type": "registry:component"` and `"target": "@components/<block>/<file>.tsx"`.
5. **Check**: `npm run typecheck`, `npm run lint` (`npm run lint:fix` fixes canonical class names), `npm run format`, `npx vitest run --project storybook <path-to-stories>`, `npm run build:registry`.
6. **Changelog**: add a line under `## [Unreleased]` in `CHANGELOG.md`.

## Tailwind notes

- Class order is Prettier's job (`prettier-plugin-tailwindcss`); run `npm run format`.
- ESLint (`better-tailwindcss`) fails on unknown classes (the default palette is removed in `src/library-guard.css`), conflicting classes, non-canonical classes (`tracking-[0.1em]` → `tracking-widest`, `text-lg leading-snug` → `text-lg/snug`) and the restricted colour, radius, shadow and outline classes above.
- Arbitrary values are fine for non-colour properties (`grid-cols-[4rem_1fr]`, `w-(--radix-select-trigger-width)`); CSS variables via `bg-(--color-x)` are fine.
- Spacing on the 4px scale; stack with `gap-*` on flex/grid parents, not `space-y-*`.
- Transitions: `transition-colors` (150ms) for colour, `transition-shadow duration-200` for elevation; guard movement with `motion-safe:` (`motion-safe:animate-pulse`, `motion-safe:animate-spin`). Entrance: `animate-enter` (already off under reduced motion), stagger with `style={{ "--enter-index": i }}`.
- Accepted brand contrast: axe skips colour contrast only for an element that is brand cyan right now, and its content: `text-brand-cyan` or `bg-brand-cyan` (optionally `/90`) in its resting classes, or a listed state variant (`data-[state=active]:`, `aria-[current=page]:`, ...) while the element is in that state (`.storybook/brand-contrast.ts`; add a variant there when a component needs a new one). `hover:` and `focus:` variants never exempt. Do not disable axe rules in stories; fix the markup instead.

## Commands

```bash
npm run dev               # Storybook on :6006
npm test                  # unit + all stories (headless Chromium, axe on)
npx vitest run --project storybook registry/bb/ui/button.stories.tsx   # one story file
npx vitest run --project unit registry/bb/lib/utils.test.ts            # one unit test
npm run typecheck
npm run lint              # --max-warnings 0
npm run format            # / format:check
npm run build:registry    # syncs the theme item from theme.css, pins dependencies, then shadcn build → public/r
                          # skips items whose files do not exist yet; CI uses --strict
npm run build:storybook
```

`registry.json`'s `theme` item is generated from `theme.css` by `scripts/sync-theme.mjs`: edit `theme.css`, never the theme item by hand. `scripts/theme.test.ts` pins every colour, the radius scale, the shadows and the entrance animation to the fixed values in `docs/decisions.md`; a failing test there means a fixed value was changed, so revert it rather than updating the test.
