# FormField

Wraps a control with its label, required or optional mark, help text and error message, wired for assistive technology. Works without a form library; for react-hook-form see [form-rhf](./form-rhf.md).

## When to use

- Around every single form control: Input, Textarea, Select.
- `FormFieldGroup` around a group of checkboxes or a RadioGroup: a `fieldset` with legend, help and one error for the whole group.
- `FormFieldRow` for two short fields side by side (first and last name); they stack on narrow screens.
- `FormError` for an error that belongs to no single field (server, permissions), right above the actions.
- Stack fields with 20px between them (`FormStack`) and end the form with an action row (`FormActions`).

## When not to use

- Placeholder text as the only label.
- Showing a field error only in a toast, or only in `FormError`: field errors stay at their fields.

## Install

```bash
npx shadcn@latest add Nieradj-BB/BiBi-Reusable-Components/form-field#v0.2.0
```

Also installs `label` and `alert` from this registry.

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

Groups, rows and a form-level error:

```tsx
import { Checkbox } from "@/components/ui/checkbox"
import {
  FormError,
  FormField,
  FormFieldGroup,
  FormFieldRow,
  FormStack,
} from "@/components/ui/form-field"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

export function ContactForm({
  deliveryError,
  termError,
  serverError,
}: {
  deliveryError?: string
  termError?: string
  serverError?: string
}) {
  return (
    <FormStack>
      <FormFieldRow>
        <FormField label="Voornaam" required>
          <Input autoComplete="given-name" />
        </FormField>
        <FormField label="Achternaam" required>
          <Input autoComplete="family-name" />
        </FormField>
      </FormFieldRow>

      <FormFieldGroup
        legend="Factuur versturen via"
        required
        help="Kies een of meer manieren."
        error={deliveryError}
      >
        <Checkbox label="E-mail" />
        <Checkbox label="Post" />
        <Checkbox label="Klantportaal" />
      </FormFieldGroup>

      {/* A render function passes aria-invalid on to the RadioGroup. */}
      <FormFieldGroup legend="Betaaltermijn" required error={termError}>
        {(group) => (
          <RadioGroup name="term" {...group}>
            <RadioGroupItem value="14" label="14 dagen" />
            <RadioGroupItem value="30" label="30 dagen" />
          </RadioGroup>
        )}
      </FormFieldGroup>

      {serverError && (
        <FormError title="Klant niet opgeslagen">{serverError}</FormError>
      )}
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

`FormFieldControlProps` is `{ id, "aria-describedby"?, "aria-invalid"?, "aria-required"? }`. An `aria-describedby` already on the child is kept and the help and error ids are appended. A render function gets `aria-required` instead of `required`, because `required` is not valid on a button such as the Select trigger; spread the props on a part whose role allows `aria-required` (combobox, textbox, radiogroup), not on a plain button; for native form validation also put `required` on the `<Select>` root.

### FormFieldGroup

| Prop           | Type                                                            | Default         | Notes                                                                                                                            |
| -------------- | --------------------------------------------------------------- | --------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| `legend`       | `ReactNode`                                                     | required        | Rendered as `<Label as="legend">`, 4px above the options.                                                                        |
| `required`     | `boolean`                                                       | `false`         | Red asterisk on the legend (`aria-hidden`); `aria-required` for a render function, else hidden `(verplicht)` text in the legend. |
| `requiredHint` | `string`                                                        | `"(verplicht)"` | The hidden legend text for a required group of element children (checkboxes).                                                    |
| `optional`     | `boolean`                                                       | `false`         | Shows `(optioneel)` after the legend.                                                                                            |
| `help`         | `ReactNode`                                                     |                 | 12px muted text under the options, linked from the fieldset.                                                                     |
| `error`        | `ReactNode`                                                     |                 | One 14px red message for the group, `role="alert"`, linked from the fieldset.                                                    |
| `id`           | `string`                                                        |                 | Id of the fieldset; defaults to `useId()`. The help and error ids derive from it.                                                |
| `children`     | `ReactNode \| (group: FormFieldGroupControlProps) => ReactNode` | required        | The options, stacked 8px apart, or a render function for a RadioGroup.                                                           |
| `className`    | `string`                                                        |                 | Merged on the fieldset with `cn()`.                                                                                              |
| ...            | `React.ComponentProps<"fieldset">`                              |                 | Passed to the fieldset; an own `aria-describedby` is kept.                                                                       |

`FormFieldGroupControlProps` is `{ "aria-invalid"?: true, "aria-required"?: true }`: spread it on a RadioGroup so every option gets the red border while the group has an error, and the group is announced as required.

### FormError

| Prop       | Type                          | Default | Notes                                                                |
| ---------- | ----------------------------- | ------- | -------------------------------------------------------------------- |
| `title`    | `ReactNode`                   |         | Short semibold summary above the message.                            |
| `children` | `ReactNode`                   |         | What went wrong and what to do; rendered as the Alert description.   |
| `size`     | `"default" \| "compact"`      |         | Alert size; `compact` for tight spaces such as dialogs.              |
| ...        | `React.ComponentProps<"div">` |         | Passed to the destructive Alert (`role="alert"`, circle-alert icon). |

### Other parts

| Part             | Element | Look                                                                            |
| ---------------- | ------- | ------------------------------------------------------------------------------- |
| `FormStack`      | `div`   | Column with 20px between fields, max width 28rem. `asChild` for a form.         |
| `FormActions`    | `div`   | Right-aligned row, 8px gap, 4px top padding; main action last.                  |
| `FormFieldRow`   | `div`   | Two equal columns 16px apart (20px between rows); they stack below about 23rem. |
| `FormFieldRoot`  | `div`   | The field column (4px gap); used by form-rhf.                                   |
| `FormFieldHelp`  | `p`     | 12px/16px muted help text.                                                      |
| `FormFieldError` | `p`     | 14px/20px destructive text with `role="alert"`.                                 |

## Variants and states

| Example          | Look                                                                         |
| ---------------- | ---------------------------------------------------------------------------- |
| Anatomy          | Label with red asterisk, 8px to the control, 4px to the help text            |
| Error            | Red control border, error text under the help text                           |
| Optional hint    | `(optioneel)` after the label, muted, weight 400                             |
| Disabled         | Control at 50% opacity; the help text says why it cannot be changed          |
| Form             | Three fields 20px apart, action row right-aligned with the main action last  |
| Group with error | Legend with asterisk, 4px to the options (8px apart), help, then one error   |
| Field row        | Two fields side by side with 16px between them; they stack on narrow screens |
| Form error       | Destructive Alert with title and text directly above the action row          |

Put error text on a card surface (`bg-card`): red text on the page background is below 4.5:1 (4.29:1). Muted help text passes on card and background but not on the muted, ice or secondary fills.

## Accessibility

- The label points at the control id (`useId`); groups of checkboxes or radios use `FormFieldGroup`, a `fieldset` with a legend.
- A group links its help and error from the fieldset with `aria-describedby`; the error is announced once for the whole group.
- `aria-describedby` lists the help id and, when shown, the error id; the control gets `aria-invalid="true"`.
- Errors appear under the field with `role="alert"`. Submit with `noValidate` and move focus to the first invalid field.
- Required: the `required` attribute is set on an element child, and `aria-required="true"` on the part a render function spreads the props on (a Select or DatePicker trigger, which are comboboxes: `aria-required` is not allowed on a plain button); the asterisk itself is `aria-hidden`. A required `FormFieldGroup` passes `aria-required` to a RadioGroup through its render function; a checkbox group, which has no ARIA equivalent, gets hidden `(verplicht)` text in its legend. For a required Select, also set `required` on the `<Select>` root so its hidden native select takes part in form validation.
- A form-level error (`FormError`) is a destructive Alert with `role="alert"` above the actions; field errors stay at their fields.
