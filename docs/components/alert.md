# Alert

An inline notice with an icon and text, in four variants: info, success, warning and destructive. It stays on the page until the situation it describes changes.

## When to use

- A notice about the state of a page or setting that needs attention.
- A result that stays relevant after an action, such as a bulk action that finished.
- A form-level error above the form actions (destructive).

## When not to use

- Short feedback after an action: use a Toast (`sonner`).
- Errors about one field: use the field error of FormField.
- Background explanation: use a Tooltip or Popover.

## Install

```bash
npx shadcn@latest add Nieradj-BB/BiBi-Reusable-Components/alert#v0.2.0
```

Also installs the `class-variance-authority` package.

## Usage

```tsx
import { InfoIcon, TriangleAlertIcon } from "lucide-react"

import {
  Alert,
  AlertAction,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"
import { Button } from "@/components/ui/button"

export function VatNotice() {
  return (
    <Alert>
      <InfoIcon aria-hidden="true" />
      <AlertDescription>
        Bedragen zijn exclusief btw. Concepten tellen niet mee in de totalen.
      </AlertDescription>
    </Alert>
  )
}

export function ContractExpiring() {
  return (
    <Alert variant="warning">
      <TriangleAlertIcon aria-hidden="true" />
      <AlertTitle>Contract loopt bijna af</AlertTitle>
      <AlertDescription>
        Het contract met Jansen Bouw loopt af op 18 november 2026. Verleng het,
        of zet de facturatie stop.
      </AlertDescription>
      <AlertAction>
        <Button variant="outline" size="sm">
          Contract verlengen
        </Button>
        <Button variant="ghost" size="sm">
          Later
        </Button>
      </AlertAction>
    </Alert>
  )
}
```

Put the lucide icon first, as a direct child of `Alert`: the alert sizes it to 16px, colours it for the variant and lines the text up next to it. Without an icon the text starts at the padding.

| Variant       | Icon                |
| ------------- | ------------------- |
| `info`        | `InfoIcon`          |
| `success`     | `CircleCheckIcon`   |
| `warning`     | `TriangleAlertIcon` |
| `destructive` | `CircleAlertIcon`   |

## Props

### Alert

| Prop        | Type                                                | Default            | Notes                                                                       |
| ----------- | --------------------------------------------------- | ------------------ | --------------------------------------------------------------------------- |
| `variant`   | `"info" \| "success" \| "warning" \| "destructive"` | `"info"`           | Tone of the alert.                                                          |
| `size`      | `"default" \| "compact"`                            | `"default"`        | `compact` for dense areas: 8px by 12px padding, 8px icon gap.               |
| `role`      | `React.AriaRole`                                    | set by the variant | `note` for info, `status` for success and warning, `alert` for destructive. |
| `className` | `string`                                            |                    | Merged with `cn()`.                                                         |
| ...         | `React.ComponentProps<"div">`                       |                    | Passed to the `<div>`.                                                      |

### AlertTitle, AlertDescription, AlertAction

Each takes `React.ComponentProps<"div">` and `className`.

- `AlertTitle`: semibold line above the text.
- `AlertDescription`: the text. Several `<p>` elements inside get 4px between them.
- `AlertAction`: a wrapping row of `sm` Buttons, 8px apart, 12px under the text.

`alertVariants({ variant, size })` returns the classes for use on other elements.

## Variants and states

All alerts: 14px text on a 20px line, 12px by 16px padding, a 1px border, 6px radius, a 12px gap between icon and text, 4px between title and text, and 12px above the actions. The text keeps the foreground colour except in `destructive`.

| Variant       | Look                                                | Use for                             |
| ------------- | --------------------------------------------------- | ----------------------------------- |
| `info`        | Muted fill, grey border, muted icon (the default)   | Notes and background facts          |
| `success`     | Green border and icon, no fill                      | A result that stays relevant        |
| `warning`     | Orange border and icon, no fill                     | Something that needs attention soon |
| `destructive` | Red text and icon on a 40% red border, card surface | Something failed and needs action   |

| Size      | Look                           |
| --------- | ------------------------------ |
| `default` | 12px by 16px padding, 12px gap |
| `compact` | 8px by 12px padding, 8px gap   |

Alerts have no interactive states of their own; buttons inside them have the normal Button states.

## Accessibility

- The role follows the variant: `alert` (assertive) only for `destructive`, `status` for `warning` and `success`, `note` for `info`. Pass `role` to override, for example `role="alert"` for a warning that must interrupt.
- The icon is `aria-hidden`; the text itself says what is wrong and what to do, so colour is never the only signal.
- Actions are real buttons. Place the alert next to what it is about, in reading order.
- Red text reaches 4.5:1 on the card surface the alert brings; keep custom backgrounds white.
