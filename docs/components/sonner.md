# Toast

A short, temporary message in a corner of the screen that confirms a result or reports a failure without blocking the page. The item is a themed `Toaster` for [sonner](https://sonner.emilkowal.ski); apps call `toast()` from `sonner`.

## When to use

- Confirming a finished action in the past tense, naming the object.
- Reporting a failed action that is not about one field.
- Offering a quick undo or retry.

## When not to use

- Errors about a field value: show them at the field (FormField).
- Information that must stay visible: use Alert.
- Questions that need an answer: use AlertDialog.

## Install

```bash
npx shadcn@latest add Nieradj-BB/BiBi-Reusable-Components/sonner#v0.2.0
```

Also installs `button` from this registry (`buttonVariants` styles the action and cancel buttons) and the `sonner` package.

## Usage

Mount the `Toaster` once, near the root of the app:

```tsx
import { Toaster } from "@/components/ui/sonner"

export function App() {
  return (
    <>
      <Routes />
      <Toaster />
    </>
  )
}
```

Then call `toast` anywhere:

```tsx
import { toast } from "sonner"

toast.success("Project Renovatie hoofdkantoor is opgeslagen")

toast.info("Export gestart", {
  description: "Je krijgt een melding als het bestand klaar is.",
})

toast.warning("Contract Jansen Bouw loopt over 14 dagen af", {
  description: "Verleng het op tijd, anders stopt de facturatie.",
})

toast.success("Offerte-renovatie.pdf is verwijderd", {
  action: { label: "Ongedaan maken", onClick: () => restoreDocument() },
})

// Errors stay until they are closed.
toast.error("Factuur 2026-0142 is niet verstuurd", {
  description:
    "De server reageert niet. Je wijzigingen staan nog in het formulier.",
  duration: Infinity,
  action: { label: "Opnieuw proberen", onClick: () => sendInvoice() },
})
```

## Props

`Toaster` takes every sonner `ToasterProps`; these are the defaults it sets:

| Prop                 | Default              | Notes                                                                                        |
| -------------------- | -------------------- | -------------------------------------------------------------------------------------------- |
| `position`           | `"bottom-right"`     | `"top-right"` is the other position the guide allows.                                        |
| `expand`             | `true`               | Toasts stack 8px apart instead of collapsing; newest nearest the corner.                     |
| `closeButton`        | `true`               | 28px close button labelled "Melding sluiten".                                                |
| `gap`                | `8`                  | Pixels between toasts.                                                                       |
| `offset`             | `16`                 | Pixels from the corner (`mobileOffset` too).                                                 |
| `containerAriaLabel` | `"Meldingen"`        | Name of the toast region (sonner appends the hotkey, `alt+T`).                               |
| `theme`              | `"light"`            | Light mode only.                                                                             |
| `toastOptions`       | `unstyled` + classes | `classNames` you pass are merged with the theme's classes per part.                          |
| `icons`              | lucide icons         | Success `CircleCheck`, error `CircleAlert`, info `Info`, warning `TriangleAlert`, close `X`. |

Per toast (second argument of `toast()`): `description`, `action` / `cancel` (`{ label, onClick }`), `duration` (ms, default 4000), `closeButton`, `id`.

## Variants and states

Card surface, 1px border, 12px radius, panel shadow, 12px by 16px padding, max width 22rem, 14px text with a semibold title. Actions render as outline `sm` buttons 8px under the text.

| Variant     | Look                                                             |
| ----------- | ---------------------------------------------------------------- |
| Success     | Green check icon                                                 |
| Error       | Red border at 40%, red icon and title; pass `duration: Infinity` |
| Info        | Muted info icon                                                  |
| Warning     | Orange border and icon; title and text keep their normal colours |
| With action | Outline `sm` action button under the text                        |
| Stacked     | Newest at the bottom, 8px apart, 16px from the corner            |
| Default     | `toast()` without a type: no icon                                |

Entrance: 320ms rise of 6px with the entrance easing; off under `prefers-reduced-motion`. A `cancel` button renders as ghost `sm` on the left with the action on the right.

## Accessibility

- The toast region is a landmark named "Meldingen"; sonner announces new toasts through a polite live region.
- Errors should stay until dismissed (`duration: Infinity`); toasts pause while hovered or focused.
- Close and action buttons are real buttons with labels; the icon is `aria-hidden` and colour is never the only cue (the title says what happened).
- Each toast is focusable and shows the 2px focus ring; `alt+T` moves focus to the toasts. Inside a toast, Tab reaches the close button before the action button (sonner's DOM order). `Escape` does not close a toast; use the close button.
- Sonner does not set `role="status"` or `role="alert"` per toast: all toasts, errors included, are announced politely.
