# DatePicker

A field-like button that opens a Calendar in a panel, for choosing one date or a date range, optionally with one-click presets.

## When to use

- Form fields for a date near today: invoice date, due date, start date.
- A period filter above a table or chart (`mode="range"`).
- Common choices that deserve one click: presets such as "Over een week".

## When not to use

- Dates people know by heart or type faster (date of birth): use Input with `type="date"`.
- Choosing only a month or a year: use Select.
- Times of day: the date picker has no time selection.

## Install

```bash
npx shadcn@latest add Nieradj-BB/BiBi-Reusable-Components/date-picker#v0.2.0
```

Also installs the library's Calendar and Popover, and `react-day-picker`.

## Usage

In a FormField, which links the label, help and error:

```tsx
import * as React from "react"

import { DatePicker } from "@/components/ui/date-picker"
import { FormField } from "@/components/ui/form-field"

export function DueDateField({ error }: { error?: string }) {
  const [date, setDate] = React.useState<Date | undefined>()

  return (
    <FormField
      label="Vervaldatum"
      help="Uiterlijk 30 dagen na de factuurdatum."
      error={error}
      className="max-w-72"
    >
      {(control) => (
        <DatePicker
          {...control}
          value={date}
          onChange={setDate}
          calendarProps={{ disabled: { before: new Date() } }}
        />
      )}
    </FormField>
  )
}
```

A period with presets:

```tsx
import * as React from "react"
import { type DateRange } from "react-day-picker"

import { DatePicker } from "@/components/ui/date-picker"
import { Label } from "@/components/ui/label"

export function PeriodFilter() {
  const [range, setRange] = React.useState<DateRange | undefined>()
  const today = new Date()
  const inDays = (days: number) =>
    new Date(today.getFullYear(), today.getMonth(), today.getDate() + days)

  return (
    <div className="flex flex-col gap-1">
      <Label htmlFor="period" className="mb-1">
        Periode
      </Label>
      <DatePicker
        id="period"
        mode="range"
        className="max-w-72"
        value={range}
        onChange={setRange}
        presets={[
          { label: "Komende week", range: { from: today, to: inDays(6) } },
          { label: "Komende 30 dagen", range: { from: today, to: inDays(29) } },
        ]}
      />
    </div>
  )
}
```

## Props

| Prop                                    | Type                                                         | Default                                          | Notes                                                                                                                   |
| --------------------------------------- | ------------------------------------------------------------ | ------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------- |
| `mode`                                  | `"single" \| "range"`                                        | `"single"`                                       |                                                                                                                         |
| `value` / `onChange`                    | `Date \| undefined` or `DateRange \| undefined`              |                                                  | Passing `value` (even `undefined`) makes it controlled. Use `defaultValue` for uncontrolled.                            |
| `placeholder`                           | `string`                                                     | `"Kies een datum"`                               | Muted text while nothing is chosen.                                                                                     |
| `presets`                               | `{ label, date }[]` (single) or `{ label, range }[]` (range) | `[]`                                             | Buttons left of the calendar (above it on narrow screens). A preset sets the value and closes.                          |
| `format`                                | date-fns format string                                       | `"d MMMM yyyy"` (single), `"d MMM yyyy"` (range) | Trigger text, in the calendar's locale: "18 november 2026", "23 nov. 2026 – 4 dec. 2026".                               |
| `calendarProps`                         | Calendar props except `mode`, `selected`, `onSelect`         |                                                  | Disabled days, `numberOfMonths`, `captionLayout`, `today`, `locale`. Range defaults to two months without outside days. |
| `panelLabel`                            | `string`                                                     | `"Kies een datum"` / `"Kies een periode"`        | Accessible name of the panel, for example "Kies de vervaldatum".                                                        |
| `presetsLabel`                          | `string`                                                     | `"Snelkeuzes"`                                   | Accessible name of the preset group.                                                                                    |
| `open` / `defaultOpen` / `onOpenChange` | `boolean`                                                    | `false`                                          | Controlled or initial open state.                                                                                       |
| `disabled`                              | `boolean`                                                    | `false`                                          | Also disables the hidden inputs, so nothing is submitted.                                                               |
| `name`                                  | `string`                                                     |                                                  | For a plain `<form>`: hidden inputs submit the date as `yyyy-MM-dd`; a range as `name[from]` and `name[to]`.            |
| `required`                              | `boolean`                                                    | `false`                                          | Sets `aria-required` on the trigger. Hidden inputs take no part in native validation: validate the value yourself.      |
| `aria-invalid`                          | `boolean`                                                    |                                                  | Red border; FormField sets it with `error`.                                                                             |
| `id`, `className`, other button props   | button attributes                                            |                                                  | Go to the trigger. `className` is merged with `cn()`.                                                                   |

## Variants and states

The trigger matches Select: 36px high, 12px padding, 14px text, 6px radius, a 1px input border, white fill and the tile shadow, with a muted 16px calendar icon in front of the value. The panel opens 4px below, aligned to the start of the trigger: white, 1px border, 12px radius, the panel shadow and no padding around the calendar. Presets are 32px rows with a 6px radius and the grey hover fill, separated from the calendar by a border.

| State       | Look                                                                              |
| ----------- | --------------------------------------------------------------------------------- |
| Empty       | Placeholder in muted text                                                         |
| Filled      | Date in dark text, tabular numbers                                                |
| Hover, open | Strong grey border                                                                |
| Focus       | 2px cyan outline with a 2px offset on the trigger; presets get the outline inside |
| Invalid     | Red border, error text under the field                                            |
| Disabled    | 50% opacity, not-allowed cursor, does not open                                    |
| Range       | Two months side by side; start and end in cyan, the days between on the cyan tint |

Picking a day in single mode closes the panel; clicking the chosen day again keeps it. In range mode the panel stays open while the range changes; Escape or a click outside closes it.

## Accessibility

- The trigger is a `<button>` with `role="combobox"`, `aria-haspopup="dialog"`, `aria-expanded` and `aria-controls` (the combobox pattern with a dialog popup), like the Select trigger. Its name comes from its `<label>` (FormField links it), `aria-label` or `aria-labelledby`, and its text (the date or the placeholder) is read as its value: "Vervaldatum, 18 november 2026". A label is required: without one the trigger has no name and axe fails.
- Required: `required` (or `aria-required`, as a FormField render function passes it) sets `aria-required="true"` on the trigger, which the combobox role allows.
- Opening moves focus to the selected day, else today. Escape or an outside click closes the panel and returns focus to the trigger; so does picking a day or a preset. A click on another control outside the panel leaves focus on that control.
- Errors and help are linked with `aria-describedby`, and `aria-invalid` is set on the trigger, as FormField does; the red border is never the only cue.
- Presets are plain-text buttons, at least 32px high, in a group named "Snelkeuzes".
- The calendar's own keyboard and labels are described on the Calendar page.
