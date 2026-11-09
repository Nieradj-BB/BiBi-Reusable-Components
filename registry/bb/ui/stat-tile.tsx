import * as React from "react"
import { TrendingDownIcon, TrendingUpIcon } from "lucide-react"
import { Slot } from "radix-ui"

import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

type StatTileTrend = {
  /** Picks the arrow. */
  direction: "up" | "down"
  /** Picks the arrow colour: good is green, bad is red. */
  tone: "good" | "bad"
  /** The words that carry the meaning, e.g. "12 % hoger dan vorige maand". */
  label: string
}

/** One description list that holds a row of tiles, 16px apart. */
function StatTileGroup({ className, ...props }: React.ComponentProps<"dl">) {
  return (
    <dl
      data-slot="stat-tile-group"
      className={cn(
        "grid w-full grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4",
        className
      )}
      {...props}
    />
  )
}

/** The label as a link stretched over the whole tile. */
function StatTileLink({
  className,
  asChild = false,
  ...props
}: React.ComponentProps<"a"> & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : "a"

  return (
    <Comp
      data-slot="stat-tile-link"
      className={cn(
        "after:absolute after:inset-0 after:rounded-xl focus-visible:outline-none",
        className
      )}
      {...props}
    />
  )
}

const sparkTop = 10
const sparkBottom = 30
const sparkLeft = 6
const sparkRight = 106

function Sparkline({ values }: { values: number[] }) {
  if (values.length < 2) return null

  const min = Math.min(...values)
  const max = Math.max(...values)
  const step = (sparkRight - sparkLeft) / (values.length - 1)
  const points = values.map((value, index) => {
    const x = sparkLeft + index * step
    const y =
      max === min
        ? (sparkTop + sparkBottom) / 2
        : sparkBottom - ((value - min) / (max - min)) * (sparkBottom - sparkTop)
    return [Math.round(x * 10) / 10, Math.round(y * 10) / 10] as const
  })
  const [lastX, lastY] = points[points.length - 1]

  return (
    <svg
      data-slot="stat-tile-sparkline"
      viewBox="0 0 112 40"
      aria-hidden="true"
      focusable="false"
      className="h-10 w-28 flex-none"
    >
      <polyline
        points={points.map(([x, y]) => `${x},${y}`).join(" ")}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="fill-none stroke-muted-foreground stroke-2"
      />
      <circle
        cx={lastX}
        cy={lastY}
        r="4"
        className="fill-chart-1 stroke-card stroke-2"
      />
    </svg>
  )
}

function StatTile({
  label,
  value,
  caption,
  meta,
  trend,
  sparkline,
  href,
  loading = false,
  loadingLabel,
  className,
  ...props
}: Omit<React.ComponentProps<"div">, "children"> & {
  label: React.ReactNode
  /** Already formatted, e.g. "€ 18.420". */
  value?: React.ReactNode
  /** One line of body text under the value. */
  caption?: React.ReactNode
  /** Small muted line, e.g. the previous period. */
  meta?: React.ReactNode
  trend?: StatTileTrend
  /** Two or more points; decorative, so show the values elsewhere as text. */
  sparkline?: number[]
  /** Makes the label a link that covers the whole tile. */
  href?: string
  loading?: boolean
  /** Screen reader text while loading. Defaults to "<label> laden…". */
  loadingLabel?: string
}) {
  const TrendIcon =
    trend?.direction === "down" ? TrendingDownIcon : TrendingUpIcon

  return (
    <div
      data-slot="stat-tile"
      aria-busy={loading || undefined}
      className={cn(
        "relative flex min-w-0 flex-col gap-1 rounded-xl border border-border bg-card p-5 shadow-card transition-shadow duration-200",
        "has-data-[slot=stat-tile-link]:hover:shadow-tile-hover",
        "has-[[data-slot=stat-tile-link]:focus-visible]:outline-2 has-[[data-slot=stat-tile-link]:focus-visible]:outline-offset-2 has-[[data-slot=stat-tile-link]:focus-visible]:outline-ring",
        className
      )}
      {...props}
    >
      <dt data-slot="stat-tile-label" className="text-sm text-muted-foreground">
        {href ? <StatTileLink href={href}>{label}</StatTileLink> : label}
      </dt>
      {loading ? (
        <dd data-slot="stat-tile-loading">
          <span className="sr-only">
            {loadingLabel ??
              (typeof label === "string" ? `${label} laden…` : "Laden…")}
          </span>
          <Skeleton className="my-1 h-7 w-24" />
        </dd>
      ) : (
        <>
          <dd
            data-slot="stat-tile-value"
            className="flex flex-wrap items-end justify-between gap-3"
          >
            <span className="font-heading text-3xl font-bold text-primary">
              {value}
            </span>
            {sparkline && <Sparkline values={sparkline} />}
          </dd>
          {caption && (
            <dd
              data-slot="stat-tile-caption"
              className="text-sm text-foreground"
            >
              {caption}
            </dd>
          )}
          {trend && (
            <dd
              data-slot="stat-tile-trend"
              data-direction={trend.direction}
              data-tone={trend.tone}
              className="flex items-center gap-1 text-xs font-medium text-foreground"
            >
              <TrendIcon
                aria-hidden="true"
                className={cn(
                  "size-3.5 shrink-0",
                  trend.tone === "good" ? "text-success" : "text-destructive"
                )}
              />
              {trend.label}
            </dd>
          )}
          {meta && (
            <dd
              data-slot="stat-tile-meta"
              className="text-xs text-muted-foreground"
            >
              {meta}
            </dd>
          )}
        </>
      )}
    </div>
  )
}

export { StatTile, StatTileGroup, StatTileLink, type StatTileTrend }
