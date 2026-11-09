# Label

The visible name above a form control or group, with an optional required mark or optional hint.

## When to use

- Above every Input (search fields included), Textarea and Select, linked with `htmlFor` and `id`.
- As the legend of a group of checkboxes (`as="legend"`).

## When not to use

- Placeholder text instead of a label.
- Bold body text that is not linked to a control.

## Install

```bash
npx shadcn@latest add Nieradj-BB/BiBi-Reusable-Components/label#v0.2.0
```

## Usage

```tsx
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function ClientName() {
  return (
    <div className="flex flex-col gap-1">
      <Label htmlFor="client-name" className="mb-1" required>
        Klantnaam
      </Label>
      <Input id="client-name" required />
    </div>
  )
}

export function SendVia() {
  return (
    <fieldset className="flex min-w-0 flex-col gap-2">
      <Label as="legend">Factuur versturen via</Label>
      <Checkbox label="E-mail" defaultChecked />
      <Checkbox label="Post" />
    </fieldset>
  )
}
```

## Props

| Prop           | Type                                      | Default         | Notes                                                         |
| -------------- | ----------------------------------------- | --------------- | ------------------------------------------------------------- |
| `htmlFor`      | `string`                                  |                 | Id of the control. Required for `as="label"`.                 |
| `required`     | `boolean`                                 | `false`         | Red asterisk (`aria-hidden`); the control carries `required`. |
| `optional`     | `boolean`                                 | `false`         | Shows the optional hint after the text.                       |
| `optionalHint` | `ReactNode`                               | `"(optioneel)"` | Text of the hint.                                             |
| `as`           | `"label" \| "legend"`                     | `"label"`       | `legend` renders a fieldset legend with 8px below it.         |
| `className`    | `string`                                  |                 | Merged with `cn()`.                                           |
| ...            | `React.ComponentProps<typeof Label.Root>` |                 | Passed to the Radix label (or the `<legend>`).                |

## Variants and states

14px semibold navy text on a 20px line. Put 8px between the label and its control (`mb-1` inside a `gap-1` column, as FormField does).

| Variant       | Look                                                  |
| ------------- | ----------------------------------------------------- |
| Default       | Navy semibold text                                    |
| Required      | Red asterisk 2px after the text                       |
| Optional hint | `(optioneel)` 4px after the text, muted, weight 400   |
| Legend        | The same style on a `<legend>`, 8px above the options |

A label next to a disabled peer control turns 50% opacity.

## Accessibility

- Link every label to its control with `htmlFor` and `id`; a group of controls uses a `fieldset` with the label as `legend`.
- The asterisk is `aria-hidden`; the control itself carries `required`.
- The optional hint is part of the accessible name (`Referentie (optioneel)`).
- Clicking the label focuses or toggles its control, which enlarges the target.
