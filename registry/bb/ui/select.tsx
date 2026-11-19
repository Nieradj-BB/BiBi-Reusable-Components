"use client"

import * as React from "react"
import { CheckIcon, ChevronDownIcon, ChevronUpIcon } from "lucide-react"
import { Select as SelectPrimitive } from "radix-ui"

import { cn } from "@/lib/utils"

type SelectInput = "pointer" | "keyboard"

// While the list is open the rest of the page is aria-hidden; the trigger
// leaves the tab order then so it is not a focusable element inside it.
// The list focuses the selected item as it opens, so the trigger also records
// whether the pointer or the keyboard opened it. `lastInput` is the input last
// used in the open list; the trigger takes it over as focus returns on close.
const SelectContext = React.createContext<{
  open: boolean
  openedWith?: SelectInput
  setOpenedWith?: (input: SelectInput) => void
  lastInput?: React.RefObject<SelectInput | undefined>
}>({ open: false })

// Records whether the pointer or the keyboard moved the highlight last.
function trackInput<E extends HTMLElement>(
  lastInput: React.RefObject<SelectInput | undefined> | undefined,
  onPointerMove: React.PointerEventHandler<E> | undefined,
  onKeyDown: React.KeyboardEventHandler<E> | undefined
) {
  return {
    onPointerMove: (event: React.PointerEvent<E>) => {
      event.currentTarget.dataset.input = "pointer"
      if (lastInput) lastInput.current = "pointer"
      onPointerMove?.(event)
    },
    onKeyDown: (event: React.KeyboardEvent<E>) => {
      event.currentTarget.dataset.input = "keyboard"
      if (lastInput) lastInput.current = "keyboard"
      onKeyDown?.(event)
    },
  }
}

// After a pointer pick the trigger gets focus back without the ring; a key
// press brings the ring back, and leaving the trigger resets it.
function trackTriggerInput<E extends HTMLElement>(
  lastInput: React.RefObject<SelectInput | undefined> | undefined,
  {
    onFocus,
    onBlur,
    onKeyDown,
  }: {
    onFocus?: React.FocusEventHandler<E>
    onBlur?: React.FocusEventHandler<E>
    onKeyDown?: React.KeyboardEventHandler<E>
  }
) {
  return {
    onFocus: (event: React.FocusEvent<E>) => {
      if (lastInput?.current === "pointer") {
        event.currentTarget.dataset.input = "pointer"
      }
      onFocus?.(event)
    },
    onBlur: (event: React.FocusEvent<E>) => {
      delete event.currentTarget.dataset.input
      onBlur?.(event)
    },
    onKeyDown: (event: React.KeyboardEvent<E>) => {
      event.currentTarget.dataset.input = "keyboard"
      onKeyDown?.(event)
    },
  }
}

// Only the focus that returns to the trigger as the list closes takes over
// its last input.
function forgetInput(
  lastInput: React.RefObject<SelectInput | undefined> | undefined
) {
  queueMicrotask(() => {
    if (lastInput) lastInput.current = undefined
  })
}

function Select({
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Root>) {
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen)
  const [openedWith, setOpenedWith] = React.useState<SelectInput>()
  const lastInput = React.useRef<SelectInput>(undefined)
  const open = openProp ?? uncontrolledOpen
  const context = React.useMemo(
    () => ({ open, openedWith, setOpenedWith, lastInput }),
    [open, openedWith]
  )

  return (
    <SelectContext value={context}>
      <SelectPrimitive.Root
        data-slot="select"
        open={open}
        onOpenChange={(nextOpen) => {
          if (openProp === undefined) setUncontrolledOpen(nextOpen)
          // Forget the input on close, so a list opened by other means (a
          // controlled `open`) leaves the ring to :focus-visible.
          if (!nextOpen) setOpenedWith(undefined)
          onOpenChange?.(nextOpen)
        }}
        {...props}
      />
    </SelectContext>
  )
}

