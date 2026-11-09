# Switch

Turns a single setting on or off, read as a live on/off state.

## When to use

- A setting that is on or off and takes effect right away, such as notifications or visibility.
- Toggle columns in a settings table, with optional state text.

## When not to use

- Agreeing to something in a form, or options saved with a submit button: use Checkbox.
- More than two states: use RadioGroup or Select.

## Install

```bash
npx shadcn@latest add Nieradj-BB/BiBi-Reusable-Components/switch#v0.2.0
```

## Usage

```tsx
import * as React from "react"

import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"

export function AutoSave() {
  return <Switch label="Automatisch opslaan" defaultChecked />
}

// Setting row: name and explanation on the left, the switch on the right.
export function WeeklySummary() {
  return (
    <div className="flex items-start justify-between gap-4">
      <div>
        <Label htmlFor="weekly-summary">Wekelijkse samenvatting</Label>
        <p
          id="weekly-summary-help"
          className="mt-1 text-xs text-muted-foreground"
        >
          Elke maandag een overzicht van openstaande facturen.
        </p>
      </div>
      <Switch id="weekly-summary" aria-describedby="weekly-summary-help" />
    </div>
  )
}

// In a table cell: the state text is for sighted users only.
export function VisibleToClient() {
  const [visible, setVisible] = React.useState(true)

  return (
    <div className="inline-flex items-center gap-2">
      <Switch
        aria-label="Zichtbaar voor de klant"
        checked={visible}
        onCheckedChange={setVisible}
      />
      <span aria-hidden="true" className="text-xs text-muted-foreground">
        {visible ? "Zichtbaar" : "Verborgen"}
      </span>
    </div>
  )
}
```

## Props

| Prop              | Type                                       | Default | Notes                                                    |
| ----------------- | ------------------------------------------ | ------- | -------------------------------------------------------- |
| `checked`         | `boolean`                                  |         | Controlled state. Use `defaultChecked` for uncontrolled. |
| `onCheckedChange` | `(checked: boolean) => void`               |         | Called when the state changes.                           |
| `label`           | `ReactNode`                                |         | Renders a labelled row: the switch, 8px gap, 14px label. |
| `disabled`        | `boolean`                                  | `false` | The switch (or the row) at 50% opacity.                  |
| `name`            | `string`                                   |         | Name of the hidden native checkbox inside a form.        |
| `id`              | `string`                                   |         | Generated when `label` is set and no id is passed.       |
| `className`       | `string`                                   |         | Merged with `cn()` on the track.                         |
| ...               | `React.ComponentProps<typeof Switch.Root>` |         | Passed to the Radix switch.                              |

Without `label`, name the switch with `aria-label`, `aria-labelledby` or a `<Label htmlFor>`.

## Variants and states

A 44 by 24px track with a fully rounded shape and a 16px white knob with the tile shadow, 4px from the edge.

| Example         | Look                                                               |
| --------------- | ------------------------------------------------------------------ |
| Off             | Grey (muted text colour) track, knob left                          |
| On              | Cyan track, knob right                                             |
| Focus           | 2px cyan outline with a 2px offset on the track                    |
| Disabled        | 50% opacity, not-allowed cursor                                    |
| With label      | Switch, 8px gap, 14px label; the label toggles too                 |
| With state text | 12px muted text after the switch, `aria-hidden`                    |
| Setting row     | Label and help on the left, switch on the right, 16px between them |

The track colour changes in 150ms; the knob only slides when reduced motion is off.

## Accessibility

- Built on Radix Switch: a button with `role="switch"` and `aria-checked`; Space and Enter toggle it and the on/off state is announced.
- Name it with `label`, `aria-label` or `aria-labelledby` (in a table: the row heading plus the column heading).
- State text next to the switch is `aria-hidden` so it is not read twice.
- The 44 by 24px track meets the 24px target size.
- The cyan track is an accepted brand-colour contrast exception (decision 5).
