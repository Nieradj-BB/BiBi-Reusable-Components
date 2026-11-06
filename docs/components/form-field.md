# FormField

Wraps a control with its label, required or optional mark, help text and error message, wired for assistive technology. Works without a form library; for react-hook-form see [form-rhf](./form-rhf.md).

## When to use

- Around every single form control: Input, Textarea, Select. Groups of checkboxes go in a `fieldset` with `<Label as="legend">` (see [Checkbox](./checkbox.md)).
- Stack fields with 20px between them (`FormStack`) and end the form with an action row (`FormActions`).

## When not to use

- Placeholder text as the only label.
- Showing a field error only in a toast.

## Install

```bash
npx shadcn@latest add Nieradj-BB/BiBi-Reusable-Components/form-field#v0.1.0
```

Also installs `label` from this registry.

## Usage

```tsx
import * as React from "react"

import { Button } from "@/components/ui/button"
import { FormActions, FormField, FormStack } from "@/components/ui/form-field"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export function ClientForm() {
  const [emailError, setEmailError] = React.useState<string>()

  return (
    <FormStack asChild>
      <form
        noValidate
        onSubmit={(event) => {
          event.preventDefault()
          const email = event.currentTarget.elements.namedItem("email")
          if (email instanceof HTMLInputElement && !email.value.includes("@")) {
            setEmailError(
              "Vul een volledig e-mailadres in, zoals naam@bedrijf.nl."
            )
            email.focus()
          }
        }}
      >
        <FormField
          label="E-mailadres voor facturen"
          required
          help="Hier sturen we elke factuur naartoe."
          error={emailError}
        >
          <Input name="email" type="email" />
        </FormField>

        {/* Composed controls: spread the props on the focusable part. */}
        <FormField label="Status" optional>
          {(control) => (
            <Select name="status">
              <SelectTrigger {...control}>
                <SelectValue placeholder="Kies een status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="closed">Afgerond</SelectItem>
              </SelectContent>
            </Select>
          )}
        </FormField>

        <FormActions>
          <Button variant="outline" type="reset">
            Annuleren
          </Button>
          <Button type="submit">Klant toevoegen</Button>
        </FormActions>
      </form>
    </FormStack>
  )
}
```

## Props

### FormField

| Prop        | Type                                                            | Default  | Notes                                                                                                |
| ----------- | --------------------------------------------------------------- | -------- | ---------------------------------------------------------------------------------------------------- |
| `label`     | `ReactNode`                                                     | required | Rendered by Label and linked to the control with `htmlFor`.                                          |
| `required`  | `boolean`                                                       | `false`  | Red asterisk (`aria-hidden`); `required` on an element child, `aria-required` for a render function. |
| `optional`  | `boolean`                                                       | `false`  | Shows `(optioneel)` after the label.                                                                 |
| `help`      | `ReactNode`                                                     |          | 12px muted text under the control, added to `aria-describedby`.                                      |
| `error`     | `ReactNode`                                                     |          | 14px red text under the help, `role="alert"`; sets `aria-invalid="true"`.                            |
| `id`        | `string`                                                        |          | Id of the control. Defaults to the child's `id`, then to `useId()`.                                  |
| `children`  | `ReactElement \| (control: FormFieldControlProps) => ReactNode` | required | One control element (props are merged into it) or a render function.                                 |
| `className` | `string`                                                        |          | Merged on the wrapper with `cn()`.                                                                   |
| ...         | `React.ComponentProps<"div">`                                   |          | Passed to the wrapper.                                                                               |

`FormFieldControlProps` is `{ id, "aria-describedby"?, "aria-invalid"?, "aria-required"? }`. An `aria-describedby` already on the child is kept and the help and error ids are appended. A render function gets `aria-required` instead of `required`, because `required` is not valid on a button such as the Select trigger; for native form validation also put `required` on the `<Select>` root.

### Other parts

| Part             | Element | Look                                                                    |
| ---------------- | ------- | ----------------------------------------------------------------------- |
| `FormStack`      | `div`   | Column with 20px between fields, max width 28rem. `asChild` for a form. |
| `FormActions`    | `div`   | Right-aligned row, 8px gap, 4px top padding; main action last.          |
| `FormFieldRoot`  | `div`   | The field column (4px gap); used by form-rhf.                           |
| `FormFieldHelp`  | `p`     | 12px/16px muted help text.                                              |
| `FormFieldError` | `p`     | 14px/20px destructive text with `role="alert"`.                         |

## Variants and states

| Example       | Look                                                                        |
| ------------- | --------------------------------------------------------------------------- |
| Anatomy       | Label with red asterisk, 8px to the control, 4px to the help text           |
| Error         | Red control border, error text under the help text                          |
| Optional hint | `(optioneel)` after the label, muted, weight 400                            |
| Disabled      | Control at 50% opacity; the help text says why it cannot be changed         |
| Form          | Three fields 20px apart, action row right-aligned with the main action last |

Put error text on a card surface (`bg-card`): red text on the page background is below 4.5:1 (4.29:1). Muted help text passes on card and background but not on the muted, ice or secondary fills.

## Accessibility

- The label points at the control id (`useId`); groups of checkboxes use a `fieldset` with `<Label as="legend">` instead of FormField.
- `aria-describedby` lists the help id and, when shown, the error id; the control gets `aria-invalid="true"`.
- Errors appear under the field with `role="alert"`. Submit with `noValidate` and move focus to the first invalid field.
- Required: the `required` attribute is set on an element child, and `aria-required="true"` on the part a render function spreads the props on (a Select trigger); the asterisk itself is `aria-hidden`. For a required Select, also set `required` on the `<Select>` root so its hidden native select takes part in form validation.
