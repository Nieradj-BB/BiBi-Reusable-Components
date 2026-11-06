# Form (react-hook-form)

Optional react-hook-form binding for FormField: label, help text and error message wired to a react-hook-form field. It follows the shadcn `Form` API and renders with the same look as [FormField](./form-field.md).

## When to use

- Forms that already use react-hook-form, usually with a zod schema through `@hookform/resolvers`.
- Forms with many fields, cross-field rules or async validation.

## When not to use

- A form with one or two fields and simple checks: use FormField with local state.
- Without react-hook-form in the app: FormField has no form-library dependency.

## Install

```bash
npx shadcn@latest add Nieradj-BB/BiBi-Reusable-Components/form-rhf#v0.1.0
```

This also installs `form-field`, `label`, `react-hook-form` and `radix-ui`. Install `zod` and `@hookform/resolvers` yourself when you validate with a schema.

## Usage

```tsx
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import { FormActions, FormStack } from "@/components/ui/form-field"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form-rhf"
import { Input } from "@/components/ui/input"

const schema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Vul een e-mailadres in.")
    .pipe(z.email("Vul een volledig e-mailadres in, zoals naam@bedrijf.nl.")),
})

export function InvoiceEmailForm() {
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: { email: "" },
  })

  return (
    <Form {...form}>
      <FormStack asChild>
        <form noValidate onSubmit={form.handleSubmit((values) => save(values))}>
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel required>E-mailadres voor facturen</FormLabel>
                <FormControl>
                  <Input type="email" required {...field} />
                </FormControl>
                <FormDescription>
                  Hier sturen we elke factuur naartoe.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormActions>
            <Button type="submit">Opslaan</Button>
          </FormActions>
        </form>
      </FormStack>
    </Form>
  )
}
```

## Props

| Part              | Based on                | Notes                                                                                          |
| ----------------- | ----------------------- | ---------------------------------------------------------------------------------------------- |
| `Form`            | `FormProvider`          | Spread the `useForm()` result on it.                                                           |
| `FormField`       | `Controller`            | `control`, `name`, `render` and the other Controller props.                                    |
| `FormItem`        | `FormFieldRoot` (`div`) | Creates the ids for one field.                                                                 |
| `FormLabel`       | `Label`                 | Takes `required` (red asterisk) and `optional` (`(optioneel)`); linked to the control.         |
| `FormControl`     | `Slot.Root`             | Sets `id`, `aria-describedby` (description and, on error, message) and `aria-invalid`.         |
| `FormDescription` | `FormFieldHelp` (`p`)   | 12px muted help text.                                                                          |
| `FormMessage`     | `FormFieldError` (`p`)  | Shows the field error (or its children) in red with `role="alert"`; renders nothing otherwise. |
| `useFormField()`  | hook                    | Returns the ids, `name` and the field state (`error`, `invalid`, `isDirty`, ...).              |

Put `required` on both `FormLabel` (the mark) and the control (the attribute).

## Variants and states

Same look as FormField: label 8px above the control, help 4px below it, error under the help, 20px between fields in a `FormStack`. The label stays navy when the field is invalid; the control border and the message turn red.

react-hook-form focuses the first invalid field on submit (`shouldFocusError`, on by default) when the control receives `field.ref`, which `{...field}` does.

## Accessibility

- The label points at the control id; `aria-describedby` only lists a description that is rendered and the message while there is an error.
- The control gets `aria-invalid="true"` while the field has an error; the message has `role="alert"`.
- Use `noValidate` on the form so the schema messages replace the browser's own bubbles.
- Groups of checkboxes: wrap them in a `fieldset` with `<Label as="legend">`.
