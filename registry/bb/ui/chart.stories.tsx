import type { Meta, StoryObj } from "@storybook/react-vite"
import { InfoIcon } from "lucide-react"
import { BarChart } from "recharts"
import { expect, waitFor, within } from "storybook/test"

import { Button } from "@/components/ui/button"
import {
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
  ChartLegendContent,
  ChartPlot,
  ChartProportion,
  ChartRanking,
  ChartTooltip,
  ChartTooltipContent,
  ChartXAxis,
  ChartYAxis,
  chartMargin,
  type ChartConfig,
} from "@/components/ui/chart"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

const meta = {
  title: "Components/Data display/Chart",
  component: ChartCard,
  decorators: [
    (Story) => (
      <div className="w-full max-w-4xl">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ChartCard>

export default meta

type Story = StoryObj<typeof meta>

const hoursConfig = {
  advies: { label: "Advies", color: "var(--chart-1)" },
  ontwikkeling: { label: "Ontwikkeling", color: "var(--chart-2)" },
  beheer: { label: "Beheer", color: "var(--chart-3)" },
} satisfies ChartConfig

const hoursPerMonth = [
  { month: "jun", advies: 40, ontwikkeling: 25, beheer: 15 },
  { month: "jul", advies: 30, ontwikkeling: 20, beheer: 10 },
  { month: "aug", advies: 20, ontwikkeling: 15, beheer: 10 },
  { month: "sep", advies: 45, ontwikkeling: 30, beheer: 20 },
  { month: "okt", advies: 50, ontwikkeling: 35, beheer: 15 },
  { month: "nov", advies: 35, ontwikkeling: 25, beheer: 10 },
]

export const StackedBars: Story = {
  name: "Stacked bars",
  render: () => (
    <ChartCard>
      <ChartCardHeader>
        <ChartCardTitle>Uren per maand</ChartCardTitle>
        <ChartCardDescription>
          Oktober 100 uur: 50 advies, 35 ontwikkeling en 15 beheer.
        </ChartCardDescription>
        <ChartCardAction>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                size="icon-sm"
                aria-label="Uitleg bij Uren per maand"
              >
                <InfoIcon aria-hidden="true" />
              </Button>
            </PopoverTrigger>
            <PopoverContent align="end" aria-label="Uitleg bij Uren per maand">
              Geschreven uren per maand, verdeeld over de drie soorten werk.
              November loopt nog.
            </PopoverContent>
          </Popover>
        </ChartCardAction>
      </ChartCardHeader>
      <ChartPlot
        unit="Uren"
        aria-label="Gestapelde staven: uren per maand van juni tot en met november, verdeeld over advies, ontwikkeling en beheer"
      >
        <ChartContainer config={hoursConfig}>
          <BarChart
            data={hoursPerMonth}
            margin={chartMargin}
            accessibilityLayer={false}
          >
            <ChartGrid />
            <ChartXAxis dataKey="month" />
            <ChartYAxis domain={[0, 100]} ticks={[0, 25, 50, 75, 100]} />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <ChartBarStack>
              <ChartBar dataKey="advies" fill="var(--color-advies)" />
              <ChartBar
                dataKey="ontwikkeling"
                fill="var(--color-ontwikkeling)"
              />
              <ChartBar dataKey="beheer" fill="var(--color-beheer)" />
            </ChartBarStack>
          </BarChart>
        </ChartContainer>
      </ChartPlot>
      <ChartLegendContent config={hoursConfig} />
    </ChartCard>
  ),
  play: async ({ canvas, canvasElement, userEvent }) => {
    await expect(
      canvas.getByRole("region", { name: "Uren per maand" })
    ).toBeVisible()
    await expect(
      canvas.getByRole("img", { name: /Gestapelde staven/ })
    ).toBeVisible()
    await expect(
      canvas.getAllByRole("listitem").map((item) => item.textContent)
    ).toEqual(["Advies", "Ontwikkeling", "Beheer"])

    // 6 months x 3 series, drawn without animation.
    await waitFor(() =>
      expect(
        canvasElement.querySelectorAll(".recharts-bar-rectangle path")
      ).toHaveLength(18)
    )

    const trigger = canvas.getByRole("button", {
      name: "Uitleg bij Uren per maand",
    })
    await expect(trigger).toHaveAttribute("aria-expanded", "false")
    await userEvent.click(trigger)
    const body = within(document.body)
    await expect(
      await body.findByRole("dialog", { name: "Uitleg bij Uren per maand" })
    ).toBeVisible()
    await userEvent.keyboard("{Escape}")
    await waitFor(() => expect(body.queryByRole("dialog")).toBeNull())
    await expect(trigger).toHaveAttribute("aria-expanded", "false")
    await expect(trigger).toHaveFocus()

    // Keyboard: Enter opens the toggletip again, Escape closes it.
    await userEvent.keyboard("{Enter}")
    await expect(
      await body.findByRole("dialog", { name: "Uitleg bij Uren per maand" })
    ).toBeVisible()
    await userEvent.keyboard("{Escape}")
    await waitFor(() => expect(body.queryByRole("dialog")).toBeNull())
    await expect(trigger).toHaveFocus()
    trigger.blur()

    // Pointing at October shows the three values in the tooltip.
    const wrapper = canvasElement.querySelector(".recharts-wrapper")
    const october = canvasElement
      .querySelectorAll(".recharts-bar-rectangle path")[4]
      .getBoundingClientRect()
    if (!wrapper) throw new Error("Chart did not render")
    await userEvent.pointer({
      target: wrapper,
      coords: {
        clientX: october.x + october.width / 2,
        clientY: october.y + october.height / 2,
      },
    })
    await waitFor(() =>
      expect(
        canvasElement.querySelector("[data-slot=chart-tooltip]")
      ).toHaveTextContent("oktAdvies50Ontwikkeling35Beheer15")
    )
    await userEvent.unhover(wrapper)
  },
}

const projectsConfig = {
  projecten: { label: "Nieuwe projecten", color: "var(--chart-1)" },
} satisfies ChartConfig

const projectsPerWeek = [
  { week: "wk 40", projecten: 6 },
  { week: "wk 41", projecten: 9 },
  { week: "wk 42", projecten: 7 },
  { week: "wk 43", projecten: 12 },
  { week: "wk 44", projecten: 10 },
  { week: "wk 45", projecten: 8 },
]

export const SingleSeries: Story = {
  name: "Single series",
  render: () => (
    <ChartCard>
      <ChartCardHeader>
        <ChartCardTitle>Nieuwe projecten per week</ChartCardTitle>
        <ChartCardDescription>
          Gemiddeld 8,7 per week; de hoogste week was week 43 met 12.
        </ChartCardDescription>
      </ChartCardHeader>
      <ChartPlot aria-label="Staven: nieuwe projecten per week, week 40 tot en met 45: 6, 9, 7, 12, 10 en 8">
        <ChartContainer config={projectsConfig}>
          <BarChart
            data={projectsPerWeek}
            margin={chartMargin}
            accessibilityLayer={false}
          >
            <ChartGrid />
            <ChartXAxis dataKey="week" />
            <ChartYAxis domain={[0, 12]} ticks={[0, 3, 6, 9, 12]} />
            <ChartBar
              dataKey="projecten"
              fill="var(--color-projecten)"
              valueLabels="last"
            />
          </BarChart>
        </ChartContainer>
      </ChartPlot>
    </ChartCard>
  ),
  play: async ({ canvas, canvasElement }) => {
    await expect(
      canvas.getByRole("region", { name: "Nieuwe projecten per week" })
    ).toBeVisible()
    await waitFor(() =>
      expect(
        canvasElement.querySelectorAll(".recharts-bar-rectangle path")
      ).toHaveLength(6)
    )
    const labels = canvasElement.querySelectorAll(".recharts-label-list text")
    await expect(Array.from(labels).map((label) => label.textContent)).toEqual([
      "8",
    ])
  },
}

export const ProportionBar: Story = {
  name: "Proportion bar",
  render: () => (
    <ChartCard>
      <ChartCardHeader>
        <ChartCardTitle>Status van facturen</ChartCardTitle>
        <ChartCardDescription>
          50 facturen verstuurd in oktober.
        </ChartCardDescription>
      </ChartCardHeader>
      <ChartProportion
        items={[
          { label: "Betaald", value: 31 },
          { label: "Open", value: 13 },
          { label: "Te laat", value: 6 },
        ]}
      />
      <ChartCardFooter>
        Gemiddelde betaaltermijn: <span className="tabular-nums">24 dagen</span>
      </ChartCardFooter>
    </ChartCard>
  ),
  play: async ({ canvas }) => {
    await expect(
      canvas.getAllByRole("listitem").map((item) => item.textContent)
    ).toEqual(["Betaald62 %", "Open26 %", "Te laat12 %"])
  },
}

export const RankedBars: Story = {
  name: "Ranked bars",
  render: () => (
    <ChartCard>
      <ChartCardHeader>
        <ChartCardTitle>Documenten per type</ChartCardTitle>
        <ChartCardDescription>
          Wat er in oktober is aangemaakt, van veel naar weinig.
        </ChartCardDescription>
      </ChartCardHeader>
      <ChartRanking
        items={[
          { label: "Offertes", value: 42 },
          { label: "Facturen", value: 35 },
          { label: "Contracten", value: 18 },
          { label: "Notulen", value: 9 },
        ]}
      />
    </ChartCard>
  ),
  play: async ({ canvas }) => {
    const rows = canvas.getAllByRole("listitem")
    await expect(rows.map((row) => row.textContent)).toEqual([
      "Offertes42",
      "Facturen35",
      "Contracten18",
      "Notulen9",
    ])
  },
}

export const Empty: Story = {
  decorators: [
    (Story) => (
      <div className="w-full max-w-sm">
        <Story />
      </div>
    ),
  ],
  render: () => (
    <ChartCard>
      <ChartCardHeader>
        <ChartCardTitle>Uren per maand</ChartCardTitle>
        <ChartCardDescription>0 uur in november.</ChartCardDescription>
      </ChartCardHeader>
      <ChartEmpty>Nog geen uren geschreven in november.</ChartEmpty>
    </ChartCard>
  ),
  play: async ({ canvas }) => {
    await expect(
      canvas.getByText("Nog geen uren geschreven in november.")
    ).toBeVisible()
    await expect(canvas.queryByRole("img")).toBeNull()
  },
}
