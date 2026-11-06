# Badge

A small pill label that shows a status, a category, a role or a count.

## When to use

- Status in tables, lists and cards.
- Counts next to navigation items, tabs or headings.
- Category or role labels.

## When not to use

- Anything clickable: use Button.
- Long text or full sentences.

## Install

```bash
npx shadcn@latest add Nieradj-BB/BiBi-Reusable-Components/badge#v0.1.0
```

## Usage

```tsx
import { Check } from "lucide-react"

import { Badge } from "@/components/ui/badge"

export function InvoiceStatus() {
  return (
    <Badge variant="success">
      <Check aria-hidden="true" />
      Betaald
    </Badge>
  )
}

export function InvoiceCount() {
  return (
    <h2 className="text-lg">
      Facturen{" "}
      <Badge count>
        3 <span className="sr-only">nieuw</span>
      </Badge>
    </h2>
  )
}
```

## Props

| Prop        | Type                                                                             | Default       | Notes                                                        |
| ----------- | -------------------------------------------------------------------------------- | ------------- | ------------------------------------------------------------ |
| `variant`   | `"default" \| "secondary" \| "outline" \| "success" \| "destructive" \| "brand"` | `"secondary"` | Tone of the badge.                                           |
| `count`     | `boolean`                                                                        | `false`       | Tabular figures for numbers.                                 |
| `asChild`   | `boolean`                                                                        | `false`       | Render the child element (Radix Slot) with the badge styles. |
| `className` | `string`                                                                         |               | Merged with `cn()`.                                          |
| ...         | `React.ComponentProps<"span">`                                                   |               | Passed to the `<span>`.                                      |

`badgeVariants({ variant, count })` returns the classes for use on other elements.

## Variants and states

All badges: 12px medium text on a 16px line, 2px by 10px padding, a 1px border and fully rounded corners. A lucide icon placed before the text is 14px with a 4px gap.

| Variant       | Look                               | Use for                      |
| ------------- | ---------------------------------- | ---------------------------- |
| `default`     | Solid navy, white text             | The strongest label in a row |
| `secondary`   | Navy tint, navy text (the default) | Everyday status and counts   |
| `outline`     | Grey border, muted text            | Finished or secondary states |
| `success`     | Green border and icon, dark text   | Paid, done, approved         |
| `destructive` | Red text on a 40% red border       | Expired, failed, blocked     |
| `brand`       | Cyan text on ice                   | New or running items         |

Badges have no interactive states.

## Accessibility

- Pair a status colour with an icon or clear words; colour never carries the meaning alone.
- Count badges add the unit as screen-reader text (`3 <span className="sr-only">nieuw</span>`) and keep the separating spaces outside hidden elements.
- A badge is not interactive. If one must act as a control, wrap it in a real button at least 24px high with a focus ring.
- Place `destructive` badges on a card or table surface: red text reaches 4.5:1 on white but not on the page background.
- `brand` (cyan on ice) is an accepted brand-colour contrast exception. Success text stays dark because green text fails AA.
- Decorative icons get `aria-hidden="true"`.
