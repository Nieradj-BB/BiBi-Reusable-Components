"use client"

import * as React from "react"
import {
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "lucide-react"
import {
  DateLib,
  DayPicker,
  getDefaultClassNames,
  type ChevronProps,
  type DayButton,
  type DropdownProps,
  type Formatters,
  type Labels,
} from "react-day-picker"
import { nl } from "react-day-picker/locale"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

// Dutch labels in the library's wording; used while the locale is `nl`.
const dutchLabels: Partial<Labels> = {
  labelPrevious: () => "Vorige maand",
  labelNext: () => "Volgende maand",
  labelDayButton: (date, modifiers, options, dateLib) => {
    let label = (dateLib ?? new DateLib(options)).format(date, "PPPP")
    if (modifiers.today) label = `${label}, vandaag`
    if (modifiers.selected) label = `${label}, geselecteerd`
    return label
  },
}

// Short month names without the trailing dot: "jan", "mrt", "nov".
const formatMonthDropdown: Formatters["formatMonthDropdown"] = (
  month,
  dateLib
) =>
  (dateLib ?? new DateLib({ locale: nl })).format(month, "LLL").replace(".", "")

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  captionLayout = "label",
  navLayout = "around",
  locale = nl,
  labels,
  formatters,
  components,
  ...props
}: React.ComponentProps<typeof DayPicker>) {
  const defaultClassNames = getDefaultClassNames()

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      captionLayout={captionLayout}
      navLayout={navLayout}
      locale={locale}
      labels={locale.code === nl.code ? { ...dutchLabels, ...labels } : labels}
      className={cn("w-fit bg-card p-3 text-sm text-foreground", className)}
      formatters={{ formatMonthDropdown, ...formatters }}
      classNames={{
        root: defaultClassNames.root,
        months: cn("flex flex-wrap gap-x-6 gap-y-4", defaultClassNames.months),
        month: cn(
          "relative grid grid-cols-[--spacing(8)_1fr_--spacing(8)] content-start gap-x-1 gap-y-2",
          defaultClassNames.month
        ),
        nav: cn("flex items-center gap-1", defaultClassNames.nav),
        button_previous: cn(
          buttonVariants({ variant: "ghost", size: "icon-sm" }),
          "col-start-1 row-start-1 self-center aria-disabled:cursor-not-allowed aria-disabled:opacity-50",
          defaultClassNames.button_previous
        ),
        button_next: cn(
          buttonVariants({ variant: "ghost", size: "icon-sm" }),
          "col-start-3 row-start-1 self-center aria-disabled:cursor-not-allowed aria-disabled:opacity-50",
          defaultClassNames.button_next
        ),
        month_caption: cn(
          "col-start-2 row-start-1 flex min-h-8 min-w-0 items-center justify-center",
          defaultClassNames.month_caption
        ),
        caption_label: cn(
          "font-semibold text-primary select-none",
          defaultClassNames.caption_label
        ),
        dropdowns: cn(
          "flex items-center justify-center gap-2",
          defaultClassNames.dropdowns
        ),
        month_grid: cn(
          "col-span-3 m-0 border-separate border-spacing-x-0 border-spacing-y-0.5",
          defaultClassNames.month_grid
        ),
        weekday: cn(
          "h-8 w-9 p-0 text-center text-xs font-normal text-muted-foreground select-none",
          defaultClassNames.weekday
        ),
        week_number_header: cn(
          "h-8 w-9 p-0 text-center text-xs font-normal text-muted-foreground select-none",
          defaultClassNames.week_number_header
        ),
        week_number: cn(
          "size-9 p-0 text-center text-xs text-muted-foreground tabular-nums select-none",
          defaultClassNames.week_number
        ),
        day: cn("size-9 p-0 text-center", defaultClassNames.day),
        range_start: cn(
          "rounded-l-md bg-brand-ice",
          defaultClassNames.range_start
        ),
        range_middle: cn("bg-brand-ice", defaultClassNames.range_middle),
        range_end: cn("rounded-r-md bg-brand-ice", defaultClassNames.range_end),
        hidden: cn("invisible", defaultClassNames.hidden),
        ...classNames,
      }}
      components={{
        Root: ({ className, rootRef, ...props }) => (
          <div
            data-slot="calendar"
            ref={rootRef}
            className={className}
            {...props}
          />
        ),
        Chevron: CalendarChevron,
        Dropdown: CalendarDropdown,
        DayButton: CalendarDayButton,
        ...components,
      }}
      {...props}
    />
  )
}

