"use client"

import * as React from "react"
import * as RechartsPrimitive from "recharts"
import type {
  BarProps,
  BarShapeProps,
  CartesianGridProps,
  TooltipValueType,
  XAxisProps,
  YAxisProps,
} from "recharts"

import { cn } from "@/lib/utils"

const INITIAL_DIMENSION = { width: 320, height: 212 } as const

/** Pass to the recharts chart: 8px of room above the plot for the top tick label. */
const chartMargin = { top: 8, right: 0, bottom: 0, left: 0 }
type TooltipNameType = number | string

/** Series in data order. Colours are `var(--chart-1)`, `var(--chart-2)`, `var(--chart-3)`, in that order. */
export type ChartConfig = Record<
  string,
  {
    label?: React.ReactNode
    icon?: React.ComponentType
    color?: string
  }
>

type ChartContextProps = {
  config: ChartConfig
}

const ChartContext = React.createContext<ChartContextProps | null>(null)

function useChart() {
  const context = React.useContext(ChartContext)

  if (!context) {
    throw new Error("useChart must be used within a <ChartContainer />")
  }

  return context
}

/* ---------------------------------------------------------------------------
 * Card shell: title, one-sentence takeaway, optional action, then the chart.
 * ------------------------------------------------------------------------ */

const ChartCardContext = React.createContext<string | undefined>(undefined)

function ChartCard({
  className,
  children,
  ...props
}: React.ComponentProps<"section">) {
  const titleId = React.useId()

  return (
    <ChartCardContext.Provider value={titleId}>
      <section
        data-slot="chart-card"
        aria-labelledby={titleId}
        className={cn(
          "flex min-w-0 flex-col gap-4 rounded-xl border border-border bg-card p-5 text-card-foreground shadow-card",
          className
        )}
        {...props}
      >
        {children}
      </section>
    </ChartCardContext.Provider>
  )
}

function ChartCardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="chart-card-header"
      className={cn(
        "grid grid-cols-[minmax(0,1fr)_auto] items-start gap-x-3 gap-y-0.5",
        className
      )}
      {...props}
    />
  )
}

function ChartCardTitle({
  className,
  children,
  ...props
}: React.ComponentProps<"h3">) {
  const titleId = React.useContext(ChartCardContext)

  return (
    <h3
      data-slot="chart-card-title"
      id={titleId}
      className={cn("col-start-1 text-base", className)}
      {...props}
    >
      {children}
    </h3>
  )
}

/** The one-sentence takeaway under the title. */
function ChartCardDescription({
  className,
  ...props
}: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="chart-card-description"
      className={cn("col-start-1 text-sm text-muted-foreground", className)}
      {...props}
    />
  )
}

function ChartCardAction({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="chart-card-action"
      className={cn(
        "col-start-2 row-span-2 row-start-1 self-start justify-self-end",
        className
      )}
      {...props}
    />
  )
}

function ChartCardFooter({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="chart-card-footer"
      className={cn("border-t border-border pt-3 text-sm", className)}
      {...props}
    />
  )
}

/** Shown instead of the chart when there is no data. */
function ChartEmpty({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="chart-empty"
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  )
}

/** The drawing as one image with a short text alternative, plus an optional unit caption. */
function ChartPlot({
  className,
  unit,
  children,
  ...props
}: React.ComponentProps<"div"> & {
  "aria-label": string
  /** Unit above the y-axis, e.g. `Uren`. */
  unit?: React.ReactNode
}) {
  return (
    <div
      data-slot="chart-plot"
      role="img"
      className={cn(
        // The chart's 8px top margin only holds the top tick label.
        "min-w-0 text-xs text-muted-foreground *:data-[slot=chart]:-mt-2",
        className
      )}
      {...props}
    >
      {unit && (
        <p data-slot="chart-unit" className="mb-2">
          {unit}
        </p>
      )}
      {children}
    </div>
  )
}

/* ---------------------------------------------------------------------------
 * Recharts container, tooltip and legend (shadcn API).
 * ------------------------------------------------------------------------ */

