"use client"

import * as React from "react"
import { CalendarIcon } from "lucide-react"
import { DateLib, type DateRange, type PropsBase } from "react-day-picker"
import { nl } from "react-day-picker/locale"

import { cn } from "@/lib/utils"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

type DatePickerCalendarProps = Omit<
  PropsBase,
  "mode" | "selected" | "onSelect" | "required"
>

type DatePickerBaseProps = Omit<
  React.ComponentProps<"button">,
  "value" | "defaultValue" | "onChange" | "children" | "type" | "name"
> & {
  /** Submits the date in a hidden input as `yyyy-MM-dd`; a range as `name[from]` and `name[to]`. */
  name?: string
  /** Sets `aria-required` on the trigger. */
  required?: boolean
  /** Text in the trigger while no date is chosen. */
  placeholder?: string
  /** date-fns format for the trigger text, in the calendar's locale. */
  format?: string
  /** Accessible name of the panel. */
  panelLabel?: string
  /** Accessible name of the preset list. */
  presetsLabel?: string
  /** Props for the Calendar: disabled days, numberOfMonths, captionLayout, today. */
  calendarProps?: DatePickerCalendarProps
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
}

type DatePickerSingleProps = DatePickerBaseProps & {
  mode?: "single"
  value?: Date
  defaultValue?: Date
  onChange?: (value: Date | undefined) => void
  /** One-click choices left of the calendar; picking one closes the panel. */
  presets?: { label: string; date: Date }[]
}

type DatePickerRangeProps = DatePickerBaseProps & {
  mode: "range"
  value?: DateRange
  defaultValue?: DateRange
  onChange?: (value: DateRange | undefined) => void
  /** One-click choices left of the calendar; picking one closes the panel. */
  presets?: { label: string; range: DateRange }[]
}

type DatePickerProps = DatePickerSingleProps | DatePickerRangeProps

/** Controlled when the `value` prop is passed (even as undefined). */
function useControllable<T>(
  isControlled: boolean,
  value: T,
  defaultValue: T,
  onChange?: (value: T) => void
) {
  const [uncontrolled, setUncontrolled] = React.useState(defaultValue)
  const current = isControlled ? value : uncontrolled

  function setValue(next: T) {
    if (!isControlled) setUncontrolled(next)
    onChange?.(next)
  }

  return [current, setValue] as const
}

function toIsoDate(date: Date | undefined) {
  if (!date) return ""
  const pad = (n: number) => String(n).padStart(2, "0")
  return [
    date.getFullYear(),
    pad(date.getMonth() + 1),
    pad(date.getDate()),
  ].join("-")
}

function DatePicker(props: DatePickerProps) {
  if (props.mode === "range") return <DatePickerRange {...props} />
  return <DatePickerSingle {...props} />
}

function DatePickerSingle(allProps: DatePickerSingleProps) {
  const {
    mode = "single",
    value,
    defaultValue,
    onChange,
    presets = [],
    format = "d MMMM yyyy",
    panelLabel = "Kies een datum",
    calendarProps,
    open,
    defaultOpen = false,
    onOpenChange,
    ...props
  } = allProps
  const [date, setDate] = useControllable(
    "value" in allProps,
    value,
    defaultValue,
    onChange
  )
  const [isOpen, setOpen] = useControllable(
    open !== undefined,
    open ?? false,
    defaultOpen,
    onOpenChange
  )
  const dateLib = new DateLib({ locale: { ...nl, ...calendarProps?.locale } })

  return (
    <DatePickerShell
      {...props}
      mode={mode}
      open={isOpen}
      onOpenChange={setOpen}
      valueText={date ? dateLib.format(date, format) : undefined}
      formValues={[["", toIsoDate(date)]]}
      panelLabel={panelLabel}
      presets={presets.map((preset) => ({
        label: preset.label,
        onSelect: () => {
          setDate(preset.date)
          setOpen(false)
        },
      }))}
      calendar={
        <Calendar
          defaultMonth={date ?? calendarProps?.today}
          {...calendarProps}
          mode="single"
          selected={date}
          onSelect={(next) => {
            // Clicking the chosen day again keeps it and closes the panel.
            if (next) setDate(next)
            setOpen(false)
          }}
        />
      }
    />
  )
}

