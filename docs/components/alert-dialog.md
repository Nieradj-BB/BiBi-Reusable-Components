# AlertDialog

A modal confirmation that states the consequence of an action and waits for an explicit choice.

## When to use

- Before removing data, changing access, sending something final or starting something that costs money.
- When the consequence needs a sentence or a short list.

## When not to use

- Forms or plain information: use Dialog.
- Single changes that are easy to undo: act directly and offer undo in a toast.

## Install

```bash
npx shadcn@latest add Nieradj-BB/BiBi-Reusable-Components/alert-dialog#v0.2.0
```

Also installs `button` from this registry (`buttonVariants` styles the actions).

## Usage

```tsx
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"

export function DeleteQuote({ onDelete }: { onDelete: () => void }) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline">Offerte verwijderen</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Offerte renovatie verwijderen?</AlertDialogTitle>
          <AlertDialogDescription>
            <p>
              Het document en de 3 opmerkingen erbij verdwijnen voor iedereen in
              het team. Dit kan niet ongedaan worden gemaakt.
            </p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel />
          <AlertDialogAction variant="destructive" onClick={onDelete}>
            Verwijderen
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
```

## Props

Parts: `AlertDialog`, `AlertDialogTrigger`, `AlertDialogContent`, `AlertDialogHeader`, `AlertDialogTitle`, `AlertDialogDescription`, `AlertDialogFooter`, `AlertDialogCancel`, `AlertDialogAction`, `AlertDialogOverlay`, `AlertDialogPortal`. Root, trigger and content take the Radix AlertDialog props.

| Part / prop                    | Type                          | Default       | Notes                                                                                     |
| ------------------------------ | ----------------------------- | ------------- | ----------------------------------------------------------------------------------------- |
| `AlertDialogAction` `variant`  | `buttonVariants` variant      | `"default"`   | `default` (cyan) for consequential actions; `destructive` only when something is removed. |
| `AlertDialogAction` `size`     | `buttonVariants` size         | `"default"`   |                                                                                           |
| `AlertDialogCancel` `variant`  | `buttonVariants` variant      | `"outline"`   |                                                                                           |
| `AlertDialogCancel` `children` | `ReactNode`                   | `"Annuleren"` | Cancel label.                                                                             |
| `AlertDialogDescription`       | `React.ComponentProps<"div">` |               | Renders a `div`, so it can hold paragraphs or a list (8px apart).                         |
| `className`                    | `string`                      |               | Merged with `cn()` on every part.                                                         |

## Variants and states

- Surface as Dialog: card white, 1px border, 12px radius, `shadow-panel`, 24px padding, 20px gaps, max width 28rem; scrim navy at 40%. No close button.
- Title 18px weight 800 navy, phrased as a question; description 14px muted.
- Destructive: red action. Default: cyan action. Consequence list: a lead sentence and a bulleted list (`list-disc pl-5 text-foreground`, 8px gaps).
- Footer: Annuleren first, the action last; stacks with the action on top below 640px.

## Accessibility

- `role="alertdialog"` labelled by the title and described by the consequence text.
- Initial focus is on Annuleren; focus stays inside and returns to the trigger on close.
- Escape cancels; a click on the scrim does nothing.
- Repeat the verb from the title in the action label, so the choice is clear without reading the description.