function ChartContainer({
  id,
  className,
  children,
  config,
  initialDimension = INITIAL_DIMENSION,
  ...props
}: React.ComponentProps<"div"> & {
  config: ChartConfig
  children: React.ComponentProps<
    typeof RechartsPrimitive.ResponsiveContainer
  >["children"]
  initialDimension?: {
    width: number
    height: number
  }
}) {
  const uniqueId = React.useId()
  const chartId = `chart-${id ?? uniqueId.replace(/:/g, "")}`

  return (
    <ChartContext.Provider value={{ config }}>
      <div
        data-slot="chart"
        data-chart={chartId}
        className={cn(
          "flex h-53 w-full justify-center text-xs [&_.recharts-cartesian-axis-tick-label_text]:fill-muted-foreground [&_.recharts-cartesian-axis-tick-label_text]:tabular-nums [&_.recharts-cartesian-grid_line]:stroke-border/50 [&_.recharts-label-list_text]:fill-foreground [&_.recharts-label-list_text]:tabular-nums [&_.recharts-rectangle.recharts-tooltip-cursor]:fill-muted [&_.recharts-reference-line_line]:stroke-border",
          className
        )}
        {...props}
      >
        <ChartStyle id={chartId} config={config} />
        <RechartsPrimitive.ResponsiveContainer
          initialDimension={initialDimension}
        >
          {children}
        </RechartsPrimitive.ResponsiveContainer>
      </div>
    </ChartContext.Provider>
  )
}

function ChartStyle({ id, config }: { id: string; config: ChartConfig }) {
  const colorConfig = Object.entries(config).filter(
    ([, itemConfig]) => itemConfig.color
  )

  if (!colorConfig.length) {
    return null
  }

  return (
    <style
      dangerouslySetInnerHTML={{
        __html: `[data-chart=${id}] {\n${colorConfig
          .map(([key, itemConfig]) => `  --color-${key}: ${itemConfig.color};`)
          .join("\n")}\n}`,
      }}
    />
  )
}

function ChartTooltip(
  props: React.ComponentProps<typeof RechartsPrimitive.Tooltip>
) {
  return <RechartsPrimitive.Tooltip isAnimationActive={false} {...props} />
}

function ChartTooltipContent({
  active,
  payload,
  className,
  indicator = "dot",
  hideLabel = false,
  hideIndicator = false,
  label,
  labelFormatter,
  labelClassName,
  formatter,
  color,
  nameKey,
  labelKey,
}: React.ComponentProps<typeof RechartsPrimitive.Tooltip> &
  React.ComponentProps<"div"> & {
    hideLabel?: boolean
    hideIndicator?: boolean
    indicator?: "line" | "dot" | "dashed"
    nameKey?: string
    labelKey?: string
  } & Omit<
    RechartsPrimitive.DefaultTooltipContentProps<
      TooltipValueType,
      TooltipNameType
    >,
    "accessibilityLayer"
  >) {
  const { config } = useChart()

  const tooltipLabel = React.useMemo(() => {
    if (hideLabel || !payload?.length) {
      return null
    }

    const [item] = payload
    const key = `${labelKey ?? item?.dataKey ?? item?.name ?? "value"}`
    const itemConfig = getPayloadConfigFromPayload(config, item, key)
    const value =
      !labelKey && typeof label === "string"
        ? (config[label]?.label ?? label)
        : itemConfig?.label

    if (labelFormatter) {
      return (
        <div className={cn("font-semibold", labelClassName)}>
          {labelFormatter(value, payload)}
        </div>
      )
    }

    if (!value) {
      return null
    }

    return <div className={cn("font-semibold", labelClassName)}>{value}</div>
  }, [
    label,
    labelFormatter,
    payload,
    hideLabel,
    labelClassName,
    config,
    labelKey,
  ])

  if (!active || !payload?.length) {
    return null
  }

  const nestLabel = payload.length === 1 && indicator !== "dot"

  return (
    <div
      data-slot="chart-tooltip"
      className={cn(
        "grid min-w-32 items-start gap-1.5 rounded-md border border-border bg-card px-2.5 py-1.5 text-xs text-foreground shadow-panel",
        className
      )}
    >
      {!nestLabel ? tooltipLabel : null}
      <div className="grid gap-1.5">
        {payload
          .filter((item) => item.type !== "none")
          .map((item, index) => {
            const key = `${nameKey ?? item.name ?? item.dataKey ?? "value"}`
            const itemConfig = getPayloadConfigFromPayload(config, item, key)
            const indicatorColor = color ?? item.payload?.fill ?? item.color

            return (
              <div
                key={index}
                className={cn(
                  "flex w-full flex-wrap items-stretch gap-2 [&>svg]:size-2.5 [&>svg]:text-muted-foreground",
                  indicator === "dot" && "items-center"
                )}
              >
                {formatter && item?.value !== undefined && item.name ? (
                  formatter(item.value, item.name, item, index, item.payload)
                ) : (
                  <>
                    {itemConfig?.icon ? (
                      <itemConfig.icon />
                    ) : (
                      !hideIndicator && (
                        <div
                          className={cn(
                            "shrink-0 border-(--indicator) bg-(--indicator)",
                            {
                              "size-2.5": indicator === "dot",
                              "w-1": indicator === "line",
                              "w-0 border-[1.5px] border-dashed bg-transparent":
                                indicator === "dashed",
                              "my-0.5": nestLabel && indicator === "dashed",
                            }
                          )}
                          style={
                            {
                              "--indicator": indicatorColor,
                            } as React.CSSProperties
                          }
                        />
                      )
                    )}
                    <div
                      className={cn(
                        "flex flex-1 justify-between gap-4 leading-none",
                        nestLabel ? "items-end" : "items-center"
                      )}
                    >
                      <div className="grid gap-1.5">
                        {nestLabel ? tooltipLabel : null}
                        <span className="text-muted-foreground">
                          {itemConfig?.label ?? item.name}
                        </span>
                      </div>
                      {item.value != null && (
                        <span className="font-medium text-foreground tabular-nums">
                          {typeof item.value === "number"
                            ? item.value.toLocaleString("nl-NL")
                            : String(item.value)}
                        </span>
                      )}
                    </div>
                  </>
                )}
              </div>
            )
          })}
      </div>
    </div>
  )
}

