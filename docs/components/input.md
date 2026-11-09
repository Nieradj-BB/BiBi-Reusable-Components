# Input

A single-line text field for values people type, such as names, amounts and e-mail addresses.

## When to use

- Short typed values: names, numbers, e-mail addresses, references.
- Always with a visible label (inside a FormField or next to a `Label`).

## When not to use

- Text over one line: use Textarea.
- Picking from a fixed list: use Select or RadioGroup.
- A date range or date presets: use DatePicker. A single date can use the native `type="date"`.
- Filtering a list: Input with `type="search"` and `leadingIcon={SearchIcon}`.

## Install

```bash
npx shadcn@latest add Nieradj-BB/BiBi-Reusable-Components/input#v0.2.0
```

## Usage

```tsx
import { Mail } from "lucide-react"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function ContactEmail() {
  return (
    <div className="flex flex-col gap-1">
      <Label htmlFor="contact-email" className="mb-1">
        E-mailadres
      </Label>
      <Input
        id="contact-email"
        type="email"
        placeholder="naam@bedrijf.nl"
        leadingIcon={Mail}
      />
    </div>
  )
}

export function Hours({ error }: { error?: string }) {
  return (
    <div className="flex flex-col gap-1">
      <Label htmlFor="hours" className="mb-1">
        Aantal uren
      </Label>
      <Input
        id="hours"
        inputMode="numeric"
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? "hours-error" : undefined}
      />
      {error && (
        <p id="hours-error" role="alert" className="text-sm text-destructive">
          {error}
        </p>
      )}
    </div>
  )
}

export function Amount() {
  return (
    <div className="flex flex-col gap-1">
      <Label htmlFor="amount" className="mb-1">
        Bedrag excl. btw
      </Label>
      <Input id="amount" inputMode="decimal" prefix="€" />
    </div>
  )
}

export function InvoiceNumber() {
  return (
    <div className="flex flex-col gap-1">
      <Label htmlFor="invoice-number" className="mb-1">
        Factuurnummer
      </Label>
      <Input
        id="invoice-number"
        defaultValue="2026-044"
        readOnly
        aria-describedby="invoice-number-help"
      />
      <p id="invoice-number-help" className="text-xs text-muted-foreground">
        Wordt toegekend bij het versturen.
      </p>
    </div>
  )
}
```

## Props

| Prop           | Type                            | Default  | Notes                                                                     |
| -------------- | ------------------------------- | -------- | ------------------------------------------------------------------------- |
| `type`         | `string`                        | `"text"` | `text`, `email`, `number`, `tel`, `url`, `password`, `date`.              |
| `leadingIcon`  | `LucideIcon`                    |          | Decorative 16px icon 12px from the left edge; the text moves to 36px.     |
| `prefix`       | `ReactNode`                     |          | Short unit text such as `€`, 12px from the left edge; text moves to 28px. |
| `suffix`       | `ReactNode`                     |          | Short unit text such as `uur` or `%`, 12px from the right edge.           |
| `readOnly`     | `boolean`                       | `false`  | Muted fill, no shadow; stays focusable and the value can be copied.       |
| `disabled`     | `boolean`                       | `false`  | 50% opacity and a not-allowed cursor.                                     |
| `aria-invalid` | `boolean`                       | `false`  | Red border. Link the error message with `aria-describedby`.               |
| `className`    | `string`                        |          | Merged with `cn()` on the `<input>`.                                      |
| ...            | `React.ComponentProps<"input">` |          | Passed to the `<input>`.                                                  |

With `leadingIcon`, `prefix` or `suffix` the input is wrapped in a `relative` div (`data-slot="input-wrapper"`). Use one of `leadingIcon` and `prefix`, not both. The prefix and suffix get ids derived from the input id and are added to `aria-describedby` before any ids you pass, so the unit is read out. Fields with a prefix or suffix, and `type="date"` fields, use tabular figures (`tabular-nums`).

## Variants and states

36px high, 4px by 12px padding, 14px text, 6px radius, a 1px input border, white fill and the tile shadow. Placeholder text is muted.

| State        | Look                                                                                                         |
| ------------ | ------------------------------------------------------------------------------------------------------------ |
| Default      | Light grey border                                                                                            |
| Hover        | Strong grey border                                                                                           |
| Focus        | 2px cyan outline with a 2px offset                                                                           |
| Invalid      | Red border, error message under the field                                                                    |
| Disabled     | 50% opacity, not-allowed cursor                                                                              |
| Leading icon | Muted 16px icon, text starts at 36px                                                                         |
| Prefix       | Muted 14px unit, text starts at 28px                                                                         |
| Suffix       | Muted 14px unit, 44px right padding                                                                          |
| Read-only    | Muted fill, no shadow, no hover border; prefix and suffix in dark text (muted text is too light on the fill) |
| Date         | Native date field with the same style                                                                        |

## Accessibility

- Every input has a visible label connected with `htmlFor`/`id`; a placeholder is never the only label.
- Invalid: set `aria-invalid="true"` and list the help and error ids in `aria-describedby`.
- Focus shows the 2px cyan outline with a 2px offset.
- Leading icons are decorative and `aria-hidden`.
- Prefix and suffix text is visible and linked with `aria-describedby`, so the unit is read out.
- Read-only fields stay in the tab order and their value can be selected and copied; unlike disabled fields they are submitted with the form.
- Show error text on a card surface: red text reaches 4.5:1 on white, not on the page background.
- The light input border is below 3:1 against white; the value is fixed (decision 3) until the brand style sheet arrives.