function CalendarChevron({ className, orientation }: ChevronProps) {
  const Icon =
    orientation === "left"
      ? ChevronLeftIcon
      : orientation === "right"
        ? ChevronRightIcon
        : ChevronDownIcon
  return <Icon aria-hidden="true" className={cn("size-4", className)} />
}

/** Month or year select for `captionLayout="dropdown"`. */
function CalendarDropdown({ options, className, ...props }: DropdownProps) {
  return (
    <span data-slot="calendar-dropdown" className="relative inline-flex">
      <select
        className={cn(
          "h-8 cursor-pointer appearance-none rounded-md border border-input bg-card pr-7 pl-2 text-sm font-semibold text-foreground transition-colors not-disabled:hover:border-border-strong focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        {...props}
      >
        {options?.map(({ value, label, disabled }) => (
          <option key={value} value={value} disabled={disabled}>
            {label}
          </option>
        ))}
      </select>
      <ChevronDownIcon
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 right-2 size-4 -translate-y-1/2 text-muted-foreground"
      />
    </span>
  )
}

function CalendarDayButton({
  className,
  day,
  modifiers,
  ...props
}: React.ComponentProps<typeof DayButton>) {
  const defaultClassNames = getDefaultClassNames()
  const ref = React.useRef<HTMLButtonElement>(null)

  React.useEffect(() => {
    if (modifiers.focused) ref.current?.focus()
  }, [modifiers.focused])

  return (
    <button
      ref={ref}
      data-slot="calendar-day"
      data-today={modifiers.today}
      data-outside={day.outside}
      data-selected={modifiers.selected}
      data-selected-single={
        modifiers.selected &&
        !modifiers.range_start &&
        !modifiers.range_end &&
        !modifiers.range_middle
      }
      data-range-start={modifiers.range_start}
      data-range-middle={modifiers.range_middle}
      data-range-end={modifiers.range_end}
      className={cn(
        "relative inline-grid size-9 cursor-pointer place-items-center rounded-md border border-transparent bg-transparent p-0 text-sm font-normal text-foreground tabular-nums transition-colors not-disabled:hover:bg-accent focus-visible:z-10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
        "data-[outside=true]:not-data-[selected=true]:text-muted-foreground",
        "data-[today=true]:border-brand-cyan data-[today=true]:font-semibold",
        "data-[selected-single=true]:bg-brand-cyan data-[selected-single=true]:font-semibold data-[selected-single=true]:text-brand-cyan-foreground data-[selected-single=true]:not-disabled:hover:bg-brand-cyan/90",
        "data-[range-start=true]:bg-brand-cyan data-[range-start=true]:font-semibold data-[range-start=true]:text-brand-cyan-foreground data-[range-start=true]:not-disabled:hover:bg-brand-cyan/90",
        "data-[range-end=true]:bg-brand-cyan data-[range-end=true]:font-semibold data-[range-end=true]:text-brand-cyan-foreground data-[range-end=true]:not-disabled:hover:bg-brand-cyan/90",
        "disabled:cursor-not-allowed disabled:text-muted-foreground disabled:line-through disabled:opacity-50 aria-disabled:cursor-not-allowed aria-disabled:text-muted-foreground aria-disabled:line-through aria-disabled:opacity-50",
        defaultClassNames.day_button,
        className
      )}
      {...props}
    />
  )
}

export { Calendar, CalendarDayButton }
