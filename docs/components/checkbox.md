# Checkbox

Turns an independent option on or off, or selects rows; supports a mixed (indeterminate) state.

## When to use

- Independent yes/no options in a form.
- Multi-select lists and table row selection, with `indeterminate` for "select all".

## When not to use

- A setting that takes effect immediately: use [Switch](switch.md).
- One choice from several: use [RadioGroup](radio-group.md) for a short list that stays visible, or [Select](select.md) for a longer one.

## Install

```bash
npx shadcn@latest add Nieradj-BB/BiBi-Reusable-Components/checkbox#v0.2.0
```

## Usage

```tsx
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

export function ReminderOption() {
  return (
    <Checkbox
      label="Automatisch herinneren"
      description="Stuurt de klant 7 dagen na de vervaldatum een herinnering."
      defaultChecked
    />
  )
}

export function Columns() {
  return (
    <fieldset className="flex min-w-0 flex-col gap-2">
      <Label as="legend">Kolommen tonen</Label>
      <Checkbox label="Klant" defaultChecked />
      <Checkbox label="Bedrag" defaultChecked />
      <Checkbox label="Vervaldatum" />
    </fieldset>
  )
}

// In a table header: a bare box with an aria-label.
export function SelectAll({
  checked,
  onCheckedChange,
}: {
  checked: boolean | "indeterminate"
  onCheckedChange: (checked: boolean) => void
}) {
  return (
    <Checkbox
      aria-label="Alle facturen selecteren"
      checked={checked}
      onCheckedChange={(value) => onCheckedChange(value === true)}
    />
  )
}
```

## Props

| Prop              | Type                                            | Default | Notes                                                          |
| ----------------- | ----------------------------------------------- | ------- | -------------------------------------------------------------- |
| `checked`         | `boolean \| "indeterminate"`                    |         | Controlled state. Use `defaultChecked` for uncontrolled.       |
| `onCheckedChange` | `(checked: boolean \| "indeterminate") => void` |         | Called when the state changes.                                 |
| `label`           | `ReactNode`                                     |         | Renders the labelled row: box, label and optional description. |
| `description`     | `ReactNode`                                     |         | Help text under the label, linked with `aria-describedby`.     |
| `disabled`        | `boolean`                                       | `false` | The row (or the bare box) at 50% opacity.                      |
| `id`              | `string`                                        |         | Generated when `label` is set and no id is passed.             |
| `className`       | `string`                                        |         | Merged with `cn()` on the box.                                 |
| ...               | `React.ComponentProps<typeof Checkbox.Root>`    |         | Passed to the Radix checkbox.                                  |

Without `label` or `description` only the box renders; give it an `aria-label` or your own `<label htmlFor>`.

## Variants and states

A 16px box with a 6px radius and a 1px muted border on white. The row is a two-column grid (16px box, 8px gap, label) with 2px vertical padding and 14px text; the description is 12px muted text.

| State         | Look                                          |
| ------------- | --------------------------------------------- |
| Unchecked     | Muted border, white fill                      |
| Checked       | Cyan fill and border, white 14px check        |
| Indeterminate | Cyan fill and border, white 14px minus        |
| Focus         | 2px cyan outline with a 2px offset on the box |
| Disabled      | The whole row at 50%, not-allowed cursor      |

Stack checkboxes in a column with an 8px gap; group them in a `fieldset` with `Label as="legend"`. In a form, use `FormFieldGroup` ([FormField](form-field.md)) for the legend, help and one group error.

## Accessibility

- Built on Radix Checkbox: `role="checkbox"` with `aria-checked`; Space toggles it.
- Indeterminate is exposed as `aria-checked="mixed"` (`checked="indeterminate"`).
- The label is part of the click target; rows are at least 24px high.
- Group related checkboxes in a `fieldset` with a legend (in a form, `FormFieldGroup`); the description is linked with `aria-describedby`.
- The white check on cyan is an accepted brand-colour contrast exception (decision 5).
