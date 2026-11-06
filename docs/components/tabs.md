# Tabs

Switches between views of one subject inside a page (Radix Tabs), or between sub-pages as a row of links.

## When to use

- Splitting one record or page into a few views (`Tabs` with the underline list).
- Sub-navigation under a page header where each tab has its own URL (`TabsNav` with `TabsLink`, pill style).

## When not to use

- Sequential steps: use a steps dialog.
- Main navigation or more than about 8 items: use the app shell.
- Filtering a list: use Select or a search Input (filter chips and a segmented control are not in the library yet: ask for them in the library repo).

## Install

```bash
npx shadcn@latest add Nieradj-BB/BiBi-Reusable-Components/tabs#v0.1.0
```

## Usage

```tsx
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function InvoiceTabs() {
  return (
    <Tabs defaultValue="openstaand">
      <TabsList aria-label="Facturen">
        <TabsTrigger value="openstaand">
          Openstaand <Badge count>12</Badge>
        </TabsTrigger>
        <TabsTrigger value="betaald">Betaald</TabsTrigger>
      </TabsList>
      <TabsContent value="openstaand">
        12 facturen wachten op betaling.
      </TabsContent>
      <TabsContent value="betaald">
        Alle betaalde facturen van dit jaar.
      </TabsContent>
    </Tabs>
  )
}
```

Route tabs: links, not ARIA tabs.

```tsx
import { TabsLink, TabsNav } from "@/components/ui/tabs"

export function SettingsNav({ current }: { current: string }) {
  return (
    <TabsNav aria-label="Instellingen">
      <TabsLink href="/instellingen" active={current === "algemeen"}>
        Algemeen
      </TabsLink>
      <TabsLink href="/instellingen/team" active={current === "team"}>
        Team
      </TabsLink>
    </TabsNav>
  )
}
```

With a router, pass its link through `asChild`: `<TabsLink asChild active><Link to="...">Team</Link></TabsLink>`.

## Props

| Part          | Props                                                                              | Notes                                              |
| ------------- | ---------------------------------------------------------------------------------- | -------------------------------------------------- |
| `Tabs`        | Radix `Tabs.Root`: `value`, `defaultValue`, `onValueChange`, `activationMode`, ... | Column layout.                                     |
| `TabsList`    | Radix `Tabs.List` + `variant: "underline" \| "pill"` (default `"underline"`)       | Give it an `aria-label`.                           |
| `TabsTrigger` | Radix `Tabs.Trigger`: `value`, `disabled`                                          | A `Badge` child gets tabular figures.              |
| `TabsContent` | Radix `Tabs.Content`: `value`                                                      | 16px top padding, 14px text, focusable panel.      |
| `TabsNav`     | `React.ComponentProps<"nav">` + `variant` (default `"pill"`)                       | `<nav>` with the tab row. Give it an `aria-label`. |
| `TabsLink`    | `React.ComponentProps<"a">` + `active?: boolean`, `asChild?: boolean`              | `active` sets `aria-current="page"`.               |

`tabsListVariants({ variant })` returns the list classes.

## Variants and states

Every tab is 36px high with 12px side padding, 14px medium text, 6px between label and count, and 4px between tabs.

| Variant / state | Look                                                                                 |
| --------------- | ------------------------------------------------------------------------------------ |
| `underline`     | 1px border under the row; the active tab has cyan text and a 2px cyan bottom border. |
| `pill`          | No row border; the active tab has cyan text on an ice fill, 6px corners.             |
| Hover           | Light grey fill (`accent`).                                                          |
| Focus           | 2px ring with a 2px offset on the tab; the panel shows the same ring when focused.   |
| Disabled        | 50% opacity, not-allowed cursor, no hover fill; keeps its place in the row.          |
| Count           | A secondary `Badge` after the label; leave it out when the count is zero.            |

## Accessibility

- `Tabs` use `role="tablist"`, `tab` and `tabpanel` with `aria-selected` and `aria-controls` (Radix). Arrow keys move between tabs, Tab moves into the panel. Use `activationMode="manual"` when switching a tab is slow.
- Route tabs are links in a `<nav>` with an `aria-label` and `aria-current="page"`, not ARIA tabs.
- A count is part of the tab name; add hidden text such as `<span className="sr-only">nieuw</span>` when the number needs a meaning.
- Tabs are at least 36px high; disabled tabs keep their place.
- Cyan active text is an accepted brand-colour contrast exception.
