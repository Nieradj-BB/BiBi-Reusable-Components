# Decisions

Decisions for the Blue Bricks design guide and component library, made on 4 November 2026. The library starts as a blank slate: these decisions define it on its own terms.

## Summary

| # | Topic | Decision |
|---|---|---|
| 1 | Home and ownership | Lives in `Nieradj-BB/BiBi-Reusable-Components`. Our own team builds and decides; no outside approval needed. |
| 2 | Who uses it | New apps first. Existing apps may switch later; the guide does not mention them. |
| 3 | Colours | Fixed at the values below until the Blue Bricks brand style sheet arrives. No colour is changed or added unless explicitly agreed. |
| 4 | Font | Figtree, self-hosted as a variable font. |
| 5 | Accessibility | WCAG 2.2 AA for keyboard use, focus, labels and target sizes. Contrast failures caused by the brand colours are accepted. |
| 6 | Primitive base | Radix, via the `radix-ui` package. |
| 7 | Language | English component, prop and variant names and English docs. UI text in apps is Dutch. |
| 8 | Content | Copy and wording rules are out of scope. The guide covers styling only. |
| 9 | Forms | A `FormField` that works without a form library, plus an optional react-hook-form version. |
| 10 | Token names | Standard shadcn names plus a `brand-*` namespace for brand colours. |
| 11 | Other names | `rounded-md` = 6px controls, `rounded-xl` = 12px cards, `font-heading` for headings, `cn` at `@/lib/utils`. |
| 12 | Distribution | A shadcn registry served from this repo. Apps install with `npx shadcn add` and pin a git tag. |
| 13 | Token source | Hand-written CSS with Tailwind 4 `@theme`. No token build tool. |
| 14 | Governance | No formal model: no statuses, changes go through normal code review. |
| 15 | Documentation | Storybook 10 for live examples, plus one Markdown page per component. |
| 16 | CI checks | Component tests through Storybook (Vitest), an accessibility check (axe) on every story with the brand-colour contrast skipped, and lint that bans hex values and default Tailwind colours. Screenshot tests later. |
| 17 | Agents | Each app's CLAUDE.md gets a short block: the repo link, install through the registry, use tokens only, and never write an own version of a library component. |
| 18 | Scope | Styling and UI components only, plus the small helpers they need. No API clients, auth, query setup or test utilities. |
| 19 | First version | Theme and styling rules; Button, Badge, Card, Input, Skeleton, AlertDialog, Popover, Chart; Dialog, Sheet, Select, Checkbox, Label, Textarea, FormField, Toast, Tabs, Tooltip, DataTable, EmptyState, PageHeader, AppShell. |
| 20 | Other visual values | Type sizes and weights, spacing, radii, shadows and motion use the existing BB values, with one value per role where there were several. |
| 21 | Icons | lucide-react. |
| 22 | Versioning | Semver git tags and a `CHANGELOG.md`. Stay on 0.x while things settle; breaking changes only in a major version. |
| 23 | Theme modes | Light mode only. Charts use the three chart colours below. |

## Fixed values

### Colours

These values are fixed (decision 3). Names follow decision 10 when the theme is built; the roles below describe what each colour is for today.

| Role | Value |
|---|---|
| Page background | `#f3fafd` |
| Surface (cards, panels, dialogs) | `#ffffff` |
| Sunken surface and muted fill | `#f5f5f6` |
| Text | `#0a0a0c` |
| Muted text | `#72727b` |
| Brand navy (primary) | `#222a54` |
| Text on navy | `#ffffff` |
| Navy tint | `#e9edf6` |
| Brand cyan | `#0298d5` |
| Light cyan | `#35b8e7` |
| Text on cyan | `#ffffff` |
| Cyan tint | `#e6f5fc` |
| Orange (data highlight) | `#ea580c` |
| Chart series 1, 2, 3 | `#0298d5`, `#4a5aa8`, `#ea580c` |
| Border | `#e8e8eb` |
| Strong border | `#c9c9d1` |
| Destructive | `#dc3545` |
| Text on destructive | `#ffffff` |
| Success | `#67b871` |

### Font, shape, elevation and motion

| Token | Value |
|---|---|
| Font | Figtree Variable, self-hosted, fallback `ui-sans-serif, system-ui, sans-serif` |
| Headings h1 to h3 | Weight 800, navy, letter-spacing `-0.01em` |
| Radius, controls | 6px (`rounded-md`) |
| Radius, cards | 12px (`rounded-xl`) |
| Shadow, tile | `0 1px 2px rgb(34 42 84 / 0.05)` |
| Shadow, tile on hover | `0 4px 14px rgb(34 42 84 / 0.1)` |
| Shadow, side panel | `-1px 0 20px rgb(34 42 84 / 0.07)` |
| Shadow, card | `0 1px 3px rgb(34 42 84 / 0.08)` |
| Entrance animation | 320ms, `cubic-bezier(0.2, 0.7, 0.3, 1)`, off under `prefers-reduced-motion` |

## Open until the brand style sheet arrives

- Check every colour and the font against the style sheet. Change nothing without explicit agreement.
- Decide whether the accepted contrast failures (decision 5) stay accepted.
- Decide whether dark mode or more chart colours are needed (decision 23).
