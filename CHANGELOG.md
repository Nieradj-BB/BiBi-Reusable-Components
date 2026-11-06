# Changelog

All notable changes to this library are documented here. The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and releases are [semver](https://semver.org) git tags. The library stays on 0.x while things settle.

## [Unreleased] - 0.1.0

### Added

- Theme registry item: fixed colour tokens with shadcn names plus `brand-*`, chart colours, the Figtree variable font, Tailwind's 6px/12px radius pinned, four navy-tinted shadows, the `animate-enter` entrance animation (off under reduced motion) and base styles for body and headings.
- `utils` registry item: `cn()` with a tailwind-merge that knows the theme shadows and the heading font.
- Storybook 10 with Foundations pages (colours, typography, spacing, radius and shadows, icons and focus); every story runs as a Vitest browser test with axe.
- Tooling: TypeScript, ESLint (TypeScript, React hooks, jsx-a11y, Tailwind class rules that block palette colours, colour literals, `dark:` variants and off-scale radii and shadows), Prettier, a unit test that pins the fixed theme values, CI and the shadcn registry build.
- Registry pinning: `npm run build:registry` sets every item's npm `dependencies` to the exact versions in `package.json` and every `registryDependencies` entry to the release tag (`scripts/pin-registry.mjs`), so one tagged install resolves one consistent set of files; unit tests check the pinning and that each item's dependencies match its imports.
- `button`: Button with `default` (cyan), `navy`, `outline`, `ghost` and `destructive` variants, sizes `sm`, `default`, `lg`, `icon`, `icon-sm`, `icon-lg`, `asChild` and a `loading` state that stays enabled and focused, ignores clicks, sets `aria-busy` and shows a spinner in place of the leading icon.
- `input`: Input with an optional leading lucide icon and the invalid state.
- `textarea`: Textarea with an optional character counter, help text and an over-limit state announced politely.
- `label`: Label with a required mark, an optional hint and a `legend` mode for groups.
- `checkbox`: Radix Checkbox with checked, unchecked and mixed states and an optional label and description row.
- `select`: Radix Select that opens below the field, with groups, separators and a cyan check on the selected item.
- `badge`: Badge with `default`, `secondary`, `outline`, `success`, `destructive` and `brand` variants and a count.
- `card`: Card (`flat`, `elevated`, `interactive`) with header, title, description, action, content, footer, media and a whole-card link with a selected state.
- `skeleton`: Skeleton with text, title, value, row and circle shapes, fixed widths, a reduced-motion-safe pulse and `SkeletonGroup` with one status message per loading area.
- `empty-state`: EmptyState with icon, title, text and action, in default, compact and inline sizes.
- `dialog`: Dialog with header, body, footer, steps layout, sizes and inline error and hint parts.
- `alert-dialog`: AlertDialog for confirmations, with a destructive action.
- `sheet`: Sheet side panel, modal or non-modal, with header, sections, footer and initial focus on the panel or first field.
- `popover`: Popover for toggletips and quick one-field forms.
- `tooltip`: Tooltip for icon buttons, with an optional keyboard shortcut.
- `sonner`: themed Toaster for sonner (Toast): success, error and info toasts with action, cancel and close buttons.
- `tabs`: Radix Tabs in `underline` and `pill` variants, plus `TabsNav` and `TabsLink` for route tabs.
- `form-field`: FormField with label, required or optional mark, help text and error message wired through `aria-describedby` and `aria-invalid`, plus `FormStack` and `FormActions`; works without a form library.
- `form-rhf`: optional react-hook-form binding for FormField, following the shadcn `Form` API.
- `data-table`: DataTable block on `@tanstack/react-table` v9 with sortable headers, row selection and bulk actions, search, row actions, loading and empty states, plus the `table.tsx` primitives.
- `chart`: Chart card and parts on recharts v3 (`ChartContainer`, `ChartTooltip`, `ChartLegend`, bars, proportion and ranking bars, empty state) in the three chart colours, with muted axis labels and no animation.
- `page-header`: PageHeader with title, subtitle and the cyan accent stripe, plus optional actions, breadcrumbs, eyebrow and a tabs slot.
- `app-shell`: AppShell block with sidebar navigation (links or dialog buttons, counts), the signed-in user, a skip link and a mobile top bar with a menu sheet.

### Changed

- Theme: the reduced-motion rule for `animate-enter` is a top-level `@media` block instead of being nested in the utility, so adding the theme again (directly or through a component) no longer appends a duplicate rule to the app's CSS file.
- Storybook accessibility check: the brand-cyan contrast exemption applies only to elements that are coloured brand cyan at that moment (resting `text-brand-cyan`/`bg-brand-cyan`, or a `data-[state=…]`/`aria-…` variant while the element is in that state), not to `hover:` or `focus:` variants.
