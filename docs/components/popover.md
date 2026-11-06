# Popover

A small panel anchored to a button, for a short explanation (toggletip) or a quick one-field form.

## When to use

- Background on a metric or term behind an info button (`InfoPopover`).
- A one-field form (add a label, rename) that should not leave the page.

## When not to use

- Warnings or errors: a callout in the page (not in the library yet: ask for it in the library repo).
- More than a few lines or fields: use Dialog or Sheet.
- Hover hints on icon buttons: use Tooltip.

## Install

```bash
npx shadcn@latest add Nieradj-BB/BiBi-Reusable-Components/popover#v0.1.0
```

## Usage

Info (toggletip):

```tsx
import { InfoPopover, PopoverTerm } from "@/components/ui/popover"

export function OpenAmountHeading() {
  return (
    <div className="flex items-center justify-between gap-2 text-sm font-semibold text-primary">
      <span>Openstaand bedrag</span>
      <InfoPopover topic="openstaand bedrag">
        <p>
          <PopoverTerm>Openstaand:</PopoverTerm> verstuurde facturen die nog
          niet zijn betaald.
        </p>
        <p>
          <PopoverTerm>Vervallen:</PopoverTerm> facturen waarvan de
          betaaltermijn voorbij is.
        </p>
      </InfoPopover>
    </div>
  )
}
```

Small form:

```tsx
import { PlusIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverClose,
  PopoverContent,
  PopoverFooter,
  PopoverTrigger,
} from "@/components/ui/popover"

export function AddLabel() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm">
          <PlusIcon aria-hidden="true" />
          Label toevoegen
        </Button>
      </PopoverTrigger>
      <PopoverContent aria-label="Label toevoegen" className="w-72 gap-3">
        <div className="flex flex-col gap-1">
          <Label htmlFor="label-name" className="mb-1">
            Naam van het label
          </Label>
          <Input id="label-name" placeholder="Bijvoorbeeld: Spoed" />
        </div>
        <PopoverFooter>
          <PopoverClose asChild>
            <Button variant="ghost" size="sm">
              Annuleren
            </Button>
          </PopoverClose>
          <Button size="sm">Toevoegen</Button>
        </PopoverFooter>
      </PopoverContent>
    </Popover>
  )
}
```

## Props

Parts: `Popover`, `PopoverTrigger`, `PopoverContent`, `PopoverAnchor`, `PopoverClose`, `PopoverFooter`, `PopoverTerm`, and the ready-made `InfoPopover`. Root, trigger, anchor and close take the Radix Popover props.

`PopoverContent`:

| Prop         | Type                           | Default    | Notes                             |
| ------------ | ------------------------------ | ---------- | --------------------------------- |
| `align`      | `"start" \| "center" \| "end"` | `"start"`  |                                   |
| `side`       | `"bottom" \| "top" \| ...`     | `"bottom"` | Flips when there is no room.      |
| `sideOffset` | `number`                       | `6`        | Gap to the trigger in px.         |
| `aria-label` | `string`                       |            | Name the panel (`role="dialog"`). |
| `className`  | `string`                       |            | Merged with `cn()`.               |

`InfoPopover`:

| Prop                 | Type                 | Default | Notes                                            |
| -------------------- | -------------------- | ------- | ------------------------------------------------ |
| `topic`              | `string`             |         | Names trigger and panel: `Uitleg bij <topic>`.   |
| `children`           | `ReactNode`          |         | The explanation; start lines with `PopoverTerm`. |
| `align`              | as above             | `"end"` | Aligned to the end of the info button.           |
| `side`, `sideOffset` | as above             |         |                                                  |
| `className`          | `string`             |         | On the trigger.                                  |
| `contentClassName`   | `string`             |         | On the panel.                                    |
| ...                  | Radix `Popover.Root` |         | `open`, `defaultOpen`, `onOpenChange`.           |

`PopoverFooter` right-aligns small buttons with an 8px gap. `PopoverTerm` is a semibold navy `strong`.

## Variants and states

- Surface: card white, 1px border, 12px radius, `shadow-panel`, 12px padding, max width 20rem, 14px text with line height 1.625, 8px between lines.
- Form: `className="w-72 gap-3"` (18rem wide, 12px gaps); fields and small buttons from the input and button items.
- Info trigger: round 32px ghost button with a 16px info icon in muted grey; hover fills it with the accent grey; focus shows the 2px cyan ring with a 2px offset.

## Accessibility

- The trigger is a real button with `aria-expanded` and `aria-controls`; the info trigger is named `Uitleg bij <topic>`.
- Opens on click, Enter or Space, never on hover. Escape closes it and returns focus to the trigger; an outside click closes it and leaves focus where the user clicked.
- A form popover moves focus to its first field; an info popover focuses the panel itself.
- The round info trigger is 32×32px, above the 24px target minimum.