const ChartLegend = RechartsPrimitive.Legend

/**
 * Legend in data order. Inside a recharts `<ChartLegend content={...} />` it reads the payload;
 * on its own (outside the `role="img"` plot, so screen readers read it) pass `config`.
 */
function ChartLegendContent({
  className,
  hideIcon = false,
  payload,
  verticalAlign = "bottom",
  nameKey,
  config: configProp,
}: React.ComponentProps<"ul"> & {
  hideIcon?: boolean
  nameKey?: string
  config?: ChartConfig
} & RechartsPrimitive.DefaultLegendContentProps) {
  const context = React.useContext(ChartContext)
  const config = configProp ?? context?.config ?? {}

  const items = payload?.length
    ? payload
        .filter((item) => item.type !== "none")
        .map((item) => {
          const key = `${nameKey ?? item.dataKey ?? "value"}`
          const itemConfig = getPayloadConfigFromPayload(config, item, key)
          return { key, itemConfig, color: item.color }
        })
    : Object.entries(config).map(([key, itemConfig]) => ({
        key,
        itemConfig,
        color: itemConfig.color,
      }))

  if (!items.length) {
    return null
  }

  return (
    <ul
      data-slot="chart-legend"
      className={cn(
        "flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs text-foreground",
        payload?.length && (verticalAlign === "top" ? "pb-3" : "pt-3"),
        className
      )}
    >
      {items.map(({ key, itemConfig, color }) => (
        <li
          key={key}
          className="flex items-center gap-1.5 [&>svg]:size-3 [&>svg]:text-muted-foreground"
        >
          {itemConfig?.icon && !hideIcon ? (
            <itemConfig.icon />
          ) : (
            <span
              aria-hidden="true"
              className="size-2 shrink-0 bg-(--swatch)"
              style={{ "--swatch": color } as React.CSSProperties}
            />
          )}
          {itemConfig?.label}
        </li>
      ))}
    </ul>
  )
}

/* ---------------------------------------------------------------------------
 * Recharts parts with the house defaults: horizontal grid only, 12px muted
 * axis text without lines, bars at most 24px with 4px rounded ends, no
 * animation, 2px card-coloured seams between stacked parts.
 * ------------------------------------------------------------------------ */

