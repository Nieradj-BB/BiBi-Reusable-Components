# Dialog

A modal window for a short task or form that needs full attention before the user returns to the page.

## When to use

- Short forms that belong to the current page (add, edit, send).
- A few explanation screens with Previous and Next (`layout="steps"`).
- Work that must be finished or cancelled before continuing.

## When not to use

- Confirming a consequential action: use AlertDialog.
- Showing details next to a list: use Sheet.
- Long forms or content that needs its own URL: use a page.

## Install

```bash
npx shadcn@latest add Nieradj-BB/BiBi-Reusable-Components/dialog#v0.1.0
```

Also installs `button` from this registry (the close button).

## Usage

```tsx
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogBody,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function AddProjectDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Project toevoegen</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Project toevoegen</DialogTitle>
          <DialogDescription>
            Het project verschijnt direct in het overzicht van je team.
          </DialogDescription>
        </DialogHeader>
        <DialogBody>
          <div className="flex flex-col gap-1">
            <Label htmlFor="project-name" className="mb-1">
              Projectnaam
            </Label>
            <Input id="project-name" />
          </div>
        </DialogBody>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Annuleren</Button>
          </DialogClose>
          <Button type="submit">Opslaan</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
```

Steps layout:

```tsx
<DialogContent size="xl" layout="steps" closeLabel="Uitleg sluiten">
  <DialogHeader>
    <DialogStep>2 van 4</DialogStep>
    <DialogTitle>Documenten koppelen</DialogTitle>
  </DialogHeader>
  <DialogBody role="region" aria-label="Uitleg, stap 2">
    <DialogDescription
      asChild
      className="flex list-disc flex-col gap-2 pl-5 text-foreground"
    >
      <ul>
        <li>…</li>
      </ul>
    </DialogDescription>
  </DialogBody>
  <DialogFooter>
    <DialogClose asChild>
      <Button variant="ghost">Overslaan</Button>
    </DialogClose>
    <div className="ml-auto flex gap-2">
      <Button variant="outline">Vorige</Button>
      <Button>Volgende</Button>
    </div>
  </DialogFooter>
</DialogContent>
```

## Props

Parts: `Dialog`, `DialogTrigger`, `DialogContent`, `DialogHeader`, `DialogStep`, `DialogTitle`, `DialogDescription`, `DialogBody`, `DialogError`, `DialogFooter`, `DialogHint`, `DialogClose`, `DialogOverlay`, `DialogPortal`. `Dialog`, `DialogTrigger`, `DialogClose`, `DialogTitle` and `DialogDescription` take the Radix Dialog props (`open`, `defaultOpen`, `onOpenChange`, `asChild`, ...).

`DialogContent`:

| Prop                  | Type                   | Default             | Notes                                                                     |
| --------------------- | ---------------------- | ------------------- | ------------------------------------------------------------------------- |
| `size`                | `"md" \| "lg" \| "xl"` | `"lg"`              | Max width 28rem, 32rem or 42rem.                                          |
| `layout`              | `"default" \| "steps"` | `"default"`         | `steps`: fixed height, only `DialogBody` scrolls, footer bar with border. |
| `showCloseButton`     | `boolean`              | `true`              | The ghost icon button in the top-right corner.                            |
| `closeLabel`          | `string`               | `"Venster sluiten"` | Accessible name of the close button.                                      |
| `closeOnOutsideClick` | `boolean`              | `false`             | A click on the scrim closes the dialog only when `true`.                  |
| `className`           | `string`               |                     | Merged with `cn()`.                                                       |
| ...                   | Radix `Dialog.Content` |                     | `onEscapeKeyDown`, `onOpenAutoFocus`, ...                                 |

Other parts:

| Part           | Element | Notes                                                                                                                                                                                 |
| -------------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `DialogStep`   | `p`     | Step counter above the title (12px semibold muted).                                                                                                                                   |
| `DialogBody`   | `div`   | Fields with 20px gaps; in `steps` the scrolling middle: focusable (`tabIndex=0`), `role="region"`, labelled by the title unless you pass `aria-label` (for example "Uitleg, stap 2"). |
| `DialogError`  | `p`     | Save error inside the dialog, `role="alert"`, destructive text.                                                                                                                       |
| `DialogFooter` | `div`   | Actions right-aligned; stacks with the primary action on top below 640px.                                                                                                             |
| `DialogHint`   | `p`     | Muted shortcut hint on the left of the footer, hidden below 640px; `aria-hidden` by default (put the shortcut on the button as `aria-keyshortcuts`).                                  |

## Variants and states

- Surface: card white, 1px border, 12px radius, `shadow-panel`, 24px padding, 20px gaps; scrim navy at 40%.
- Title 18px (line height 1.375), weight 800 navy; description 14px muted.
- Max height is `100dvh - 2rem`; the content scrolls when it does not fit.
- `steps`: 22rem high, header `24px 24px 16px` with a 4px gap, middle scrolls with an inset focus ring, footer bar `16px 24px` with a top border.
- Validation error: errors at the field (`aria-invalid` plus a linked message); a failed save shows `DialogError` and keeps the input.
- Submitting: the submit label gets an ellipsis (`Versturen…`) and stays enabled; block closing in `onOpenChange` until it finishes.
- Order buttons secondary first, primary last.

## Accessibility

- `role="dialog"` labelled by `DialogTitle` and described by `DialogDescription`; focus moves to the first field and returns to the trigger on close; focus stays inside.
- Escape and the close button close it; a click on the scrim does not (unless `closeOnOutsideClick`).
- The icon-only close button has an accessible name (`closeLabel`).
- In `steps`, the scrolling `DialogBody` is focusable so keyboard users can scroll it; it is a `region` named by the dialog title, or by the `aria-label` you pass.
- A keyboard shortcut for the primary action goes on the button as `aria-keyshortcuts`; `DialogHint` renders with `aria-hidden="true"` so the shortcut is not read twice.
