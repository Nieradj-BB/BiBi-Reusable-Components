# Block for an app's CLAUDE.md

Paste the block below into the `CLAUDE.md` of every app that uses the Blue Bricks UI library (decision 17). Replace `v0.2.0` with the tag the app is on. Items in v0.2.0: theme, utils, button, badge, card, stat-tile, accordion, input, textarea, label, checkbox, radio-group, switch, select, calendar, date-picker, form-field, form-rhf, alert, spinner, skeleton, empty-state, sonner (Toast), dialog, alert-dialog, sheet, popover, tooltip, dropdown-menu, tabs, pagination, data-table, chart, page-header and app-shell.

```md
## UI library

- All UI comes from the Blue Bricks UI library: https://github.com/Nieradj-BB/BiBi-Reusable-Components (Storybook, `docs/components/`, `docs/decisions.md`).
- Install library items through the registry, always at the app's tag, with `save-exact=true` in the app's `.npmrc`: `npx shadcn@latest add Nieradj-BB/BiBi-Reusable-Components/<item>#v0.2.0`. Never install without a tag or from `#main`. Items land in `components/ui/` (blocks in `components/<name>/`); `theme` and `utils` come along with every component. To update, add every installed library item again at the newer tag in one command and review the diff (`--dry-run --diff`); do not restyle installed library files by hand.
- Never write your own version of a library component (button, input, select, checkbox, radio group, switch, date picker, badge, card, stat tile, accordion, alert, spinner, dialog, sheet, popover, tooltip, dropdown menu, toast, tabs, pagination, table, chart, page header, app shell, ...). If something is missing, ask for it in the library repo.
- Use theme tokens only: `bg-background`, `bg-card`, `text-foreground`, `text-muted-foreground`, `bg-primary`, `bg-brand-cyan`, `border-border`, `var(--chart-1)`, ... `text-warning` and `border-warning` only for warning icons and borders. No hex, rgb or hsl values, no Tailwind palette colours (`bg-blue-500`, `text-gray-600`, `bg-white`), no arbitrary colours (`bg-[#...]`), no `dark:` variants (light mode only).
- Shape and type: `rounded-md` for controls, `rounded-xl` for cards, panels and dialogs, `rounded-full` for pills and circles; shadows `shadow-tile`, `shadow-tile-hover`, `shadow-card`, `shadow-panel` only; Figtree through `font-sans`, headings h1 to h3 take their weight and colour from the base style (set only the size). Icons from `lucide-react`, decorative icons `aria-hidden`.
- Accessibility: WCAG 2.2 AA for keyboard use, focus, labels and target sizes. Every interactive element keeps the library focus ring (`focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring`).
```
