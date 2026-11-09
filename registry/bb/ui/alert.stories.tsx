import type { Meta, StoryObj } from "@storybook/react-vite"
import {
  CircleAlertIcon,
  CircleCheckIcon,
  InfoIcon,
  TriangleAlertIcon,
} from "lucide-react"
import { expect, fn, userEvent } from "storybook/test"

import {
  Alert,
  AlertAction,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"
import { Button } from "@/components/ui/button"

const meta = {
  title: "Components/Feedback/Alert",
  component: Alert,
  // Alerts sit on card surfaces: destructive text needs the white surface
  // for 4.5:1 contrast.
  decorators: [
    (Story) => (
      <div className="w-full max-w-xl rounded-xl border border-border bg-card p-4">
        <Story />
      </div>
    ),
  ],
  argTypes: {
    variant: {
      control: "select",
      options: ["info", "success", "warning", "destructive"],
    },
    size: { control: "select", options: ["default", "compact"] },
  },
} satisfies Meta<typeof Alert>

export default meta

type Story = StoryObj<typeof meta>

const onExtend = fn()
const onLater = fn()
const onEditAddress = fn()

export const Info: Story = {
  args: {
    variant: "info",
    children: (
      <>
        <InfoIcon aria-hidden="true" />
        <AlertDescription>
          Bedragen zijn exclusief btw. Concepten tellen niet mee in de totalen.
        </AlertDescription>
      </>
    ),
  },
  play: async ({ canvas }) => {
    const alert = canvas.getByRole("note")
    await expect(alert).toHaveAttribute("data-variant", "info")
    await expect(alert.querySelector("svg")).toHaveAttribute(
      "aria-hidden",
      "true"
    )
  },
}

export const Warning: Story = {
  args: {
    variant: "warning",
    children: (
      <>
        <TriangleAlertIcon aria-hidden="true" />
        <AlertDescription>
          Het contract met Jansen Bouw loopt over 14 dagen af. Verleng het op
          tijd, anders stopt de facturatie.
        </AlertDescription>
      </>
    ),
  },
  play: async ({ canvas }) => {
    const alert = canvas.getByRole("status")
    await expect(alert).toHaveClass("border-warning")
    await expect(alert).toHaveClass("text-foreground")
  },
}

export const Destructive: Story = {
  args: {
    variant: "destructive",
    children: (
      <>
        <CircleAlertIcon aria-hidden="true" />
        <AlertDescription>
          Factuur 2026-044 is niet verstuurd: het e-mailadres van Dekker
          Logistiek klopt niet. Pas het adres aan en verstuur de factuur
          opnieuw.
        </AlertDescription>
      </>
    ),
  },
  play: async ({ canvas }) => {
    const alert = canvas.getByRole("alert")
    await expect(alert).toHaveAttribute("data-variant", "destructive")
    await expect(alert).toHaveTextContent("Factuur 2026-044 is niet verstuurd")
  },
}

export const Success: Story = {
  args: {
    variant: "success",
    children: (
      <>
        <CircleCheckIcon aria-hidden="true" />
        <AlertDescription>
          Alle 48 facturen van oktober zijn verstuurd.
        </AlertDescription>
      </>
    ),
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("status")).toHaveAttribute(
      "data-variant",
      "success"
    )
  },
}

export const WarningWithTitleAndAction: Story = {
  name: "Warning with title and action",
  args: {
    variant: "warning",
    children: (
      <>
        <TriangleAlertIcon aria-hidden="true" />
        <AlertTitle>Contract loopt bijna af</AlertTitle>
        <AlertDescription>
          Het contract met Jansen Bouw loopt af op 18 november 2026. Verleng
          het, of zet de facturatie stop.
        </AlertDescription>
        <AlertAction>
          <Button variant="outline" size="sm" onClick={onExtend}>
            Contract verlengen
          </Button>
          <Button variant="ghost" size="sm" onClick={onLater}>
            Later
          </Button>
        </AlertAction>
      </>
    ),
  },
  play: async ({ canvas }) => {
    const alert = canvas.getByRole("status")
    await expect(alert).toHaveTextContent("Contract loopt bijna af")

    // Title, text and actions share the column next to the 16px icon.
    const left = (selector: string) =>
      alert.querySelector(selector)?.getBoundingClientRect().left ?? 0
    const iconRight = alert.querySelector("svg")?.getBoundingClientRect().right
    await expect(left('[data-slot="alert-title"]')).toBe((iconRight ?? 0) + 12)
    await expect(left('[data-slot="alert-description"]')).toBe(
      left('[data-slot="alert-title"]')
    )
    await expect(left('[data-slot="alert-action"]')).toBe(
      left('[data-slot="alert-title"]')
    )

    await userEvent.tab()
    await expect(
      canvas.getByRole("button", { name: "Contract verlengen" })
    ).toHaveFocus()
    await userEvent.keyboard("{Enter}")
    await expect(onExtend).toHaveBeenCalled()

    await userEvent.click(canvas.getByRole("button", { name: "Later" }))
    await expect(onLater).toHaveBeenCalled()
    ;(document.activeElement as HTMLElement | null)?.blur()
  },
}

export const DestructiveWithTitleAndAction: Story = {
  name: "Destructive with title and action",
  args: {
    variant: "destructive",
    children: (
      <>
        <CircleAlertIcon aria-hidden="true" />
        <AlertTitle>Factuur niet verstuurd</AlertTitle>
        <AlertDescription>
          Het e-mailadres van Dekker Logistiek klopt niet. De factuur wordt
          verstuurd zodra het adres is aangepast.
        </AlertDescription>
        <AlertAction>
          <Button variant="outline" size="sm" onClick={onEditAddress}>
            E-mailadres aanpassen
          </Button>
        </AlertAction>
      </>
    ),
  },
  play: async ({ canvas }) => {
    const alert = canvas.getByRole("alert")
    await expect(alert).toHaveTextContent("Factuur niet verstuurd")
    await userEvent.click(
      canvas.getByRole("button", { name: "E-mailadres aanpassen" })
    )
    await expect(onEditAddress).toHaveBeenCalled()
    ;(document.activeElement as HTMLElement | null)?.blur()
  },
}

export const Compact: Story = {
  args: {
    variant: "info",
    size: "compact",
    children: (
      <>
        <InfoIcon aria-hidden="true" />
        <AlertDescription>
          Wijzigingen worden automatisch opgeslagen.
        </AlertDescription>
      </>
    ),
  },
  play: async ({ canvas }) => {
    const alert = canvas.getByRole("note")
    await expect(alert).toHaveAttribute("data-size", "compact")
    await expect(alert).toHaveClass("py-2")
  },
}
