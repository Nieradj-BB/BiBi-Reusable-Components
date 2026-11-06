# Skeleton

Pulsing muted placeholders in the shape of the content that is loading.

## When to use

- The first load of a list, table, card or dashboard.
- A part of the page that loads separately.

## When not to use

- Waits shorter than about 300 ms.
- Refreshing content that is already shown: keep the old content on screen.

## Install

```bash
npx shadcn@latest add Nieradj-BB/BiBi-Reusable-Components/skeleton#v0.1.0
```

## Usage

```tsx
import { Card } from "@/components/ui/card"
import { Skeleton, SkeletonGroup } from "@/components/ui/skeleton"

export function InvoicesLoading() {
  return (
    <SkeletonGroup label="Facturen laden…">
      <Card>
        <div className="flex flex-col gap-2 p-5">
          {Array.from({ length: 4 }, (_, i) => (
            <Skeleton key={i} shape="row" />
          ))}
        </div>
      </Card>
    </SkeletonGroup>
  )
}
```

## Props

### Skeleton

| Prop        | Type                                                        | Default  | Notes                                  |
| ----------- | ----------------------------------------------------------- | -------- | -------------------------------------- |
| `shape`     | `"text" \| "sm" \| "title" \| "value" \| "row" \| "circle"` | `"text"` | Height and corners; see below.         |
| `width`     | `"full" \| "90" \| "80" \| "75" \| "60" \| "40" \| "25"`    | full     | Percentage of the container width.     |
| `className` | `string`                                                    |          | Merged with `cn()`, for one-off sizes. |

Every skeleton renders `aria-hidden="true"`. `skeletonVariants({ shape, width })` returns the classes.

### SkeletonGroup

| Prop        | Type     | Default  | Notes                                                             |
| ----------- | -------- | -------- | ----------------------------------------------------------------- |
| `label`     | `string` | required | Loading text in a visually hidden `role="status"` element.        |
| `className` | `string` |          | Layout of the area (stack, grid). The status text takes no space. |

## Variants and states

| Shape    | Size                    | Use for                              |
| -------- | ----------------------- | ------------------------------------ |
| `text`   | 16px high, 6px corners  | Body text lines                      |
| `sm`     | 14px high               | Small lines, labels, footnotes       |
| `title`  | 20px high               | Titles                               |
| `value`  | 36px high               | KPI values                           |
| `row`    | 48px high, 12px corners | List and table rows (3 to 5 of them) |
| `circle` | 40px circle             | Avatars                              |

Stack lines 8px apart (`gap-2`) and make the last lines shorter (`width="90"`, `"80"`). The fill is `muted` and pulses (2s, down to 50% opacity). Place skeletons on a card or table surface: on the page background the muted fill is barely visible. Match the final layout so nothing shifts when the content arrives.

## Accessibility

- The shapes are hidden from assistive technology; one `SkeletonGroup` per loading area announces its `label` (for example "Facturen laden…") through `role="status"`.
- No pulse under `prefers-reduced-motion: reduce` (`motion-safe:animate-pulse`).
