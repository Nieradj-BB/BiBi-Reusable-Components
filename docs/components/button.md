# Button

Starts an action: cyan for the main action, navy, outline and ghost for everything around it, red for removing data.

## When to use

- `default` (cyan) for the one main action in a view, form or dialog.
- `outline` next to it for secondary actions; `ghost` for low-emphasis actions in toolbars and table rows.
- `destructive` only for actions that remove data.

## When not to use

- More than one cyan button in the same area.
- Navigating to another page: use a link (or `asChild` with an `<a>` when it must look like a button).
- Icon-only buttons without an `aria-label`.

## Install

```bash
npx shadcn@latest add Nieradj-BB/BiBi-Reusable-Components/button#v0.2.0
```

## Usage

```tsx
import { Plus } from "lucide-react"

import { Button } from "@/components/ui/button"

export function InvoiceActions({ saving }: { saving: boolean }) {
  return (
    <div className="flex flex-wrap items-center justify-end gap-2">
      <Button variant="outline">Annuleren</Button>
      <Button type="submit" loading={saving}>
        {saving ? "Opslaan…" : "Opslaan"}
      </Button>
    </div>
  )
}

export function AddProject() {
  return (
    <Button>
      <Plus aria-hidden="true" />
      Project toevoegen
    </Button>
  )
}
```

## Props

| Prop        | Type                                                            | Default     | Notes                                                                                     |
| ----------- | --------------------------------------------------------------- | ----------- | ----------------------------------------------------------------------------------------- |
| `variant`   | `"default" \| "navy" \| "outline" \| "ghost" \| "destructive"`  | `"default"` | Tone of the button.                                                                       |
| `size`      | `"default" \| "sm" \| "lg" \| "icon" \| "icon-sm" \| "icon-lg"` | `"default"` | Height 36, 32 or 44px; the icon sizes are square.                                         |
| `loading`   | `boolean`                                                       | `false`     | Shows a spinner in place of the icon, sets `aria-busy` and ignores clicks; stays enabled. |
| `disabled`  | `boolean`                                                       | `false`     | 50% opacity and a not-allowed cursor.                                                     |
| `asChild`   | `boolean`                                                       | `false`     | Render the child element (Radix Slot) with the button styles.                             |
| `className` | `string`                                                        |             | Merged with `cn()`.                                                                       |
| ...         | `React.ComponentProps<"button">`                                |             | Passed to the `<button>`.                                                                 |

`buttonVariants({ variant, size })` returns the classes for use on other elements, such as a link.

## Variants and states

All buttons: 14px medium text, 6px radius, a 1px border, 16px horizontal padding, 8px gap; icons inside are 16px.

| Variant       | Look                               | Hover           |
| ------------- | ---------------------------------- | --------------- |
| `default`     | Cyan fill, white text              | Fill at 90%     |
| `navy`        | Navy fill, white text              | Fill at 90%     |
| `outline`     | White fill, grey border, dark text | Grey hover fill |
| `ghost`       | No fill, dark text                 | Grey hover fill |
| `destructive` | Red fill, white text               | Fill at 90%     |

| Size      | Size                                       |
| --------- | ------------------------------------------ |
| `default` | 36px high, 16px padding                    |
| `sm`      | 32px high, 12px padding, 12px text         |
| `lg`      | 44px high, 24px padding                    |
| `icon`    | 36 x 36px (`icon-sm` 32px, `icon-lg` 44px) |

States: hover (above), keyboard focus (2px cyan outline, 2px offset), disabled (50% opacity), loading (spinning `LoaderCircle`, progress cursor; the spinner only turns when reduced motion is off).

Put a row of actions right-aligned, the secondary action first and the main action last, with an 8px gap.

## Accessibility

- Every button shows the 2px cyan focus outline with a 2px offset on keyboard focus; never remove it.
- Icon-only buttons need an `aria-label`; icons inside buttons get `aria-hidden="true"`.
- A disabled button keeps its place, and the reason is visible text linked with `aria-describedby`.
- Loading keeps the button enabled (a disabled button drops focus) and ignores repeat clicks. The spinner is `aria-hidden`; change the label to say what is happening (`Opslaan…`).
- White text on cyan is an accepted brand-colour contrast exception (decision 5).
