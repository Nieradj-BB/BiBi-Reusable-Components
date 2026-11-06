import * as React from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"
import { PlusIcon } from "lucide-react"
import { expect, waitFor, within } from "storybook/test"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  InfoPopover,
  Popover,
  PopoverClose,
  PopoverContent,
  PopoverFooter,
  PopoverTerm,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"

const meta = {
  title: "Components/Overlays/Popover",
  component: PopoverContent,
  globals: { backgrounds: { value: "card" } },
} satisfies Meta<typeof PopoverContent>

export default meta
type Story = StoryObj<typeof meta>

function InfoBar({
  className,
  triggerClassName,
}: {
  className?: string
  triggerClassName?: string
}) {
  return (
    <div
      className={cn(
        "flex w-fit max-w-full items-center justify-between gap-2 text-sm font-semibold text-primary",
        className
      )}
    >
      <span>Openstaand bedrag</span>
      <InfoPopover topic="openstaand bedrag" className={triggerClassName}>
        <p>
          <PopoverTerm>Openstaand:</PopoverTerm> verstuurde facturen die nog
          niet zijn betaald.
        </p>
        <p>
          <PopoverTerm>Vervallen:</PopoverTerm> facturen waarvan de
          betaaltermijn voorbij is.
        </p>
      </InfoPopover>
    </div>
  )
}

const infoLabel = "Uitleg bij openstaand bedrag"

export const InfoOpen: Story = {
  name: "Info open",
  render: () => <InfoBar className="w-80" />,
  play: async ({ canvas, userEvent }) => {
    const body = within(document.body)
    const trigger = canvas.getByRole("button", { name: infoLabel })
    await expect(trigger).toHaveAttribute("aria-expanded", "false")

    await userEvent.click(trigger)
    const panel = await body.findByRole("dialog", { name: infoLabel })
    await expect(trigger).toHaveAttribute("aria-expanded", "true")
    await expect(trigger).toHaveAttribute("aria-controls", panel.id)

    await userEvent.keyboard("{Escape}")
    await waitFor(() => expect(body.queryByRole("dialog")).toBeNull())
    await expect(trigger).toHaveFocus()

    // An outside click closes it too.
    await userEvent.click(trigger)
    await body.findByRole("dialog", { name: infoLabel })
    await userEvent.click(canvas.getByText("Openstaand bedrag"))
    await waitFor(() => expect(body.queryByRole("dialog")).toBeNull())

    await userEvent.click(trigger)
    await body.findByRole("dialog", { name: infoLabel })
  },
}

export const InfoTriggerHover: Story = {
  name: "Info trigger hover",
  // Static preview of the hover look; real hover shows the same background.
  render: () => <InfoBar triggerClassName="bg-accent" />,
  play: async ({ canvas, userEvent }) => {
    const trigger = canvas.getByRole("button", { name: infoLabel })
    await userEvent.hover(trigger)
    // Opens on click, Enter or Space, never on hover.
    await expect(trigger).toHaveAttribute("aria-expanded", "false")
    await expect(within(document.body).queryByRole("dialog")).toBeNull()
  },
}

export const InfoTriggerFocus: Story = {
  name: "Info trigger focus",
  render: () => <InfoBar />,
  play: async ({ canvas, userEvent }) => {
    const body = within(document.body)
    const trigger = canvas.getByRole("button", { name: infoLabel })

    await userEvent.tab()
    await expect(trigger).toHaveFocus()

    await userEvent.keyboard("{Enter}")
    await body.findByRole("dialog", { name: infoLabel })
    await userEvent.keyboard("{Escape}")
    await waitFor(() => expect(body.queryByRole("dialog")).toBeNull())
    await expect(trigger).toHaveFocus()
    await expect(trigger).toHaveAttribute("aria-expanded", "false")
  },
}

function LabelForm() {
  const [labels, setLabels] = React.useState<string[]>([])
  const [name, setName] = React.useState("")

  return (
    <div className="flex flex-col items-start gap-3">
      <Popover onOpenChange={() => setName("")}>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm">
            <PlusIcon aria-hidden="true" />
            Label toevoegen
          </Button>
        </PopoverTrigger>
        <PopoverContent aria-label="Label toevoegen" className="w-72 gap-3">
          <div className="flex w-full min-w-0 flex-col gap-1">
            <Label htmlFor="popover-label-name" className="mb-1">
              Naam van het label
            </Label>
            <Input
              id="popover-label-name"
              placeholder="Bijvoorbeeld: Spoed"
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
          </div>
          <PopoverFooter>
            <PopoverClose asChild>
              <Button variant="ghost" size="sm">
                Annuleren
              </Button>
            </PopoverClose>
            <PopoverClose asChild>
              <Button
                size="sm"
                onClick={() => {
                  if (name.trim()) setLabels([...labels, name.trim()])
                }}
              >
                Toevoegen
              </Button>
            </PopoverClose>
          </PopoverFooter>
        </PopoverContent>
      </Popover>
      {labels.length > 0 && (
        <ul aria-label="Labels" className="flex flex-wrap gap-2">
          {labels.map((label) => (
            <li key={label}>
              <Badge>{label}</Badge>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export const Form: Story = {
  render: () => <LabelForm />,
  play: async ({ canvas, userEvent }) => {
    const body = within(document.body)
    const trigger = canvas.getByRole("button", { name: "Label toevoegen" })

    await userEvent.click(trigger)
    await body.findByRole("dialog", { name: "Label toevoegen" })
    const field = body.getByLabelText("Naam van het label")
    await waitFor(() => expect(field).toHaveFocus())

    await userEvent.type(field, "Spoed")
    await userEvent.click(body.getByRole("button", { name: "Toevoegen" }))
    await waitFor(() => expect(body.queryByRole("dialog")).toBeNull())
    await expect(trigger).toHaveFocus()
    await expect(
      canvas.getByRole("list", { name: "Labels" })
    ).toHaveTextContent("Spoed")

    await userEvent.click(trigger)
    await body.findByRole("dialog", { name: "Label toevoegen" })
  },
}
