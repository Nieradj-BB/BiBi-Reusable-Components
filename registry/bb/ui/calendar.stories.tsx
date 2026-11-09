import * as React from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"
import { type DateRange } from "react-day-picker"
import { expect, waitFor } from "storybook/test"

import { Calendar } from "@/components/ui/calendar"

const today = new Date(2026, 10, 9)
const bordered = "rounded-xl border border-border"

const meta = {
  title: "Components/Inputs & forms/Calendar",
  component: Calendar,
} satisfies Meta<typeof Calendar>

export default meta

type Story = StoryObj<typeof meta>

function SingleCalendar({
  initial,
  ...props
}: Omit<
  React.ComponentProps<typeof Calendar>,
  "mode" | "selected" | "onSelect"
> & { initial?: Date }) {
  const [date, setDate] = React.useState<Date | undefined>(initial)

  return (
    <Calendar
      className={bordered}
      today={today}
      defaultMonth={initial ?? today}
      {...props}
      mode="single"
      selected={date}
      onSelect={setDate}
    />
  )
}

function RangeCalendar({
  initial,
  ...props
}: Omit<
  React.ComponentProps<typeof Calendar>,
  "mode" | "selected" | "onSelect"
> & { initial: DateRange }) {
  const [range, setRange] = React.useState<DateRange | undefined>(initial)

  return (
    <Calendar
      className={bordered}
      today={today}
      defaultMonth={initial.from}
      {...props}
      mode="range"
      selected={range}
      onSelect={setRange}
    />
  )
}

export const Single: Story = {
  render: () => <SingleCalendar initial={new Date(2026, 10, 18)} />,
  play: async ({ canvas, userEvent }) => {
    await expect(
      canvas.getByRole("grid", { name: "november 2026" })
    ).toBeInTheDocument()
    const selected = canvas.getByRole("button", {
      name: "woensdag 18 november 2026, geselecteerd",
    })
    await expect(selected).toHaveAttribute("tabindex", "0")
    await expect(selected.closest("td")).toHaveAttribute(
      "aria-selected",
      "true"
    )
    await expect(
      canvas.getByRole("button", { name: "maandag 9 november 2026, vandaag" })
    ).toHaveAttribute("data-today", "true")

    await userEvent.click(
      canvas.getByRole("button", { name: "vrijdag 20 november 2026" })
    )
    await expect(
      canvas.getByRole("button", {
        name: "vrijdag 20 november 2026, geselecteerd",
      })
    ).toHaveFocus()

    // Back to the documented state.
    await userEvent.click(
      canvas.getByRole("button", { name: "woensdag 18 november 2026" })
    )
    await expect(
      canvas.getByRole("button", {
        name: "woensdag 18 november 2026, geselecteerd",
      })
    ).toHaveAttribute("data-selected-single", "true")
  },
}

export const Range: Story = {
  render: () => (
    <RangeCalendar
      initial={{ from: new Date(2026, 10, 11), to: new Date(2026, 10, 20) }}
    />
  ),
  play: async ({ canvas, userEvent }) => {
    const grid = canvas.getByRole("grid", { name: "november 2026" })
    await expect(grid).toHaveAttribute("aria-multiselectable", "true")
    await expect(
      canvas.getByRole("button", {
        name: "woensdag 11 november 2026, geselecteerd",
      })
    ).toHaveAttribute("data-range-start", "true")
    await expect(
      canvas.getByRole("button", {
        name: "maandag 16 november 2026, geselecteerd",
      })
    ).toHaveAttribute("data-range-middle", "true")
    await expect(
      canvas.getByRole("button", {
        name: "vrijdag 20 november 2026, geselecteerd",
      })
    ).toHaveAttribute("data-range-end", "true")

    // A later day moves the end of the range.
    await userEvent.click(
      canvas.getByRole("button", { name: "woensdag 25 november 2026" })
    )
    await expect(
      canvas.getByRole("button", {
        name: "woensdag 25 november 2026, geselecteerd",
      })
    ).toHaveAttribute("data-range-end", "true")

    await userEvent.click(
      canvas.getByRole("button", {
        name: "vrijdag 20 november 2026, geselecteerd",
      })
    )
    await expect(
      canvas.getByRole("button", {
        name: "vrijdag 20 november 2026, geselecteerd",
      })
    ).toHaveAttribute("data-range-end", "true")
  },
}

export const Today: Story = {
  render: () => (
    <SingleCalendar
      // Static preview of the hover look on the 12th.
      modifiers={{ preview: new Date(2026, 10, 12) }}
      modifiersClassNames={{ preview: "[&>button]:bg-accent" }}
    />
  ),
  play: async ({ canvas, userEvent }) => {
    const day = canvas.getByRole("button", {
      name: "maandag 9 november 2026, vandaag",
    })
    // Without a selection, today is the day in the tab order.
    await expect(day).toHaveAttribute("tabindex", "0")
    await userEvent.tab()
    await userEvent.tab()
    await userEvent.tab()
    await expect(day).toHaveFocus()
    await userEvent.keyboard("{ArrowRight}")
    await expect(
      canvas.getByRole("button", { name: "dinsdag 10 november 2026" })
    ).toHaveFocus()
    await userEvent.keyboard("{Home}")
    await expect(day).toHaveFocus()
    await userEvent.hover(
      canvas.getByRole("button", { name: "donderdag 12 november 2026" })
    )
  },
}

