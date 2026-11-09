# Calendar

A month grid for picking one date or a date range, with today marked by a cyan ring and the selection in a cyan fill. Built on react-day-picker (the shadcn Calendar), in Dutch with weeks starting on Monday.

## When to use

- Inside DatePicker (the usual case).
- Inline on a page where the dates themselves matter, such as planning or availability.
- Choosing a range of days: a period, leave, a project phase.

## When not to use

- Dates people know by heart (date of birth): use Input with `type="date"`, or `captionLayout="dropdown"`.
- Choosing only a month or a year: use Select.
- Showing events or appointments: a calendar view is a different component.

## Install

```bash
npx shadcn@latest add Nieradj-BB/BiBi-Reusable-Components/calendar#v0.2.0
```

Also installs `react-day-picker` and the library's Button. Do not import `react-day-picker/style.css`: the component is styled with the theme tokens.

## Usage

```tsx
import * as React from "react"

import { Calendar } from "@/components/ui/calendar"

export function DeliveryDay() {
  const [date, setDate] = React.useState<Date | undefined>()

  return (
    <Calendar
      mode="single"
      selected={date}
      onSelect={setDate}
      disabled={[{ before: new Date() }, { dayOfWeek: [0, 6] }]}
      className="rounded-xl border border-border"
    />
  )
}
```

Range over two months:

```tsx
import * as React from "react"
import { type DateRange } from "react-day-picker"

import { Calendar } from "@/components/ui/calendar"

export function ProjectPhase() {
  const [range, setRange] = React.useState<DateRange | undefined>()

  return (
    <Calendar
      mode="range"
      selected={range}
      onSelect={setRange}
      numberOfMonths={2}
      showOutsideDays={false}
      className="rounded-xl border border-border"
    />
  )
}
```

## Props

`Calendar` takes every react-day-picker `DayPicker` prop. The ones you will use most:

| Prop                      | Type                                                                           | Default     | Notes                                                                        |
| ------------------------- | ------------------------------------------------------------------------------ | ----------- | ---------------------------------------------------------------------------- |
| `mode`                    | `"single" \| "range" \| "multiple"`                                            |             | Without a mode the days are not buttons.                                     |
| `selected` / `onSelect`   | `Date \| DateRange \| Date[]`                                                  |             | Matches the mode.                                                            |
| `disabled`                | Matcher: dates, ranges, `{ before }`, `{ after }`, `{ dayOfWeek }`, a function |             | Disabled days are struck through and skipped by the keyboard.                |
| `numberOfMonths`          | `number`                                                                       | `1`         | Months sit side by side and wrap on narrow screens.                          |
| `captionLayout`           | `"label" \| "dropdown" \| "dropdown-months" \| "dropdown-years"`               | `"label"`   | `dropdown` shows month and year selects; set `startMonth` and `endMonth`.    |
| `showOutsideDays`         | `boolean`                                                                      | `true`      | Set `false` with `numberOfMonths` above 1 so no date shows twice.            |
| `defaultMonth` / `month`  | `Date`                                                                         | today       | The month shown first, or the controlled month with `onMonthChange`.         |
| `today`                   | `Date`                                                                         | now         | The day with the ring.                                                       |
| `locale`                  | react-day-picker locale                                                        | `nl`        | Import others from `react-day-picker/locale`. Weeks start on Monday in `nl`. |
| `weekStartsOn`            | `0`-`6`                                                                        | from locale |                                                                              |
| `navLayout`               | `"around"`                                                                     | `"around"`  | Previous button on the first month, next button on the last.                 |
| `className`, `classNames` | `string`, react-day-picker class map                                           |             | Merged over the defaults. Add `rounded-xl border border-border` for a frame. |

Also exported: `CalendarDayButton`, the day button, for custom `components`.

## Variants and states

The calendar is a white block with 12px padding and 14px text. Each month has a 32px header row: a 32px ghost icon button for the previous month, the month name in semibold navy centred, and a 32px ghost icon button for the next month. Weekday names are 12px muted text. Day buttons are 36px squares with a 6px radius and tabular numbers.

| State                 | Look                                                                                          |
| --------------------- | --------------------------------------------------------------------------------------------- |
| Day                   | Dark text, transparent fill                                                                   |
| Outside day           | Muted text                                                                                    |
| Hover                 | Grey hover fill                                                                               |
| Today                 | 1px cyan ring and semibold number                                                             |
| Selected (single)     | Cyan fill, white semibold number; 90% cyan on hover                                           |
| Range start and end   | Cyan fill; the cells are on the cyan tint, rounded on the outer side                          |
| Range middle          | Cyan tint behind the cell, dark text                                                          |
| Disabled              | 50% opacity, muted and struck through, not-allowed cursor                                     |
| Focus                 | 2px cyan outline with a 2px offset                                                            |
| Month and year select | 32px selects with the field border, semibold text and a muted chevron; strong border on hover |

## Accessibility

- The month grid is a `role="grid"` table named by the month ("november 2026"); the month name is a polite live region, so changes are announced. Weekday headers carry the full day name.
- One day is in the tab order: the selected day, else today. Arrow keys move by day and week, Page Up and Page Down by month (with Shift by year), Home and End to the start or end of the week, Enter or Space selects.
- Each day button has a full label, such as "woensdag 18 november 2026, geselecteerd" or "maandag 9 november 2026, vandaag". Selection and today are shown by fill, ring and weight, not colour alone.
- Disabled days use the `disabled` attribute and the keyboard skips them. The previous and next month buttons are named "Vorige maand" and "Volgende maand" and are 32px.
- With a locale other than `nl` the labels come from that locale.
