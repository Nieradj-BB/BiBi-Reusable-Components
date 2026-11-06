"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

function defaultRemainingLabel(remaining: number) {
  if (remaining < 0) {
    return `${-remaining} ${remaining === -1 ? "teken" : "tekens"} te veel`
  }
  return `Nog ${remaining} ${remaining === 1 ? "teken" : "tekens"}`
}

function Textarea({
  className,
  rows = 3,
  dir = "auto",
  limit,
  help,
  remainingLabel = defaultRemainingLabel,
  value,
  defaultValue,
  onChange,
  id,
  ref,
  "aria-describedby": ariaDescribedBy,
  "aria-invalid": ariaInvalid,
  ...props
}: React.ComponentProps<"textarea"> & {
  /** Length limit: shows the counter. Text over the limit is never cut off. */
  limit?: number
  /** Help text shown left of the counter and linked with aria-describedby. */
  help?: React.ReactNode
  /** Text announced in a polite live region when the limit is near. */
  remainingLabel?: (remaining: number) => string
}) {
  const generatedId = React.useId()
  const helpId = `${id ?? generatedId}-help`
  const [typedLength, setTypedLength] = React.useState(
    () => String(defaultValue ?? "").length
  )
  const controlled = value !== undefined
  const length = controlled ? String(value).length : typedLength
  const innerRef = React.useRef<HTMLTextAreaElement>(null)

  const setRefs = React.useCallback(
    (node: HTMLTextAreaElement | null) => {
      innerRef.current = node
      if (typeof ref === "function") ref(node)
      else if (ref) ref.current = node
    },
    [ref]
  )

  // Uncontrolled: values written to the DOM without an input event (a form
  // library's default values, a native form reset) still update the counter.
  React.useLayoutEffect(() => {
    const node = innerRef.current
    if (controlled || limit === undefined || !node) return
    const sync = () => setTypedLength(node.value.length)
    sync()
    let frame = 0
    // Reset fires before the browser restores the values.
    const onReset = () => {
      frame = requestAnimationFrame(sync)
    }
    const form = node.form
    form?.addEventListener("reset", onReset)
    return () => {
      form?.removeEventListener("reset", onReset)
      cancelAnimationFrame(frame)
    }
  }, [controlled, limit])
  const remaining = limit === undefined ? 0 : limit - length
  const overLimit = limit !== undefined && remaining < 0
  const nearLimit =
    limit !== undefined && remaining <= Math.max(10, Math.round(limit * 0.1))

  const describedBy =
    [help ? helpId : undefined, ariaDescribedBy].filter(Boolean).join(" ") ||
    undefined

  const textarea = (
    <textarea
      data-slot="textarea"
      ref={setRefs}
      id={id}
      rows={rows}
      dir={dir}
      value={value}
      defaultValue={defaultValue}
      aria-describedby={describedBy}
      aria-invalid={ariaInvalid ?? (overLimit || undefined)}
      onChange={(event) => {
        if (!controlled) setTypedLength(event.target.value.length)
        onChange?.(event)
      }}
      className={cn(
        "block min-h-20 w-full min-w-0 resize-y rounded-md border border-input bg-card px-3 py-2 text-sm text-foreground shadow-tile transition-colors placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50",
        "not-disabled:hover:border-border-strong aria-invalid:border-destructive",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
        className
      )}
      {...props}
    />
  )

  if (limit === undefined && !help) return textarea

  return (
    <div
      data-slot="textarea-field"
      className="flex w-full min-w-0 flex-col gap-1"
    >
      {textarea}
      <div
        data-slot="textarea-footer"
        className="flex items-start justify-between gap-3"
      >
        {help && (
          <p
            data-slot="textarea-help"
            id={helpId}
            className="text-xs text-muted-foreground"
          >
            {help}
          </p>
        )}
        {limit !== undefined && (
          <span
            data-slot="textarea-count"
            aria-hidden="true"
            className={cn(
              "ml-auto shrink-0 text-xs text-muted-foreground tabular-nums",
              overLimit && "text-destructive"
            )}
          >
            {length} / {limit}
          </span>
        )}
      </div>
      {limit !== undefined && (
        <span data-slot="textarea-live" aria-live="polite" className="sr-only">
          {nearLimit ? remainingLabel(remaining) : ""}
        </span>
      )}
    </div>
  )
}

export { Textarea }
