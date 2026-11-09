import * as React from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"
import { addDays, endOfMonth } from "date-fns"
import { type DateRange } from "react-day-picker"
import { expect, waitFor, within } from "storybook/test"

import { DatePicker } from "@/components/ui/date-picker"
import { FormField } from "@/components/ui/form-field"

const today = new Date(2026, 10, 9)

const meta = {
  title: "Components/Inputs & forms/DatePicker",
  component: DatePicker,
  decorators: [
    (Story) => (
      // Muted and red text need the card surface for contrast.
      <div className="rounded-xl bg-card p-4">
        <Story />
      </div>
    ),
  ],
} satisfies Meta

export default meta

// The props are a union (single or range), so stories render without args.
type Story = StoryObj

function SingleField({
  label,
  initial,
  className = "max-w-72",
  help,
  error,
  ...props
}: Omit<
  Extract<React.ComponentProps<typeof DatePicker>, { mode?: "single" }>,
  "value" | "onChange"
> & {
  label: string
  initial?: Date
  help?: string
  error?: string
}) {
  const [date, setDate] = React.useState<Date | undefined>(initial)

  return (
    <FormField label={label} help={help} error={error} className={className}>
      {(control) => (
        <DatePicker
          {...control}
          calendarProps={{ today }}
          {...props}
          value={date}
          onChange={setDate}
        />
      )}
    </FormField>
  )
}

export const Empty: Story = {
  render: () => <SingleField label="Factuurdatum" />,
  play: async ({ canvas, userEvent }) => {
    const body = within(document.body)
    const trigger = canvas.getByRole("combobox", { name: "Factuurdatum" })
    await expect(trigger).toHaveTextContent("Kies een datum")
    await expect(trigger).toHaveAttribute("aria-haspopup", "dialog")
    await expect(trigger).toHaveAttribute("aria-expanded", "false")

    // Without a value the calendar opens on today, which takes focus.
    await userEvent.click(trigger)
    await body.findByRole("dialog", { name: "Kies een datum" })
    await waitFor(() =>
      expect(
        body.getByRole("button", { name: "maandag 9 november 2026, vandaag" })
      ).toHaveFocus()
    )
    await userEvent.keyboard("{Escape}")
    await waitFor(() => expect(body.queryByRole("dialog")).toBeNull())
    await expect(trigger).toHaveFocus()
    await expect(trigger).toHaveTextContent("Kies een datum")
  },
}

export const Filled: Story = {
  render: () => (
    <SingleField label="Factuurdatum" initial={new Date(2026, 10, 18)} />
  ),
  play: async ({ canvas, userEvent }) => {
    const body = within(document.body)
    const trigger = canvas.getByRole("combobox", { name: "Factuurdatum" })
    await expect(trigger).toHaveTextContent("18 november 2026")
    await expect(trigger).toHaveAttribute("aria-expanded", "false")

    // A click outside closes the panel without changing the date.
    await userEvent.click(trigger)
    await body.findByRole("dialog", { name: "Kies een datum" })
    await userEvent.click(document.body)
    await waitFor(() => expect(body.queryByRole("dialog")).toBeNull())
    await expect(trigger).toHaveAttribute("aria-expanded", "false")
    await expect(trigger).toHaveFocus()
    await expect(trigger).toHaveTextContent("18 november 2026")
  },
}

export const Open: Story = {
  render: () => (
    <SingleField
      label="Vervaldatum"
      initial={new Date(2026, 10, 18)}
      panelLabel="Kies de vervaldatum"
      calendarProps={{ today, disabled: { before: today } }}
      defaultOpen
    />
  ),
  play: async ({ canvas, userEvent }) => {
    const body = within(document.body)
    const trigger = canvas.getByRole("combobox", { name: "Vervaldatum" })
    await expect(trigger).toHaveTextContent("18 november 2026")
    const panel = await body.findByRole("dialog", {
      name: "Kies de vervaldatum",
    })
    await expect(trigger).toHaveAttribute("aria-expanded", "true")
    await expect(trigger).toHaveAttribute("aria-controls", panel.id)
    await expect(
      within(panel).getByRole("button", { name: "zondag 8 november 2026" })
    ).toBeDisabled()
    await waitFor(() =>
      expect(
        within(panel).getByRole("button", {
          name: "woensdag 18 november 2026, geselecteerd",
        })
      ).toHaveFocus()
    )

    // Picking a day closes the panel and returns focus to the trigger.
    await userEvent.keyboard("{ArrowRight}{Enter}")
    await waitFor(() => expect(body.queryByRole("dialog")).toBeNull())
    await expect(trigger).toHaveFocus()
    await expect(trigger).toHaveTextContent("19 november 2026")

    await userEvent.click(trigger)
    const reopened = await body.findByRole("dialog", {
      name: "Kies de vervaldatum",
    })
    await userEvent.click(
      within(reopened).getByRole("button", {
        name: "woensdag 18 november 2026",
      })
    )
    await waitFor(() => expect(body.queryByRole("dialog")).toBeNull())
    await userEvent.click(trigger)
    await body.findByRole("dialog", { name: "Kies de vervaldatum" })
  },
}

function RangeField() {
  const [range, setRange] = React.useState<DateRange | undefined>({
    from: new Date(2026, 10, 23),
    to: new Date(2026, 11, 4),
  })

  return (
    <FormField label="Periode">
      {(control) => (
        <DatePicker
          {...control}
          mode="range"
          className="max-w-72"
          value={range}
          onChange={setRange}
          calendarProps={{ today }}
          defaultOpen
        />
      )}
    </FormField>
  )
}

