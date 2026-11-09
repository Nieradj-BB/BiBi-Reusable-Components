# Textarea

A multi-line text field for notes, descriptions and comments, optionally with a character counter.

## When to use

- Free text that can run over one line: notes, descriptions, comments.
- Add `limit` when there is a length limit; the counter appears under the field.

## When not to use

- Short single values: use Input.
- Formatted (rich) text.

## Install

```bash
npx shadcn@latest add Nieradj-BB/BiBi-Reusable-Components/textarea#v0.2.0
```

## Usage

```tsx
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

export function InvoiceNote() {
  return (
    <div className="flex flex-col gap-1">
      <Label htmlFor="invoice-note" className="mb-1">
        Toelichting op de factuur
      </Label>
      <Textarea id="invoice-note" limit={500} help="Hooguit 500 tekens." />
    </div>
  )
}
```

## Props

| Prop             | Type                               | Default                | Notes                                                                                                                                                                                                                            |
| ---------------- | ---------------------------------- | ---------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `rows`           | `number`                           | `3`                    | Starting height; never below 80px. People can resize it vertically.                                                                                                                                                              |
| `limit`          | `number`                           |                        | Shows the `count / limit` counter. Text is never cut off; over the limit the counter turns red and `aria-invalid` is set unless you pass it.                                                                                     |
| `help`           | `ReactNode`                        |                        | Help text left of the counter, linked with `aria-describedby`.                                                                                                                                                                   |
| `remainingLabel` | `(remaining: number) => string`    | Dutch (`Nog 8 tekens`) | Text announced in a polite live region once the limit is near (10% or 10 characters left).                                                                                                                                       |
| `dir`            | `string`                           | `"auto"`               | Follows the direction of what people type.                                                                                                                                                                                       |
| `disabled`       | `boolean`                          | `false`                | 50% opacity and a not-allowed cursor.                                                                                                                                                                                            |
| `aria-invalid`   | `boolean`                          | `false`                | Red border. Add the error id to `aria-describedby`.                                                                                                                                                                              |
| `className`      | `string`                           |                        | Merged with `cn()` on the `<textarea>`.                                                                                                                                                                                          |
| ...              | `React.ComponentProps<"textarea">` |                        | Passed to the `<textarea>`. Works controlled (`value`) and uncontrolled (`defaultValue`, or a `ref` such as react-hook-form `register`); uncontrolled, the counter also follows values written through the ref and a form reset. |

With `limit` or `help` the textarea is wrapped in a column (`data-slot="textarea-field"`) with the footer row under it.

## Variants and states

At least 80px high, 8px by 12px padding, 14px text, 6px radius, a 1px input border, white fill and the tile shadow; resizes vertically only.

| State           | Look                                                          |
| --------------- | ------------------------------------------------------------- |
| Default         | Light grey border                                             |
| Hover           | Strong grey border                                            |
| Focus           | 2px cyan outline with a 2px offset; placeholder in muted text |
| Character count | Help text left (12px muted), counter right in tabular figures |
| Invalid         | Red border; the counter turns red when over the limit         |
| Disabled        | 50% opacity, not-allowed cursor                               |

## Accessibility

- Visible label connected with `htmlFor`/`id`; help text is linked with `aria-describedby`.
- Invalid: `aria-invalid="true"` and the error id added to `aria-describedby`.
- The visible counter is `aria-hidden`; the remaining characters are announced in a polite live region only when the limit is near.
- No `maxLength`: pasted text is never cut off silently. `dir="auto"` for user text.
- Show error text on a card surface: red text reaches 4.5:1 on white, not on the page background.