function SelectGroup({
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Group>) {
  return <SelectPrimitive.Group data-slot="select-group" {...props} />
}

function SelectValue({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Value>) {
  return (
    <SelectPrimitive.Value
      data-slot="select-value"
      className={cn("min-w-0 truncate", className)}
      {...props}
    />
  )
}

function SelectTrigger({
  className,
  size = "default",
  children,
  tabIndex,
  onPointerDown,
  onKeyDown,
  onFocus,
  onBlur,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Trigger> & {
  size?: "sm" | "default"
}) {
  const { open, setOpenedWith, lastInput } = React.use(SelectContext)

  return (
    <SelectPrimitive.Trigger
      data-slot="select-trigger"
      data-size={size}
      tabIndex={open ? -1 : tabIndex}
      className={cn(
        "group/select-trigger flex w-full cursor-pointer items-center justify-between gap-2 rounded-md border border-input bg-card px-3 text-left text-sm whitespace-nowrap text-foreground shadow-tile transition-colors disabled:cursor-not-allowed disabled:opacity-50 data-placeholder:text-muted-foreground data-[size=default]:h-9 data-[size=sm]:h-8",
        "not-disabled:hover:border-border-strong aria-invalid:border-destructive",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring data-[input=pointer]:focus-visible:outline-0",
        "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      onPointerDown={(event) => {
        setOpenedWith?.("pointer")
        onPointerDown?.(event)
      }}
      {...trackTriggerInput(lastInput, {
        onFocus,
        onBlur,
        onKeyDown: (event) => {
          setOpenedWith?.("keyboard")
          onKeyDown?.(event)
        },
      })}
      {...props}
    >
      {children}
      <SelectPrimitive.Icon asChild>
        <ChevronDownIcon
          aria-hidden="true"
          className="size-4 text-muted-foreground group-data-[state=open]/select-trigger:rotate-180"
        />
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  )
}

function SelectContent({
  className,
  children,
  position = "popper",
  align = "start",
  sideOffset = 6,
  onPointerMove,
  onKeyDown,
  onCloseAutoFocus,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Content>) {
  const { openedWith, lastInput } = React.use(SelectContext)

  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content
        data-slot="select-content"
        // Starts as the input that opened the list; trackInput updates it.
        data-input={openedWith}
        className={cn(
          "relative z-50 max-h-(--radix-select-content-available-height) min-w-32 origin-(--radix-select-content-transform-origin) overflow-x-hidden overflow-y-auto rounded-xl border border-border bg-card text-foreground shadow-panel",
          position === "popper" && "w-(--radix-select-trigger-width)",
          className
        )}
        position={position}
        align={align}
        sideOffset={position === "popper" ? sideOffset : undefined}
        {...trackInput(lastInput, onPointerMove, onKeyDown)}
        onCloseAutoFocus={(event) => {
          onCloseAutoFocus?.(event)
          forgetInput(lastInput)
        }}
        {...props}
      >
        <SelectScrollUpButton />
        <SelectPrimitive.Viewport
          className={cn(
            "p-1",
            position === "popper" &&
              "h-(--radix-select-trigger-height) w-full min-w-(--radix-select-trigger-width) scroll-my-1"
          )}
        >
          {children}
        </SelectPrimitive.Viewport>
        <SelectScrollDownButton />
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  )
}

function SelectLabel({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Label>) {
  return (
    <SelectPrimitive.Label
      data-slot="select-label"
      className={cn("px-2 py-1.5 text-xs text-muted-foreground", className)}
      {...props}
    />
  )
}

function SelectItem({
  className,
  children,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Item>) {
  return (
    <SelectPrimitive.Item
      data-slot="select-item"
      className={cn(
        "relative flex min-h-8 w-full cursor-pointer items-center rounded-md py-1.5 pr-2 pl-8 text-sm select-none data-disabled:cursor-not-allowed data-disabled:opacity-50 data-highlighted:bg-accent",
        // Items take focus on hover too; the ring only shows while the keyboard is used.
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring in-data-[input=pointer]:focus-visible:outline-0",
        "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    >
      <span
        data-slot="select-item-indicator"
        className="absolute left-2 flex size-4 items-center justify-center"
      >
        <SelectPrimitive.ItemIndicator>
          <CheckIcon aria-hidden="true" className="size-4 text-brand-cyan" />
        </SelectPrimitive.ItemIndicator>
      </span>
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
    </SelectPrimitive.Item>
  )
}

function SelectSeparator({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Separator>) {
  return (
    <SelectPrimitive.Separator
      data-slot="select-separator"
      className={cn("pointer-events-none -mx-1 my-1 h-px bg-border", className)}
      {...props}
    />
  )
}

function SelectScrollUpButton({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollUpButton>) {
  return (
    <SelectPrimitive.ScrollUpButton
      data-slot="select-scroll-up-button"
      className={cn(
        "flex cursor-default items-center justify-center py-1 text-muted-foreground",
        className
      )}
      {...props}
    >
      <ChevronUpIcon aria-hidden="true" className="size-4" />
    </SelectPrimitive.ScrollUpButton>
  )
}

function SelectScrollDownButton({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollDownButton>) {
  return (
    <SelectPrimitive.ScrollDownButton
      data-slot="select-scroll-down-button"
      className={cn(
        "flex cursor-default items-center justify-center py-1 text-muted-foreground",
        className
      )}
      {...props}
    >
      <ChevronDownIcon aria-hidden="true" className="size-4" />
    </SelectPrimitive.ScrollDownButton>
  )
}

export {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
}