export const Range: Story = {
  render: () => <RangeField />,
  play: async ({ canvas, userEvent }) => {
    const body = within(document.body)
    const trigger = canvas.getByRole("combobox", { name: "Periode" })
    await expect(trigger).toHaveTextContent("23 nov. 2026 – 4 dec. 2026")
    const panel = await body.findByRole("dialog", { name: "Kies een periode" })
    await expect(
      within(panel).getByRole("grid", { name: "november 2026" })
    ).toBeInTheDocument()
    await expect(
      within(panel).getByRole("grid", { name: "december 2026" })
    ).toBeInTheDocument()

    // The panel stays open while the range changes.
    await userEvent.click(
      within(panel).getByRole("button", { name: "dinsdag 8 december 2026" })
    )
    await expect(trigger).toHaveTextContent("23 nov. 2026 – 8 dec. 2026")
    await expect(body.getByRole("dialog")).toBeInTheDocument()

    await userEvent.click(
      within(panel).getByRole("button", {
        name: "vrijdag 4 december 2026, geselecteerd",
      })
    )
    await expect(trigger).toHaveTextContent("23 nov. 2026 – 4 dec. 2026")
  },
}

const presets = [
  { label: "Vandaag", date: today },
  { label: "Morgen", date: addDays(today, 1) },
  { label: "Over een week", date: addDays(today, 7) },
  { label: "Over twee weken", date: addDays(today, 14) },
  { label: "Einde van de maand", date: endOfMonth(today) },
]

export const Presets: Story = {
  render: () => (
    <SingleField
      label="Vervaldatum"
      initial={new Date(2026, 10, 23)}
      panelLabel="Kies de vervaldatum"
      presets={presets}
      defaultOpen
    />
  ),
  play: async ({ canvas, userEvent }) => {
    const body = within(document.body)
    const trigger = canvas.getByRole("combobox", { name: "Vervaldatum" })
    await expect(trigger).toHaveTextContent("23 november 2026")
    const panel = await body.findByRole("dialog", {
      name: "Kies de vervaldatum",
    })
    const group = within(panel).getByRole("group", { name: "Snelkeuzes" })
    await expect(
      within(group)
        .getAllByRole("button")
        .map((button) => button.textContent)
    ).toEqual(presets.map((preset) => preset.label))

    // A preset sets the date and closes the panel.
    await userEvent.click(
      within(group).getByRole("button", { name: "Over een week" })
    )
    await waitFor(() => expect(body.queryByRole("dialog")).toBeNull())
    await expect(trigger).toHaveTextContent("16 november 2026")
    await expect(trigger).toHaveFocus()

    await userEvent.click(trigger)
    const reopened = await body.findByRole("dialog")
    await userEvent.click(
      within(reopened).getByRole("button", { name: "Over twee weken" })
    )
    await waitFor(() => expect(body.queryByRole("dialog")).toBeNull())
    await userEvent.click(trigger)
    await body.findByRole("dialog", { name: "Kies de vervaldatum" })
  },
}

export const Invalid: Story = {
  render: () => (
    <SingleField
      label="Vervaldatum"
      initial={new Date(2026, 10, 2)}
      help="Uiterlijk 30 dagen na de factuurdatum."
      error="Kies een datum na de factuurdatum (9 november 2026)."
    />
  ),
  play: async ({ canvas }) => {
    const trigger = canvas.getByRole("combobox", { name: "Vervaldatum" })
    await expect(trigger).toHaveTextContent("2 november 2026")
    await expect(trigger).toHaveAttribute("aria-invalid", "true")
    await expect(trigger).toHaveAccessibleDescription(
      "Uiterlijk 30 dagen na de factuurdatum. Kies een datum na de factuurdatum (9 november 2026)."
    )
  },
}

export const Disabled: Story = {
  render: () => (
    <SingleField
      label="Verzenddatum"
      initial={today}
      help="Wordt ingevuld bij het versturen."
      disabled
    />
  ),
  play: async ({ canvas, userEvent }) => {
    const trigger = canvas.getByRole("combobox", { name: "Verzenddatum" })
    await expect(trigger).toHaveTextContent("9 november 2026")
    await expect(trigger).toBeDisabled()
    await userEvent.click(trigger)
    await expect(within(document.body).queryByRole("dialog")).toBeNull()
  },
}

function RequiredField() {
  const [date, setDate] = React.useState<Date | undefined>(
    new Date(2026, 10, 23)
  )

  return (
    <form aria-label="Factuur" onSubmit={(event) => event.preventDefault()}>
      <FormField label="Vervaldatum" required className="max-w-72">
        {(control) => (
          <DatePicker
            {...control}
            name="vervaldatum"
            calendarProps={{ today }}
            value={date}
            onChange={setDate}
          />
        )}
      </FormField>
    </form>
  )
}

export const Required: Story = {
  render: () => <RequiredField />,
  play: async ({ canvas }) => {
    const trigger = canvas.getByRole("combobox", { name: "Vervaldatum" })
    await expect(trigger).toHaveAttribute("aria-required", "true")
    await expect(trigger).toHaveAttribute("aria-haspopup", "dialog")

    // The date is submitted through a hidden input, as an ISO date.
    const form = canvas.getByRole("form", { name: "Factuur" })
    if (!(form instanceof HTMLFormElement)) throw new Error("No form")
    await expect(new FormData(form).get("vervaldatum")).toBe("2026-11-23")
  },
}
