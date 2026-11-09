# Blue Bricks UI library

The theme, styling rules and React components for Blue Bricks web apps. Components are built on [shadcn/ui](https://ui.shadcn.com) and [Radix](https://www.radix-ui.com) (through the `radix-ui` package), styled with Tailwind CSS 4 and distributed as a **shadcn registry** straight from this GitHub repository. Apps copy the source of each component into their own codebase with `npx shadcn add`.

- **Theme**: fixed colour tokens, the Figtree variable font, radius, shadows and the entrance animation (`registry/bb/theme/theme.css`).
- **Components**: 32 components plus an optional react-hook-form binding, listed under [Components](#components).
- **Docs**: live examples in Storybook and one page per component in [`docs/components/`](docs/components/). The decisions behind the library are in [`docs/decisions.md`](docs/decisions.md).

Light mode only. English component names and docs; sample UI text is Dutch.

## Use it in an app

### 1. Prepare the app

The app needs React 19, Tailwind CSS 4 and a `components.json` with the standard shadcn aliases. In a new app, `npx shadcn@latest init` creates it. The library expects:

```json
{
  "tailwind": { "css": "src/index.css", "cssVariables": true },
  "aliases": {
    "components": "@/components",
    "ui": "@/components/ui",
    "utils": "@/lib/utils",
    "lib": "@/lib",
    "hooks": "@/hooks"
  },
  "iconLibrary": "lucide"
}
```

Make npm save exact versions, so the app gets the package versions the library was tested with (the registry asks for `radix-ui@1.8.1`; without this setting npm writes `^1.8.1`). Add this `.npmrc` to the app before the first install:

```ini
save-exact=true
```

### 2. Install the theme and the components

Items are addressed as `owner/repo/item#tag`. Install the theme, `utils` and every component you need at **the same tag**, in one command:

```bash
npx shadcn@latest add \
  Nieradj-BB/BiBi-Reusable-Components/theme#v0.2.0 \
  Nieradj-BB/BiBi-Reusable-Components/utils#v0.2.0 \
  Nieradj-BB/BiBi-Reusable-Components/button#v0.2.0 \
  Nieradj-BB/BiBi-Reusable-Components/dialog#v0.2.0
```

Add more components later the same way, always at the tag the app is on:

```bash
npx shadcn@latest add Nieradj-BB/BiBi-Reusable-Components/data-table#v0.2.0
```

The theme item writes the colour variables to `:root`, maps them to Tailwind colours in `@theme inline`, adds the font import, the shadows, `animate-enter` and the base layer to the app's CSS file, and installs `@fontsource-variable/figtree`. Components land in `components/ui/` (multi-file blocks such as `data-table` and `app-shell` in `components/<name>/`), with their imports rewritten to the app's aliases. Each component also brings the library items it needs (`theme`, `utils`, `button`, ...) at the same tag and its npm packages at exact versions. Adding the theme again leaves the CSS file unchanged.

Useful commands:

```bash
npx shadcn@latest list Nieradj-BB/BiBi-Reusable-Components#v0.2.0            # all items
npx shadcn@latest view Nieradj-BB/BiBi-Reusable-Components/button#v0.2.0     # inspect an item before installing
npx shadcn@latest add Nieradj-BB/BiBi-Reusable-Components/button#v0.2.0 --dry-run --diff
```

If the repository is private, sign in once with `gh auth login`; in CI set `GH_TOKEN` to a fine-grained token with read access to this repository.

The built registry JSON is also committed under `public/r/`, so an item can be installed by URL as well, for example `https://raw.githubusercontent.com/Nieradj-BB/BiBi-Reusable-Components/v0.2.0/public/r/button.json`.

### 3. Tell the app's agents

Paste the block from [`docs/consumer-claude-md.md`](docs/consumer-claude-md.md) into the app's `CLAUDE.md`.

### Versions

Releases are semver git tags (`v0.1.0`, `v0.2.0`, ...) with notes in [`CHANGELOG.md`](CHANGELOG.md). The library stays on 0.x while things settle; breaking changes only come with a new major version.

How pinning works:

- The shadcn CLI does not pass the `#tag` of the item you add on to that item's `registryDependencies`. An untagged dependency would resolve to the default branch, and its files would overwrite the tagged files of the same item. So in a release every `registryDependencies` entry carries the release tag itself (`Nieradj-BB/BiBi-Reusable-Components/utils#v0.2.0`), and every `dependencies` entry an exact version (`radix-ui@1.8.1`). `npm run build:registry` sets both from `package.json` (`scripts/pin-registry.mjs`); a unit test fails when they drift.
- Apps install only from tags. Adding `button#v0.2.0` brings `theme#v0.2.0` and `utils#v0.2.0`: the same files as adding them yourself.
- Never install from the default branch (no `#tag`, or `#main`): its items point at the last release tag, not at the branch.

To update, add every installed library item again at the newer tag in one command and review the changes (`--dry-run --diff` first, then `--overwrite`). Mixing tags in one app is not supported.

To release: set `version` in `package.json`, run `npm run build:registry`, move the `[Unreleased]` notes in `CHANGELOG.md` under the new version, commit, and tag that commit `v<version>`.

## Components

The current release is v0.2.0; the Since column gives the release that added each item. Each has a page in [`docs/components/`](docs/components/) and stories in Storybook.

| Item                                                | Component              | What it is for                                                                                        | Since |
| --------------------------------------------------- | ---------------------- | ----------------------------------------------------------------------------------------------------- | ----- |
| [`button`](docs/components/button.md)               | Button                 | Starts an action: cyan for the main action, navy, outline and ghost around it, red for removing data. | 0.1.0 |
| [`badge`](docs/components/badge.md)                 | Badge                  | A small pill that shows a status, category, role or count.                                            | 0.1.0 |
| [`card`](docs/components/card.md)                   | Card                   | A bordered surface with 12px corners that groups related content.                                     | 0.1.0 |
| [`stat-tile`](docs/components/stat-tile.md)         | StatTile               | One key number with its label, caption, trend or link, for dashboard rows.                            | 0.2.0 |
| [`accordion`](docs/components/accordion.md)         | Accordion              | Sections that open and close under a heading button, one or several at a time.                        | 0.2.0 |
| [`input`](docs/components/input.md)                 | Input                  | A single-line text field, optionally with prefix or suffix text.                                      | 0.1.0 |
| [`textarea`](docs/components/textarea.md)           | Textarea               | A multi-line text field, optionally with a character counter.                                         | 0.1.0 |
| [`label`](docs/components/label.md)                 | Label                  | The visible name of a control or group, with a required mark or optional hint.                        | 0.1.0 |
| [`checkbox`](docs/components/checkbox.md)           | Checkbox               | Turns an option on or off; supports a mixed state.                                                    | 0.1.0 |
| [`radio-group`](docs/components/radio-group.md)     | RadioGroup             | Picks one option from a short list that stays visible.                                                | 0.2.0 |
| [`switch`](docs/components/switch.md)               | Switch                 | Turns a setting on or off with immediate effect.                                                      | 0.2.0 |
| [`select`](docs/components/select.md)               | Select                 | Picks one value from a known list.                                                                    | 0.1.0 |
| [`calendar`](docs/components/calendar.md)           | Calendar               | A month grid for picking a date or a date range.                                                      | 0.2.0 |
| [`date-picker`](docs/components/date-picker.md)     | DatePicker             | A field-like button that opens a Calendar, for a date or a range, with presets.                       | 0.2.0 |
| [`form-field`](docs/components/form-field.md)       | FormField              | Label, help text and error message wired to a control or group, without a form library.               | 0.1.0 |
| [`form-rhf`](docs/components/form-rhf.md)           | Form (react-hook-form) | Optional react-hook-form binding for FormField.                                                       | 0.1.0 |
| [`alert`](docs/components/alert.md)                 | Alert                  | An inline message for information, success, a warning or an error.                                    | 0.2.0 |
| [`spinner`](docs/components/spinner.md)             | Spinner                | A small rotating icon with a hidden status label for a short wait.                                    | 0.2.0 |
| [`skeleton`](docs/components/skeleton.md)           | Skeleton               | Pulsing placeholders in the shape of loading content.                                                 | 0.1.0 |
| [`empty-state`](docs/components/empty-state.md)     | EmptyState             | Says nothing is here yet and what to do next.                                                         | 0.1.0 |
| [`sonner`](docs/components/sonner.md)               | Toast                  | A short, temporary message that confirms a result or reports a failure.                               | 0.1.0 |
| [`dialog`](docs/components/dialog.md)               | Dialog                 | A modal window for a short task or form.                                                              | 0.1.0 |
| [`alert-dialog`](docs/components/alert-dialog.md)   | AlertDialog            | A modal confirmation that waits for an explicit choice.                                               | 0.1.0 |
| [`sheet`](docs/components/sheet.md)                 | Sheet                  | A side panel with details or a form next to the page.                                                 | 0.1.0 |
| [`popover`](docs/components/popover.md)             | Popover                | A small anchored panel for a short explanation or a one-field form.                                   | 0.1.0 |
| [`tooltip`](docs/components/tooltip.md)             | Tooltip                | A short label for an icon button, on hover and keyboard focus.                                        | 0.1.0 |
| [`dropdown-menu`](docs/components/dropdown-menu.md) | DropdownMenu           | A menu of actions or options that opens from a button.                                                | 0.2.0 |
| [`tabs`](docs/components/tabs.md)                   | Tabs                   | Switches between views of one subject, or between sub-pages as links.                                 | 0.1.0 |
| [`pagination`](docs/components/pagination.md)       | Pagination             | Previous and next, page numbers, page size and the visible range of a long list.                      | 0.2.0 |
| [`data-table`](docs/components/data-table.md)       | DataTable              | A table for records with sorting, selection, row actions, search, filters and pagination.             | 0.1.0 |
| [`chart`](docs/components/chart.md)                 | Chart                  | A chart card with a title, a takeaway and bars in the three chart colours.                            | 0.1.0 |
| [`page-header`](docs/components/page-header.md)     | PageHeader             | The top of every page: title, subtitle and the cyan accent stripe.                                    | 0.1.0 |
| [`app-shell`](docs/components/app-shell.md)         | AppShell               | The app frame: sidebar navigation, signed-in user and a mobile menu.                                  | 0.1.0 |

The foundation items are `theme` (tokens, font, radius, shadows, entrance animation, base styles) and `utils` (`cn()`).

## Work on the library

Requirements: Node 22 and npm.

```bash
npm install
npx playwright install chromium   # once, for the Storybook tests

npm run dev               # Storybook on http://localhost:6006
npm test                  # unit tests + every story as a test in headless Chromium (axe on)
npm run typecheck
npm run lint              # ESLint: TypeScript, React hooks, jsx-a11y, Tailwind class rules
npm run format            # Prettier with the Tailwind class sorter
npm run build:registry    # sync the theme item, then shadcn build into public/r
npm run build:storybook   # static Storybook in storybook-static/
```

Run a single story file or unit test:

```bash
npx vitest run --project storybook registry/bb/ui/button.stories.tsx
npx vitest run --project unit registry/bb/lib/utils.test.ts
```

Every story runs as a test: it must render, its `play` function must pass and axe must find no violations. The one accepted exception is contrast caused by the fixed brand cyan (decision 5): an element that is coloured brand cyan right now (`text-brand-cyan` or `bg-brand-cyan` in its resting classes, or a state variant such as `data-[state=active]:text-brand-cyan` while it is in that state) is skipped by the colour-contrast rule, together with its content. `hover:` and `focus:` variants never exempt an element; everything else is checked (`.storybook/brand-contrast.ts`).

### Layout

```
registry.json                 registry index: every item, its files and dependencies
registry/bb/theme/theme.css   the theme (source of truth for the theme item)
registry/bb/lib/utils.ts      cn()
registry/bb/ui/               single-file components and their stories
registry/bb/blocks/<name>/    multi-file components (data-table, app-shell) and their stories
stories/foundations/          Storybook pages for colours, type, spacing, radius, shadows, icons and focus
docs/components/<name>.md     one page per component
public/r/                     generated by npm run build:registry (committed)
```

How to add or change a component is described in [`CLAUDE.md`](CLAUDE.md).
