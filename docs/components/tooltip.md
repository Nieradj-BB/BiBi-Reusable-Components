# Tooltip

A short text label that appears next to an icon button on hover and on keyboard focus.

## When to use

- Naming icon-only buttons in toolbars and table rows.
- Showing a keyboard shortcut for an action.

## When not to use

- Essential information or why a control is disabled: show visible text.
- Interactive content: use Popover.
- Native `title` attributes: invisible to keyboard and touch users.

## Install

```bash
npx shadcn@latest add Nieradj-BB/BiBi-Reusable-Components/tooltip#v0.2.0
```

## Usage

Mount `TooltipProvider` once near the root of the app.

```tsx
import { PencilIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipShortcut,
  TooltipTrigger,
} from "@/components/ui/tooltip"

export function App({ children }: { children: React.ReactNode }) {
  return <TooltipProvider>{children}</TooltipProvider>
}

export function EditButton() {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Bewerken">
          <PencilIcon aria-hidden="true" />
        </Button>
      </TooltipTrigger>
      <TooltipContent>Bewerken</TooltipContent>
    </Tooltip>
  )
}

// With a shortcut:
// <TooltipContent>Kopiëren <TooltipShortcut>Ctrl+C</TooltipShortcut></TooltipContent>
```

## Props

Parts: `TooltipProvider`, `Tooltip`, `TooltipTrigger`, `TooltipContent`, `TooltipShortcut`. All take the Radix Tooltip props.

| Part / prop                       | Type                                     | Default    | Notes                                   |
| --------------------------------- | ---------------------------------------- | ---------- | --------------------------------------- |
| `TooltipProvider` `delayDuration` | `number`                                 | `0`        | Delay before opening, in ms.            |
| `TooltipContent` `side`           | `"top" \| "bottom" \| "left" \| "right"` | `"top"`    | Flips when there is no room.            |
| `TooltipContent` `align`          | `"start" \| "center" \| "end"`           | `"center"` |                                         |
| `TooltipContent` `sideOffset`     | `number`                                 | `6`        | Gap to the trigger in px.               |
| `TooltipContent` `className`      | `string`                                 |            | Merged with `cn()`.                     |
| `TooltipShortcut`                 | `React.ComponentProps<"span">`           |            | Shortcut after the label in muted text. |

## Variants and states

- Surface: card white, 1px border, 6px radius, `shadow-panel`, `6px 10px` padding, max width 16rem, 12px medium text on a 16px line, centred. No arrow.
- Top (default) and bottom; left and right are available for tight layouts.
- Shown on hover and on keyboard focus.

## Accessibility

- Shows on hover and on keyboard focus, hides on Escape and blur, and stays while the pointer moves onto it (WCAG 1.4.13).
- The icon button keeps its own `aria-label`; the tooltip never holds the only name. While open the tooltip describes the trigger (`aria-describedby`), which is useful for a shortcut; also set `aria-keyshortcuts` on the button.
- Do not use tooltips on disabled buttons, which get no focus or pointer events; show the reason as text instead.
