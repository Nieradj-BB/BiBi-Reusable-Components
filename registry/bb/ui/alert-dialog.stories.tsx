import type { Meta, StoryObj } from "@storybook/react-vite"
import { expect, waitFor, within } from "storybook/test"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"

const meta = {
  title: "Components/Overlays/AlertDialog",
  component: AlertDialogContent,
  parameters: { layout: "centered" },
} satisfies Meta<typeof AlertDialogContent>

export default meta
type Story = StoryObj<typeof meta>

/** Opens the dialog, checks focus and Escape, and leaves it open. */
async function openCancelReopen(
  canvasElement: HTMLElement,
  triggerName: string,
  title: string,
  userEvent: Parameters<NonNullable<Story["play"]>>[0]["userEvent"]
) {
  const body = within(document.body)
  const trigger = within(canvasElement).getByRole("button", {
    name: triggerName,
  })

  await userEvent.click(trigger)
  const dialog = await body.findByRole("alertdialog", { name: title })
  await expect(body.getByRole("button", { name: "Annuleren" })).toHaveFocus()

  await userEvent.keyboard("{Escape}")
  await waitFor(() => expect(body.queryByRole("alertdialog")).toBeNull())
  await expect(trigger).toHaveFocus()

  await userEvent.click(trigger)
  await body.findByRole("alertdialog", { name: title })
  return { body, dialog, trigger }
}

export const Destructive: Story = {
  render: () => (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline">Offerte verwijderen</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Offerte renovatie verwijderen?</AlertDialogTitle>
          <AlertDialogDescription>
            <p>
              Het document en de 3 opmerkingen erbij verdwijnen voor iedereen in
              het team. Dit kan niet ongedaan worden gemaakt.
            </p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel />
          <AlertDialogAction variant="destructive">
            Verwijderen
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  ),
  play: async ({ canvasElement, userEvent }) => {
    const { body } = await openCancelReopen(
      canvasElement,
      "Offerte verwijderen",
      "Offerte renovatie verwijderen?",
      userEvent
    )
    await expect(
      body.getByRole("alertdialog", { name: "Offerte renovatie verwijderen?" })
    ).toHaveAccessibleDescription(
      "Het document en de 3 opmerkingen erbij verdwijnen voor iedereen in het team. Dit kan niet ongedaan worden gemaakt."
    )
    await expect(
      body.getByRole("button", { name: "Verwijderen" })
    ).toHaveAttribute("data-slot", "alert-dialog-action")
  },
}

export const Default: Story = {
  render: () => (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button>Factuur versturen</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Factuur 2026-0142 versturen?</AlertDialogTitle>
          <AlertDialogDescription>
            <p>
              De factuur gaat per e-mail naar Noordkade Vastgoed. Daarna kun je
              hem niet meer wijzigen.
            </p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel />
          <AlertDialogAction>Versturen</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  ),
  play: async ({ canvasElement, userEvent }) => {
    const { body, trigger } = await openCancelReopen(
      canvasElement,
      "Factuur versturen",
      "Factuur 2026-0142 versturen?",
      userEvent
    )

    // A click on the scrim does nothing.
    const overlay = document.querySelector<HTMLElement>(
      "[data-slot=alert-dialog-overlay]"
    )
    if (overlay) await userEvent.click(overlay)
    await expect(body.getByRole("alertdialog")).toBeInTheDocument()

    await userEvent.click(body.getByRole("button", { name: "Versturen" }))
    await waitFor(() => expect(body.queryByRole("alertdialog")).toBeNull())
    await expect(trigger).toHaveFocus()

    await userEvent.click(trigger)
    await body.findByRole("alertdialog")
  },
}

export const ConsequenceList: Story = {
  name: "Consequence list",
  render: () => (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline">Toegang intrekken</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Toegang van Lotte Jansen intrekken?
          </AlertDialogTitle>
          <AlertDialogDescription>
            <p>Lotte Jansen kan daarna niet meer:</p>
            <ul className="flex list-disc flex-col gap-2 pl-5 text-foreground">
              <li>projecten en documenten van dit team openen;</li>
              <li>facturen bekijken of versturen;</li>
              <li>meldingen over dit team ontvangen.</li>
            </ul>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel />
          <AlertDialogAction>Toegang intrekken</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  ),
  play: async ({ canvasElement, userEvent }) => {
    const { body } = await openCancelReopen(
      canvasElement,
      "Toegang intrekken",
      "Toegang van Lotte Jansen intrekken?",
      userEvent
    )
    const dialog = body.getByRole("alertdialog")
    await expect(within(dialog).getAllByRole("listitem")).toHaveLength(3)
  },
}
