# EmptyState

A dashed box that says nothing is here yet, how items appear, and what to do next.

## When to use

- A list or table without items yet.
- A search or filter that returns nothing (`size="compact"`, quote the search term).
- An empty group inside a page (`size="inline"`).

## When not to use

- Errors: a callout (not in the library yet: ask for it in the library repo).
- Loading: use a Skeleton.

## Install

```bash
npx shadcn@latest add Nieradj-BB/BiBi-Reusable-Components/empty-state#v0.1.0
```

## Usage

```tsx
import { FolderIcon, PlusIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { EmptyState } from "@/components/ui/empty-state"

export function NoProjects() {
  return (
    <EmptyState
      icon={FolderIcon}
      title="Nog geen projecten"
      description="Maak een project aan om uren, documenten en facturen bij elkaar te houden."
      action={
        <Button>
          <PlusIcon aria-hidden="true" />
          Nieuw project
        </Button>
      }
    />
  )
}

export function NoInvoicesForFilter({ onClear }: { onClear: () => void }) {
  return (
    <EmptyState
      size="compact"
      description="Geen facturen die bij deze filters passen."
      action={
        <Button variant="outline" size="sm" onClick={onClear}>
          Filters wissen
        </Button>
      }
    />
  )
}
```

## Props

| Prop          | Type                                 | Default     | Notes                                                                       |
| ------------- | ------------------------------------ | ----------- | --------------------------------------------------------------------------- |
| `size`        | `"default" \| "compact" \| "inline"` | `"default"` | See below.                                                                  |
| `icon`        | `LucideIcon`                         |             | Decorative; shown in a 48px cyan circle (default size only).                |
| `title`       | `ReactNode`                          |             | 18px bold navy heading font (default size only).                            |
| `description` | `ReactNode`                          | required    | What is missing and how items appear.                                       |
| `action`      | `ReactNode`                          |             | A Button or link: default variant to create, outline `sm` to clear filters. |
| `inset`       | `boolean`                            | `false`     | No border and no radius, for use inside a table or card.                    |
| `className`   | `string`                             |             | Merged with `cn()`.                                                         |
| ...           | `React.ComponentProps<"div">`        |             | Except `title`.                                                             |

`emptyStateVariants` is exported for the wrapper classes.

## Variants and states

All sizes: 1px dashed strong border, 12px radius.

| Variant               | Look                                                                                                     |
| --------------------- | -------------------------------------------------------------------------------------------------------- |
| Default               | 40px padding, centred; icon circle 16px above the title, text 4px below it (max 48ch), action 20px below |
| Title and text        | The most common form: no icon, no action                                                                 |
| No results for filter | Compact with an outline `sm` button 12px below the text                                                  |
| Compact               | 24px padding, centred text only                                                                          |
| Inline                | 16px by 20px padding, left-aligned text and action on one row (wraps on narrow screens)                  |
| Inset                 | Any size without border and radius                                                                       |

## Accessibility

- The icon is decorative (`aria-hidden`); the title and text say what is missing.
- The action is a real button or link with a visible label.
- After searching or filtering, also announce the result count in the list's `role="status"` region.