export const DisabledDays: Story = {
  name: "Disabled days",
  render: () => (
    <SingleCalendar
      initial={new Date(2026, 10, 18)}
      disabled={[{ before: today }, { dayOfWeek: [0, 6] }]}
    />
  ),
  play: async ({ canvas, userEvent }) => {
    await expect(
      canvas.getByRole("button", { name: "dinsdag 3 november 2026" })
    ).toBeDisabled()
    await expect(
      canvas.getByRole("button", { name: "zaterdag 14 november 2026" })
    ).toBeDisabled()
    await expect(
      canvas.getByRole("button", { name: "maandag 9 november 2026, vandaag" })
    ).toBeEnabled()

    // The keyboard skips disabled days: Friday 20 to Monday 23.
    const selected = canvas.getByRole("button", {
      name: "woensdag 18 november 2026, geselecteerd",
    })
    selected.focus()
    await userEvent.keyboard("{ArrowRight}{ArrowRight}{ArrowRight}")
    await expect(
      canvas.getByRole("button", { name: "maandag 23 november 2026" })
    ).toHaveFocus()
    await userEvent.keyboard("{ArrowLeft}{ArrowLeft}{ArrowLeft}")
    await expect(selected).toHaveFocus()
  },
}

export const MonthNavigation: Story = {
  name: "Month navigation",
  render: () => <SingleCalendar initial={new Date(2026, 11, 3)} />,
  play: async ({ canvas, userEvent }) => {
    const next = canvas.getByRole("button", { name: "Volgende maand" })
    const previous = canvas.getByRole("button", { name: "Vorige maand" })
    await expect(
      canvas.getByRole("grid", { name: "december 2026" })
    ).toBeInTheDocument()

    await userEvent.click(next)
    await expect(
      canvas.getByRole("grid", { name: "januari 2027" })
    ).toBeInTheDocument()
    await userEvent.click(previous)
    await expect(
      canvas.getByRole("grid", { name: "december 2026" })
    ).toBeInTheDocument()

    // Page Down and Page Up move the focused day a month.
    canvas
      .getByRole("button", { name: "donderdag 3 december 2026, geselecteerd" })
      .focus()
    await userEvent.keyboard("{ArrowDown}")
    await expect(
      canvas.getByRole("button", { name: "donderdag 10 december 2026" })
    ).toHaveFocus()
    await userEvent.keyboard("{PageDown}")
    await expect(
      canvas.getByRole("button", { name: "zondag 10 januari 2027" })
    ).toHaveFocus()
    await userEvent.keyboard("{PageUp}")
    await expect(
      canvas.getByRole("button", { name: "donderdag 10 december 2026" })
    ).toHaveFocus()

    next.focus()
    await expect(next).toHaveFocus()
  },
}

export const MonthAndYearSelect: Story = {
  name: "Month and year select",
  render: () => (
    <SingleCalendar
      initial={new Date(2026, 10, 4)}
      captionLayout="dropdown"
      startMonth={new Date(2024, 0)}
      endMonth={new Date(2028, 11)}
    />
  ),
  play: async ({ canvas, userEvent }) => {
    const month = canvas.getByRole("combobox", { name: "Kies de maand" })
    const year = canvas.getByRole("combobox", { name: "Kies het jaar" })
    await expect(month).toHaveDisplayValue("nov")
    await expect(year).toHaveDisplayValue("2026")
    await expect(
      canvas.getAllByRole("option").map((option) => option.textContent)
    ).toEqual([
      "jan",
      "feb",
      "mrt",
      "apr",
      "mei",
      "jun",
      "jul",
      "aug",
      "sep",
      "okt",
      "nov",
      "dec",
      "2024",
      "2025",
      "2026",
      "2027",
      "2028",
    ])

    await userEvent.selectOptions(year, "2028")
    await waitFor(() =>
      expect(
        canvas.getByRole("grid", { name: "november 2028" })
      ).toBeInTheDocument()
    )
    await userEvent.selectOptions(month, "2")
    await waitFor(() =>
      expect(
        canvas.getByRole("grid", { name: "maart 2028" })
      ).toBeInTheDocument()
    )

    await userEvent.selectOptions(year, "2026")
    await userEvent.selectOptions(month, "10")
    await waitFor(() =>
      expect(
        canvas.getByRole("grid", { name: "november 2026" })
      ).toBeInTheDocument()
    )
  },
}

export const TwoMonths: Story = {
  name: "Two months",
  render: () => (
    <RangeCalendar
      initial={{ from: new Date(2026, 10, 23), to: new Date(2026, 11, 4) }}
      numberOfMonths={2}
      showOutsideDays={false}
    />
  ),
  play: async ({ canvas }) => {
    await expect(
      canvas.getByRole("grid", { name: "november 2026" })
    ).toBeInTheDocument()
    await expect(
      canvas.getByRole("grid", { name: "december 2026" })
    ).toBeInTheDocument()
    // Outside days are hidden, so every date shows once.
    await expect(
      canvas.getAllByRole("button", { name: /^dinsdag 1 december 2026/ })
    ).toHaveLength(1)
    // One previous button on the first month, one next button on the last.
    await expect(
      canvas.getAllByRole("button", { name: "Vorige maand" })
    ).toHaveLength(1)
    await expect(
      canvas.getAllByRole("button", { name: "Volgende maand" })
    ).toHaveLength(1)
    await expect(
      canvas.getByRole("button", {
        name: "maandag 30 november 2026, geselecteerd",
      })
    ).toHaveAttribute("data-range-middle", "true")
  },
}
