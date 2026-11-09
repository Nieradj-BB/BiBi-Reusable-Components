# RadioGroup

Picks exactly one option from a small set that stays visible.

## When to use

- One choice from 2 to 5 options people should compare at a glance.
- Inside a form, wrapped in a `FormFieldGroup` (or a `fieldset` with `<Label as="legend">`).

## When not to use

- More than about 5 options: use Select.
- Independent on/off options: use Checkbox or Switch.

## Install

```bash
npx shadcn@latest add Nieradj-BB/BiBi-Reusable-Components/radio-group#v0.2.0
```

## Usage

```tsx
import { FormFieldGroup } from "@/components/ui/form-field"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

export function InvoiceFrequency() {
  return (
    <fieldset className="min-w-0">
      <Label as="legend">Factuurfrequentie</Label>
      <RadioGroup name="frequency" defaultValue="maand">
        <RadioGroupItem value="week" label="Per week" />
        <RadioGroupItem value="maand" label="Per maand" />
        <RadioGroupItem value="kwartaal" label="Per kwartaal" />
        <RadioGroupItem value="jaar" label="Per jaar" disabled />
      </RadioGroup>
    </fieldset>
  )
}

// In a form: the group error marks every option invalid.
export function PaymentTerm({ error }: { error?: string }) {
  return (
    <FormFieldGroup legend="Betaaltermijn" required error={error}>
      {(group) => (
        <RadioGroup name="term" orientation="horizontal" {...group}>
          <RadioGroupItem value="14" label="14 dagen" />
          <RadioGroupItem
            value="30"
            label="30 dagen"
            description="Standaard voor nieuwe klanten."
          />
        </RadioGroup>
      )}
    </FormFieldGroup>
  )
}
```

## Props

### RadioGroup

| Prop            | Type                                           | Default      | Notes                                                                  |
| --------------- | ---------------------------------------------- | ------------ | ---------------------------------------------------------------------- |
| `value`         | `string`                                       |              | Controlled value. Use `defaultValue` for uncontrolled.                 |
| `onValueChange` | `(value: string) => void`                      |              | Called when the selection changes.                                     |
| `orientation`   | `"vertical" \| "horizontal"`                   | `"vertical"` | Horizontal wraps on narrow screens; arrow keys follow the orientation. |
| `name`          | `string`                                       |              | Name of the hidden native input inside a form.                         |
| `disabled`      | `boolean`                                      | `false`      | Disables every option.                                                 |
| `required`      | `boolean`                                      | `false`      | Sets `aria-required` on the group.                                     |
| `aria-invalid`  | `boolean`                                      | `false`      | Red border on every option. Link the error from the fieldset.          |
| `className`     | `string`                                       |              | Merged with `cn()` on the group.                                       |
| ...             | `React.ComponentProps<typeof RadioGroup.Root>` |              | Passed to the Radix radio group.                                       |

### RadioGroupItem

| Prop           | Type                                           | Default  | Notes                                                            |
| -------------- | ---------------------------------------------- | -------- | ---------------------------------------------------------------- |
| `value`        | `string`                                       | required | The value this option selects.                                   |
| `label`        | `ReactNode`                                    |          | Renders the labelled row: circle, label and description.         |
| `description`  | `ReactNode`                                    |          | 12px muted text under the label, linked with `aria-describedby`. |
| `disabled`     | `boolean`                                      | `false`  | The row at 50% opacity; the option stays visible.                |
| `aria-invalid` | `boolean`                                      | `false`  | Red border on this option only.                                  |
| `id`           | `string`                                       |          | Generated when `label` is set and no id is passed.               |
| ...            | `React.ComponentProps<typeof RadioGroup.Item>` |          | Passed to the Radix radio item.                                  |

Without `label` or `description` only the circle renders; give it an `aria-label` or your own `<label htmlFor>`.

## Variants and states

A 16px circle with a 1px muted border on white. The row is a two-column grid (16px circle, 8px gap, label) with 2px vertical padding and 14px text.

| Example           | Look                                                          |
| ----------------- | ------------------------------------------------------------- |
| Vertical          | Options in a column, 8px apart                                |
| Horizontal        | Options in a row, 20px apart, wrapping on narrow screens      |
| With descriptions | 12px muted description under each label                       |
| Checked           | Cyan border and an 8px cyan dot                               |
| Focus             | 2px cyan outline with a 2px offset on the circle              |
| Invalid           | Red border on every circle, one error message under the group |
| Disabled          | The row at 50% opacity with a not-allowed cursor              |

Put error and description text on a card surface (`bg-card`) for contrast.

## Accessibility

- Built on Radix RadioGroup: `role="radiogroup"` with `role="radio"` options. Tab enters the group on the checked option and leaves it; arrow keys move between options and select.
- Name the group with a `fieldset` and legend (`FormFieldGroup` or `<Label as="legend">`), or with `aria-labelledby`.
- On error set `aria-invalid` on the group (or let `FormFieldGroup` pass it) and link the error from the fieldset with `aria-describedby`.
- The label is part of the click target; rows are at least 24px high.
- The cyan dot and border are an accepted brand-colour contrast exception (decision 5).