function ChartGrid(props: CartesianGridProps) {
  return <RechartsPrimitive.CartesianGrid vertical={false} {...props} />
}

function ChartXAxis(props: XAxisProps) {
  return (
    <RechartsPrimitive.XAxis
      tickLine={false}
      axisLine={false}
      tickSize={0}
      tickMargin={8}
      height={24}
      {...props}
    />
  )
}

function ChartYAxis(props: YAxisProps) {
  return (
    <RechartsPrimitive.YAxis
      width={32}
      tickLine={false}
      axisLine={false}
      tickSize={0}
      tickMargin={8}
      {...props}
    />
  )
}

const ChartBarStackContext = React.createContext(false)

/** Stacks the ChartBars inside it; only the top of the whole stack is rounded. */
function ChartBarStack({
  radius = [4, 4, 0, 0],
  ...props
}: React.ComponentProps<typeof RechartsPrimitive.BarStack>) {
  return (
    <ChartBarStackContext.Provider value={true}>
      <RechartsPrimitive.BarStack radius={radius} {...props} />
    </ChartBarStackContext.Provider>
  )
}

// A stacked part that sits on another part leaves 2px of card showing below it.
function ChartSeamShape({ value, height, ...props }: BarShapeProps) {
  const sitsOnPart = Array.isArray(value) && value[0] !== 0
  const seamHeight = sitsOnPart ? Math.max(height - 2, 0) : height

  return <RechartsPrimitive.Rectangle {...props} height={seamHeight} />
}

function ChartValueLabels({
  dataKey,
  show,
  xAxisId = 0,
  yAxisId = 0,
}: {
  dataKey: BarProps["dataKey"]
  show: "last" | "all"
  xAxisId?: BarProps["xAxisId"]
  yAxisId?: BarProps["yAxisId"]
}) {
  // The category axis is X for columns and Y for horizontal bars (layout
  // "vertical"); its domain has one entry per bar.
  const vertical = RechartsPrimitive.useCartesianChartLayout() === "vertical"
  const xDomain = RechartsPrimitive.useXAxisDomain(xAxisId)
  const yDomain = RechartsPrimitive.useYAxisDomain(yAxisId)
  const lastIndex = ((vertical ? yDomain : xDomain)?.length ?? 0) - 1

  return (
    <RechartsPrimitive.LabelList
      dataKey={show === "all" ? dataKey : undefined}
      valueAccessor={(entry, index) =>
        index === lastIndex ? (entry.value as number | string) : null
      }
      position={vertical ? "right" : "top"}
      offset={6}
    />
  )
}

function ChartBar({
  valueLabels = "none",
  children,
  ...props
}: BarProps & {
  /**
   * Values above the bars (beside them in a horizontal layout): `last` labels
   * only the latest bar and needs a category axis (the default).
   */
  valueLabels?: "none" | "last" | "all"
}) {
  const stacked = React.useContext(ChartBarStackContext)

  return (
    <RechartsPrimitive.Bar
      maxBarSize={24}
      radius={stacked ? 0 : [4, 4, 0, 0]}
      isAnimationActive={false}
      shape={stacked ? ChartSeamShape : undefined}
      {...props}
    >
      {valueLabels !== "none" && (
        <ChartValueLabels
          dataKey={props.dataKey}
          show={valueLabels}
          xAxisId={props.xAxisId}
          yAxisId={props.yAxisId}
        />
      )}
      {children}
    </RechartsPrimitive.Bar>
  )
}

/* ---------------------------------------------------------------------------
 * Proportion bar and ranked bars, drawn in HTML: their lists are the legend
 * and the text alternative at once.
 * ------------------------------------------------------------------------ */

const seriesColors = ["bg-chart-1", "bg-chart-2", "bg-chart-3"] as const

type ChartProportionItem = {
  label: React.ReactNode
  value: number
  /** Shown in the list; defaults to the rounded share, e.g. `62 %`. */
  valueLabel?: React.ReactNode
}

