import type { Meta, StoryObj } from "@storybook/react-vite"
import { CopyIcon, DownloadIcon, PencilIcon, Trash2Icon } from "lucide-react"
import { expect, waitFor, within } from "storybook/test"

import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipShortcut,
  TooltipTrigger,
} from "@/components/ui/tooltip"

const meta = {
  title: "Components/Overlays/Tooltip",
  component: TooltipContent,
  parameters: { layout: "centered" },
  globals: { backgrounds: { value: "card" } },
  decorators: [
    (Story) => (
      <TooltipProvider>
        {/* Room for the tooltip above and below the trigger. */}
        <div className="py-12">
          <Story />
        </div>
      </TooltipProvider>
    ),
  ],
} satisfies Meta<typeof TooltipContent>

export default meta
type Story = StoryObj<typeof meta>

// Top and Bottom show the trigger with a static hover background, as a real
// pointer hover would.
export const Top: Story = {
  render: () => (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          aria-label="Bewerken"
          className="bg-accent"
        >
          <PencilIcon aria-hidden="true" />
        </Button>
      </TooltipTrigger>
      <TooltipContent>Bewerken</TooltipContent>
    </Tooltip>
  ),
  play: async ({ canvas, userEvent }) => {
    const body = within(document.body)
    const trigger = canvas.getByRole("button", { name: "Bewerken" })

    await userEvent.hover(trigger)
    await expect(await body.findByRole("tooltip")).toHaveTextContent("Bewerken")
    await expect(
      document.querySelector("[data-slot=tooltip-content]")
    ).toHaveAttribute("data-side", "top")

    await userEvent.keyboard("{Escape}")
    await waitFor(() => expect(body.queryByRole("tooltip")).toBeNull())

    await userEvent.unhover(trigger)
    await userEvent.hover(trigger)
    await body.findByRole("tooltip")
  },
}

export const Bottom: Story = {
  render: () => (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          aria-label="Downloaden"
          className="bg-accent"
        >
          <DownloadIcon aria-hidden="true" />
        </Button>
      </TooltipTrigger>
      <TooltipContent side="bottom">Downloaden</TooltipContent>
    </Tooltip>
  ),
  play: async ({ canvas, userEvent }) => {
    const body = within(document.body)
    const trigger = canvas.getByRole("button", { name: "Downloaden" })

    await userEvent.hover(trigger)
    await expect(await body.findByRole("tooltip")).toHaveTextContent(
      "Downloaden"
    )
    await expect(
      document.querySelector("[data-slot=tooltip-content]")
    ).toHaveAttribute("data-side", "bottom")

    await userEvent.unhover(trigger)
    await waitFor(() => expect(body.queryByRole("tooltip")).toBeNull())
    await userEvent.hover(trigger)
    await body.findByRole("tooltip")
  },
}

export const ToolbarOnFocus: Story = {
  name: "Toolbar on focus",
  render: () => (
    <div className="inline-flex items-end gap-1">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="icon" aria-label="Bewerken">
            <PencilIcon aria-hidden="true" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Bewerken</TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            aria-label="Kopiëren"
            aria-keyshortcuts="Control+C"
          >
            <CopyIcon aria-hidden="true" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          Kopiëren <TooltipShortcut>Ctrl+C</TooltipShortcut>
        </TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="icon" aria-label="Verwijderen">
            <Trash2Icon aria-hidden="true" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Verwijderen</TooltipContent>
      </Tooltip>
    </div>
  ),
  play: async ({ canvas, userEvent }) => {
    const body = within(document.body)
    const copy = canvas.getByRole("button", { name: "Kopiëren" })

    await userEvent.tab()
    await expect(await body.findByRole("tooltip")).toHaveTextContent("Bewerken")

    await userEvent.tab()
    await expect(copy).toHaveFocus()
    await waitFor(() =>
      expect(body.getByRole("tooltip")).toHaveTextContent("Kopiëren Ctrl+C")
    )
    await expect(copy).toHaveAccessibleDescription("Kopiëren Ctrl+C")

    await userEvent.keyboard("{Escape}")
    await waitFor(() => expect(body.queryByRole("tooltip")).toBeNull())
    await expect(copy).toHaveFocus()

    await userEvent.tab({ shift: true })
    await userEvent.tab()
    await waitFor(() =>
      expect(body.getByRole("tooltip")).toHaveTextContent("Kopiëren Ctrl+C")
    )
  },
}
