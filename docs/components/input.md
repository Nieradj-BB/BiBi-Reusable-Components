# Input

A single-line text field for values people type, such as names, amounts and e-mail addresses.

## When to use

- Short typed values: names, numbers, e-mail addresses, references.
- Always with a visible label (inside a FormField or next to a `Label`).

## When not to use

- Text over one line: use Textarea.
- Picking from a fixed list: use Select.
- Filtering a list: Input with `type="search"` and `leadingIcon={SearchIcon}`.

## Install

```bash
npx shadcn@latest add Nieradj-BB/BiBi-Reusable-Components/input#v0.1.0
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
```

## Props

| Prop           | Type                            | Default  | Notes                                                                 |
| -------------- | ------------------------------- | -------- | --------------------------------------------------------------------- |
| `type`         | `string`                        | `"text"` | `text`, `email`, `number`, `tel`, `url`, `password`, `date`.          |
| `leadingIcon`  | `LucideIcon`                    |          | Decorative 16px icon 12px from the left edge; the text moves to 36px. |
| `disabled`     | `boolean`                       | `false`  | 50% opacity and a not-allowed cursor.                                 |
| `aria-invalid` | `boolean`                       | `false`  | Red border. Link the error message with `aria-describedby`.           |
| `className`    | `string`                        |          | Merged with `cn()` on the `<input>`.                                  |
| ...            | `React.ComponentProps<"input">` |          | Passed to the `<input>`.                                              |

With `leadingIcon` the input is wrapped in a `relative` div (`data-slot="input-wrapper"`).

## Variants and states

36px high, 4px by 12px padding, 14px text, 6px radius, a 1px input border, white fill and the tile shadow. Placeholder text is muted.

| State        | Look                                      |
| ------------ | ----------------------------------------- |
| Default      | Light grey border                         |
| Hover        | Strong grey border                        |
| Focus        | 2px cyan outline with a 2px offset        |
| Invalid      | Red border, error message under the field |
| Disabled     | 50% opacity, not-allowed cursor           |
| Leading icon | Muted 16px icon, text starts at 36px      |

## Accessibility

- Every input has a visible label connected with `htmlFor`/`id`; a placeholder is never the only label.
- Invalid: set `aria-invalid="true"` and list the help and error ids in `aria-describedby`.
- Focus shows the 2px cyan outline with a 2px offset.
- Leading icons are decorative and `aria-hidden`.
- Show error text on a card surface: red text reaches 4.5:1 on white, not on the page background.
- The light input border is below 3:1 against white; the value is fixed (decision 3) until the brand style sheet arrives.