/** A 100% stacked bar (decorative) with a list of parts, coloured chart-1, chart-2, chart-3. */
function ChartProportion({
  items,
  className,
  ...props
}: React.ComponentProps<"div"> & { items: ChartProportionItem[] }) {
  const total = items.reduce((sum, item) => sum + item.value, 0)
  const shares = items.map((item) => (total > 0 ? item.value / total : 0))

  return (
    <div
      data-slot="chart-proportion"
      className={cn("flex flex-col gap-4", className)}
      {...props}
    >
      <div aria-hidden="true" className="flex h-6">
        {items.map((_item, index) => (
          <span
            key={index}
            className={cn(
              "box-border h-full flex-none not-first:border-l-2 not-first:border-card first:rounded-l-sm last:rounded-r-sm",
              seriesColors[index]
            )}
            style={{ width: `${shares[index] * 100}%` }}
          />
        ))}
      </div>
      <ul className="flex flex-col gap-1.5 text-sm">
        {items.map((item, index) => (
          <li key={index} className="flex items-center gap-2">
            <span
              aria-hidden="true"
              className={cn("size-2.5 flex-none", seriesColors[index])}
            />
            <span className="min-w-0 flex-1">{item.label}</span>
            <span className="tabular-nums">
              {item.valueLabel ?? <>{Math.round(shares[index] * 100)}&nbsp;%</>}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}

type ChartRankingItem = {
  label: React.ReactNode
  value: number
  valueLabel?: React.ReactNode
}

/** Horizontal bars, sorted from large to small, each with its value; lengths relative to `max` (the largest value by default). */
function ChartRanking({
  items,
  max,
  className,
  ...props
}: React.ComponentProps<"ul"> & {
  items: ChartRankingItem[]
  max?: number
}) {
  const ranked = [...items].sort((a, b) => b.value - a.value)
  const scale = max ?? Math.max(...items.map((item) => item.value), 0)

  return (
    <ul
      data-slot="chart-ranking"
      className={cn("flex flex-col gap-3 text-xs", className)}
      {...props}
    >
      {ranked.map((item, index) => (
        <li
          key={index}
          className="grid grid-cols-[7.5rem_minmax(0,1fr)] items-center gap-3"
        >
          <span className="text-right text-muted-foreground">{item.label}</span>
          <span className="mr-10 block">
            <span
              className="relative block h-6 rounded-r-sm bg-chart-1"
              style={{
                width: `${scale > 0 ? (item.value / scale) * 100 : 0}%`,
              }}
            >
              <span className="absolute top-1/2 left-full ml-2 -translate-y-1/2 text-foreground tabular-nums">
                {item.valueLabel ?? item.value}
              </span>
            </span>
          </span>
        </li>
      ))}
    </ul>
  )
}

// Helper to extract item config from a payload.
function getPayloadConfigFromPayload(
  config: ChartConfig,
  payload: unknown,
  key: string
) {
  if (typeof payload !== "object" || payload === null) {
    return undefined
  }

  const payloadPayload =
    "payload" in payload &&
    typeof payload.payload === "object" &&
    payload.payload !== null
      ? payload.payload
      : undefined

  let configLabelKey: string = key

  if (
    key in payload &&
    typeof payload[key as keyof typeof payload] === "string"
  ) {
    configLabelKey = payload[key as keyof typeof payload] as string
  } else if (
    payloadPayload &&
    key in payloadPayload &&
    typeof payloadPayload[key as keyof typeof payloadPayload] === "string"
  ) {
    configLabelKey = payloadPayload[
      key as keyof typeof payloadPayload
    ] as string
  }

  return configLabelKey in config ? config[configLabelKey] : config[key]
}

export {
  ChartBar,
  ChartBarStack,
  ChartCard,
  ChartCardAction,
  ChartCardDescription,
  ChartCardFooter,
  ChartCardHeader,
  ChartCardTitle,
  ChartContainer,
  ChartEmpty,
  ChartGrid,
  ChartLegend,
  ChartLegendContent,
  ChartPlot,
  ChartProportion,
  ChartRanking,
  ChartStyle,
  ChartTooltip,
  ChartTooltipContent,
  ChartXAxis,
  ChartYAxis,
  chartMargin,
}
