# Sheet

A panel on the edge of the screen that shows details or a form next to the current page.

## When to use

- Details of a list item while the list stays visible and clickable.
- Editing a record without leaving the page (`modal`).
- The mobile navigation menu (`side="left"`).

## When not to use

- Short confirmations: use AlertDialog.
- Content that needs the full width or its own URL: use a page.

## Install

```bash
npx shadcn@latest add Nieradj-BB/BiBi-Reusable-Components/sheet#v0.2.0
```

Also installs `button` from this registry (the close button).

## Usage

```tsx
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetBody,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetSection,
  SheetSectionTitle,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

export function ProjectDetails() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">Details bekijken</Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Renovatie hoofdkantoor</SheetTitle>
          <SheetDescription>
            Van Dijk Bouw · gestart op 3 maart 2026
          </SheetDescription>
        </SheetHeader>
        <SheetBody role="region" aria-label="Projectgegevens">
          <SheetSection>
            <SheetSectionTitle>Gegevens</SheetSectionTitle>
            <dl className="grid gap-5">
              <div>
                <dt className="mb-1 text-sm font-semibold text-primary">
                  Projectleider
                </dt>
                <dd className="text-sm">Sanne de Vries</dd>
              </div>
            </dl>
          </SheetSection>
        </SheetBody>
        <SheetFooter>
          <SheetClose asChild>
            <Button variant="outline">Sluiten</Button>
          </SheetClose>
          <Button>Project openen</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
```

For a form, use `<Sheet modal>` and `closeLabel="Venster sluiten"`.

## Props

Parts: `Sheet`, `SheetTrigger`, `SheetContent`, `SheetHeader`, `SheetTitle`, `SheetDescription`, `SheetBody`, `SheetSection`, `SheetSectionTitle`, `SheetFooter`, `SheetClose`, `SheetOverlay`, `SheetPortal`.

`Sheet` takes the Radix Dialog root props:

| Prop                    | Type      | Default | Notes                                                                      |
| ----------------------- | --------- | ------- | -------------------------------------------------------------------------- |
| `modal`                 | `boolean` | `false` | `true` adds the scrim and a focus trap. Use it below 1024px and for forms. |
| `open` / `onOpenChange` |           |         | Controlled state.                                                          |

`SheetContent`:

| Prop              | Type                   | Default            | Notes                                       |
| ----------------- | ---------------------- | ------------------ | ------------------------------------------- |
| `side`            | `"right" \| "left"`    | `"right"`          | Left is the narrow mobile navigation panel. |
| `showCloseButton` | `boolean`              | `true`             | Ghost icon button in the header corner.     |
| `closeLabel`      | `string`               | `"Paneel sluiten"` | Accessible name of the close button.        |
| `className`       | `string`               |                    | Merged with `cn()`.                         |
| ...               | Radix `Dialog.Content` |                    | `onEscapeKeyDown`, `onOpenAutoFocus`, ...   |

| Part                | Element   | Notes                                                                                                                            |
| ------------------- | --------- | -------------------------------------------------------------------------------------------------------------------------------- |
| `SheetHeader`       | `div`     | 24px padding, bottom border; leaves room for the close button.                                                                   |
| `SheetTitle`        | `h2`      | 24px, line height 1.25, weight 800 navy.                                                                                         |
| `SheetDescription`  | `p`       | 14px muted, 4px under the title.                                                                                                 |
| `SheetBody`         | `div`     | Scrolls on its own, 20px gaps, focusable with an inset ring; `role="region"` labelled by the title unless you pass `aria-label`. |
| `SheetSection`      | `section` | 2px top border, 20px above the content.                                                                                          |
| `SheetSectionTitle` | `h3`      | 12px bold uppercase cyan with wide tracking, 12px below.                                                                         |
| `SheetFooter`       | `div`     | Actions right-aligned, `16px 24px`, top border.                                                                                  |

## Variants and states

- Right (default): full width below 1024px, 560px from 1024px, 640px from 1536px; card white, left border, `shadow-panel`.
- Left: `min(85%, 18rem)` wide with a right border.
- Detail panel (non-modal): no scrim; the page stays usable and clicks on it do not close the panel.
- Modal: navy scrim at 40%, focus trap.
- Unavailable: when the item cannot be loaded, the header holds only the message and the close button. Keep a screen-reader title: `<SheetTitle className="sr-only">Project</SheetTitle>` and the message as `<SheetDescription className="mt-0 pt-1.5">`.

## Accessibility

- Non-modal: renders an `<aside>` labelled by its title; the panel itself receives focus when opened, Escape closes it (unless an overlay above it handled the key) and focus returns to the trigger.
- Modal: `role="dialog"` with `aria-modal="true"`, a focus trap, a scrim and focus return to the trigger. Focus moves to the first field when there is one, otherwise to the first focusable element. Pass `onOpenAutoFocus` and call `event.preventDefault()` to place it yourself.
- The scrolling `SheetBody` is focusable (`tabIndex=0`) with an inset focus ring, so keyboard users can scroll it. It is a `region` named by the sheet title, or by the `aria-label` you pass.
- In a modal sheet, focus lands on the first real field: a text field, a Select trigger or a Checkbox. The hidden native controls that Radix adds inside a `<form>` are skipped.
- The close icon button has an accessible name that names the panel (`closeLabel`).
- The cyan section titles are an accepted brand-colour contrast exception.
