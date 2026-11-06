# Select

Picks one value from a known list in a dropdown that opens below the field.

## When to use

- Choosing one value from about 5 or more known options in a form or filter bar.

## When not to use

- 2 to 4 options that should stay visible: a radio group (not in the library yet: ask for it in the library repo).
- Long lists people need to search in.
- Actions: use a button or menu.

## Install

```bash
npx shadcn@latest add Nieradj-BB/BiBi-Reusable-Components/select#v0.1.0
```

## Usage

```tsx
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export function InvoiceStatus({
  value,
  onValueChange,
}: {
  value: string
  onValueChange: (value: string) => void
}) {
  return (
    <div className="flex flex-col gap-1">
      <Label htmlFor="invoice-status" className="mb-1">
        Status
      </Label>
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger id="invoice-status">
          <SelectValue placeholder="Kies een status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="concept">Concept</SelectItem>
          <SelectItem value="sent">Verzonden</SelectItem>
          <SelectItem value="paid">Betaald</SelectItem>
          <SelectItem value="expired">Vervallen</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}
```

## Props

The parts follow shadcn/ui and Radix Select: `Select`, `SelectTrigger`, `SelectValue`, `SelectContent`, `SelectItem`, `SelectGroup`, `SelectLabel`, `SelectSeparator`, `SelectScrollUpButton`, `SelectScrollDownButton`.

| Part / prop                     | Type                         | Default     | Notes                                                                 |
| ------------------------------- | ---------------------------- | ----------- | --------------------------------------------------------------------- |
| `Select` `value`                | `string`                     |             | Controlled value. Use `defaultValue` for uncontrolled.                |
| `Select` `onValueChange`        | `(value: string) => void`    |             |                                                                       |
| `Select` `disabled`             | `boolean`                    | `false`     | Disables the trigger.                                                 |
| `Select` `open` / `defaultOpen` | `boolean`                    |             | Controlled or initial open state, with `onOpenChange`.                |
| `SelectTrigger` `size`          | `"default" \| "sm"`          | `"default"` | 36px or 32px high.                                                    |
| `SelectTrigger` `aria-invalid`  | `boolean`                    | `false`     | Red border. Link the error with `aria-describedby`.                   |
| `SelectValue` `placeholder`     | `ReactNode`                  |             | Shown in muted text until a value is chosen.                          |
| `SelectContent` `position`      | `"popper" \| "item-aligned"` | `"popper"`  | `popper` opens the list 6px below the trigger at the trigger's width. |
| `SelectContent` `sideOffset`    | `number`                     | `6`         |                                                                       |
| `SelectItem` `value`            | `string`                     |             | Required; `disabled` greys the item out.                              |
| `className`                     | `string`                     |             | Merged with `cn()` on every part.                                     |

## Variants and states

The trigger matches Input: 36px high, 12px padding, 14px text, 6px radius, a 1px input border, white fill and the tile shadow, with a muted 16px chevron on the right. The list is a white panel 6px below the trigger: 4px padding, a 1px border, 12px radius and the panel shadow. Items are 32px rows with a 6px radius, 32px left padding and 8px right padding.

| State       | Look                                                                                                   |
| ----------- | ------------------------------------------------------------------------------------------------------ |
| Closed      | Value in dark text                                                                                     |
| Placeholder | Placeholder in muted text                                                                              |
| Hover       | Strong grey trigger border                                                                             |
| Open        | Chevron turned 180°; selected item marked with a cyan check; highlighted item gets the grey hover fill |
| Focus       | 2px cyan outline with a 2px offset on the trigger (and on items reached by keyboard)                   |
| Invalid     | Red trigger border, error message under the field                                                      |
| Disabled    | 50% opacity, not-allowed cursor                                                                        |

## Accessibility

- Built on Radix Select: the trigger is `role="combobox"` with `aria-expanded`; options are `role="option"` with `aria-selected`.
- Arrow keys move the highlight, Enter or Space selects, Escape closes and returns focus to the trigger, typing jumps to a matching option.
- The selected option shows a check icon, not colour alone.
- Invalid: `aria-invalid="true"` on the trigger and the error linked with `aria-describedby`.
- Label the trigger with `<Label htmlFor>` pointing at the `SelectTrigger` id.
- While the list is open the rest of the page is hidden from assistive technology; the trigger then leaves the tab order (`tabIndex={-1}`) and gets focus back when the list closes.
