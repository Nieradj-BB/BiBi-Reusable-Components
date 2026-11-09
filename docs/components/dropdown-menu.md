# DropdownMenu

A menu of actions or view options that opens from a button, in the same white panel as Select and Popover.

## When to use

- Row or page actions that do not all fit as buttons ("more actions").
- View options: visible columns (checkbox items) or sort order (radio items).
- An account menu in the app header.

## When not to use

- Choosing a value for a form field: use Select.
- The main action of a view: show it as a button.
- Navigation between pages: use links in the app shell or tabs.

## Install

```bash
npx shadcn@latest add Nieradj-BB/BiBi-Reusable-Components/dropdown-menu#v0.2.0
```

## Usage

```tsx
import { CopyIcon, EllipsisIcon, PencilIcon, Trash2Icon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function InvoiceActions({
  number,
  onDelete,
}: {
  number: string
  onDelete: () => void
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon-sm"
          aria-label={`Acties voor factuur ${number}`}
        >
          <EllipsisIcon aria-hidden="true" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem>
          <PencilIcon aria-hidden="true" />
          Bewerken
          <DropdownMenuShortcut>Ctrl+E</DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <CopyIcon aria-hidden="true" />
          Dupliceren
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive" onSelect={onDelete}>
          <Trash2Icon aria-hidden="true" />
          Verwijderen
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
```

A text trigger with the turning chevron:

```tsx
<DropdownMenuTrigger asChild>
  <Button variant="outline">
    Acties
    <DropdownMenuChevron />
  </Button>
</DropdownMenuTrigger>
```

Let a destructive item open an AlertDialog to confirm; do not delete straight from the menu.

## Props

The parts follow shadcn/ui and Radix DropdownMenu: `DropdownMenu`, `DropdownMenuTrigger`, `DropdownMenuContent`, `DropdownMenuGroup`, `DropdownMenuLabel`, `DropdownMenuItem`, `DropdownMenuShortcut`, `DropdownMenuSeparator`, `DropdownMenuCheckboxItem`, `DropdownMenuRadioGroup`, `DropdownMenuRadioItem`, `DropdownMenuSub`, `DropdownMenuSubTrigger`, `DropdownMenuSubContent`, `DropdownMenuPortal`, plus `DropdownMenuChevron` for a trigger button.

| Part / prop                                           | Type                           | Default     | Notes                                                                                     |
| ----------------------------------------------------- | ------------------------------ | ----------- | ----------------------------------------------------------------------------------------- |
| `DropdownMenu` `open` / `defaultOpen`                 | `boolean`                      |             | Controlled or initial open state, with `onOpenChange`.                                    |
| `DropdownMenu` `modal`                                | `boolean`                      | `true`      | While a modal menu is open the rest of the page is inert.                                 |
| `DropdownMenuContent` `align`                         | `"start" \| "center" \| "end"` | `"start"`   | Use `end` for a trigger at the right edge, such as a row's "more actions" button.         |
| `DropdownMenuContent` `sideOffset`                    | `number`                       | `4`         | Gap between trigger and panel in px.                                                      |
| `DropdownMenuItem` `variant`                          | `"default" \| "destructive"`   | `"default"` | Destructive: red text and icon; red fill with white text when highlighted.                |
| `DropdownMenuItem` `inset`                            | `boolean`                      | `false`     | Indents the text to line up with checkbox and radio items. Also on `Label`, `SubTrigger`. |
| `DropdownMenuItem` `disabled`                         | `boolean`                      | `false`     | 50% opacity; skipped by the keyboard.                                                     |
| `DropdownMenuItem` `onSelect`                         | `(event: Event) => void`       |             | Runs on click, Enter or Space; the menu then closes unless you call `preventDefault()`.   |
| `DropdownMenuCheckboxItem` `checked`                  | `boolean \| "indeterminate"`   | `false`     | With `onCheckedChange`.                                                                   |
| `DropdownMenuCheckboxItem` `closeOnSelect`            | `boolean`                      | `false`     | By default the menu stays open so several options can be toggled.                         |
| `DropdownMenuRadioGroup` `value`                      | `string`                       |             | With `onValueChange`; radio items close the menu when chosen.                             |
| `DropdownMenuSubContent` `sideOffset` / `alignOffset` | `number`                       | `-4` / `-5` | Places the submenu beside its trigger with the first item level with it.                  |
| `className`                                           | `string`                       |             | Merged with `cn()` on every part.                                                         |

## Variants and states

The panel is white with a 1px border, 12px radius, 4px padding, the panel shadow and a minimum width of 192px (176px for a submenu). Items are at least 32px high with 8px by 6px padding, a 6px radius and 14px text; 16px icons in muted grey come first and shortcuts sit right-aligned in 12px muted text with wide tracking. Labels are 12px muted text; separators run edge to edge. Checkbox and radio items have a 32px inset with a cyan check or a cyan dot.

| State               | Look                                                                                     |
| ------------------- | ---------------------------------------------------------------------------------------- |
| Hover / highlighted | Grey accent fill; a shortcut turns dark (muted text on the accent fill fails contrast)   |
| Keyboard focus      | Accent fill plus a 2px cyan outline with a 2px offset (not on pointer hover)             |
| Disabled            | 50% opacity, not-allowed cursor                                                          |
| Destructive hover   | Red fill with white text, icon and shortcut                                              |
| Sub-trigger open    | Keeps the accent fill while its submenu is open                                          |
| Trigger open        | Outline and ghost Button triggers keep the accent fill; `DropdownMenuChevron` turns 180° |

## Accessibility

- The trigger is a real button with `aria-haspopup="menu"` and `aria-expanded`; name an icon-only trigger after its object ("Acties voor factuur 2026-014").
- Arrow keys move between items, Enter or Space activates, typing a letter jumps to an item, Escape closes and returns focus to the trigger; ArrowRight opens a submenu, ArrowLeft closes it.
- Items use `menuitem`, `menuitemcheckbox` (`aria-checked`) or `menuitemradio`. Label a group by giving the `DropdownMenuLabel` an `id` and the `DropdownMenuGroup` or `DropdownMenuRadioGroup` `aria-labelledby`.
- Checked state is shown by a check or dot, never by colour alone. Icons are decorative: give them `aria-hidden`.
- While a modal menu is open the rest of the page is hidden from assistive technology; the trigger then leaves the tab order (`tabIndex={-1}`) and gets focus back when the menu closes.