function DatePickerRange(allProps: DatePickerRangeProps) {
  const {
    mode,
    value,
    defaultValue,
    onChange,
    presets = [],
    format = "d MMM yyyy",
    panelLabel = "Kies een periode",
    calendarProps,
    open,
    defaultOpen = false,
    onOpenChange,
    ...props
  } = allProps
  const [range, setRange] = useControllable(
    "value" in allProps,
    value,
    defaultValue,
    onChange
  )
  const [isOpen, setOpen] = useControllable(
    open !== undefined,
    open ?? false,
    defaultOpen,
    onOpenChange
  )
  const dateLib = new DateLib({ locale: { ...nl, ...calendarProps?.locale } })
  const from = range?.from && dateLib.format(range.from, format)
  const to = range?.to && dateLib.format(range.to, format)

  return (
    <DatePickerShell
      {...props}
      mode={mode}
      open={isOpen}
      onOpenChange={setOpen}
      valueText={from && to ? `${from} – ${to}` : from}
      formValues={[
        ["[from]", toIsoDate(range?.from)],
        ["[to]", toIsoDate(range?.to)],
      ]}
      panelLabel={panelLabel}
      presets={presets.map((preset) => ({
        label: preset.label,
        onSelect: () => {
          setRange(preset.range)
          setOpen(false)
        },
      }))}
      calendar={
        <Calendar
          defaultMonth={range?.from ?? calendarProps?.today}
          numberOfMonths={2}
          showOutsideDays={false}
          {...calendarProps}
          mode="range"
          selected={range}
          onSelect={setRange}
        />
      }
    />
  )
}

function DatePickerShell({
  mode,
  id,
  className,
  placeholder = "Kies een datum",
  presetsLabel = "Snelkeuzes",
  name,
  required,
  "aria-required": ariaRequired,
  open,
  onOpenChange,
  valueText,
  formValues,
  panelLabel,
  presets,
  calendar,
  ...props
}: Omit<
  DatePickerBaseProps,
  "format" | "calendarProps" | "defaultOpen" | "open" | "onOpenChange"
> & {
  mode: "single" | "range"
  open: boolean
  onOpenChange: (open: boolean) => void
  valueText: string | undefined
  /** Name suffix and ISO value of each hidden input. */
  formValues: [string, string][]
  presets: { label: string; onSelect: () => void }[]
  calendar: React.ReactNode
}) {
  const triggerRef = React.useRef<HTMLButtonElement>(null)
  const contentId = React.useId()

  // After a click outside on nothing focusable, focus returns to the trigger
  // (Radix leaves it on the body); a click on another control keeps its focus.
  function returnFocus(event: Event) {
    const active = document.activeElement
    if (active && active !== document.body) return
    event.preventDefault()
    triggerRef.current?.focus()
  }

  // Focus the selected day, else today, instead of the first button.
  function focusDay(event: Event) {
    if (!(event.currentTarget instanceof HTMLElement)) return
    const day = event.currentTarget.querySelector<HTMLElement>(
      '[data-slot="calendar-day"][tabindex="0"]'
    )
    if (!day) return
    event.preventDefault()
    day.focus()
  }

  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild ref={triggerRef}>
        <button
          id={id}
          type="button"
          // A combobox with a dialog popup: named by its label, its text is the value.
          role="combobox"
          aria-expanded={open}
          aria-controls={contentId}
          aria-required={required || ariaRequired || undefined}
          data-slot="date-picker-trigger"
          data-mode={mode}
          data-placeholder={valueText ? undefined : ""}
          className={cn(
            "flex h-9 w-full cursor-pointer items-center gap-2 rounded-md border border-input bg-card px-3 text-left text-sm text-foreground shadow-tile transition-colors disabled:cursor-not-allowed disabled:opacity-50",
            "not-disabled:hover:border-border-strong aria-expanded:border-border-strong aria-invalid:border-destructive",
            "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
            className
          )}
          {...props}
        >
          <CalendarIcon
            aria-hidden="true"
            className="size-4 shrink-0 text-muted-foreground"
          />
          <span
            data-slot="date-picker-value"
            className={cn(
              "min-w-0 truncate tabular-nums",
              !valueText && "text-muted-foreground"
            )}
          >
            {valueText ?? placeholder}
          </span>
        </button>
      </PopoverTrigger>
      <PopoverContent
        id={contentId}
        data-slot="date-picker-content"
        aria-label={panelLabel}
        sideOffset={4}
        onOpenAutoFocus={focusDay}
        onCloseAutoFocus={returnFocus}
        className="w-max max-w-(--radix-popover-content-available-width) gap-0 overflow-hidden p-0 sm:flex-row"
      >
        {presets.length > 0 && (
          <div
            role="group"
            aria-label={presetsLabel}
            data-slot="date-picker-presets"
            className="flex min-w-36 flex-col gap-0.5 border-b border-border px-2 py-3 sm:border-r sm:border-b-0"
          >
            {presets.map((preset) => (
              <button
                key={preset.label}
                type="button"
                data-slot="date-picker-preset"
                className="flex min-h-8 cursor-pointer items-center rounded-md px-2 py-1.5 text-left text-sm text-foreground transition-colors hover:bg-accent focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring"
                onClick={preset.onSelect}
              >
                {preset.label}
              </button>
            ))}
          </div>
        )}
        {calendar}
      </PopoverContent>
      {name &&
        formValues.map(([suffix, value]) => (
          <input
            key={suffix}
            type="hidden"
            data-slot="date-picker-input"
            name={name + suffix}
            value={value}
            form={props.form}
            disabled={props.disabled}
          />
        ))}
    </Popover>
  )
}

export { DatePicker, type DatePickerProps }
