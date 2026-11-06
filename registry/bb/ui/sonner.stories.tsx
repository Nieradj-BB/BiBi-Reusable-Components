import type { Meta, StoryObj } from "@storybook/react-vite"
import { toast } from "sonner"
import { expect, fn, userEvent, waitFor, within } from "storybook/test"

import { Button } from "@/components/ui/button"
import { Toaster } from "@/components/ui/sonner"

const meta = {
  title: "Components/Feedback/Toast",
  component: Toaster,
  parameters: {
    docs: { story: { inline: false, iframeHeight: 360 } },
  },
  decorators: [
    (Story) => (
      <div className="min-h-90">
        <Story />
        <Toaster />
      </div>
    ),
  ],
} satisfies Meta<typeof Toaster>

export default meta

type Story = StoryObj<typeof meta>

const onRetry = fn()
const onUndo = fn()

function showSuccess() {
  toast.success("Project Renovatie hoofdkantoor is opgeslagen")
}

function showError() {
  toast.error("Factuur 2026-0142 is niet verstuurd", {
    description:
      "De server reageert niet. Je wijzigingen staan nog in het formulier.",
    duration: Infinity,
    action: { label: "Opnieuw proberen", onClick: onRetry },
  })
}

function showInfo() {
  toast.info("Export gestart", {
    description: "Je krijgt een melding als het bestand klaar is.",
  })
}

function showWithAction() {
  toast.success("Offerte-renovatie.pdf is verwijderd", {
    action: { label: "Ongedaan maken", onClick: onUndo },
  })
}

function showStacked() {
  toast.info("Export gestart", {
    description: "Je krijgt een melding als het bestand klaar is.",
  })
  toast.error("Factuur 2026-0142 is niet verstuurd", {
    description: "De server reageert niet.",
    duration: Infinity,
    action: { label: "Opnieuw proberen", onClick: onRetry },
  })
  toast.success("Project Renovatie hoofdkantoor is opgeslagen")
}

const body = within(document.body)

/** Dismisses toasts left by an earlier story and waits until they are gone. */
async function clearToasts() {
  toast.dismiss()
  await waitFor(() =>
    expect(document.querySelector("[data-sonner-toast]")).toBeNull()
  )
}

/** Finds the toast that holds `text` once its entrance has finished. */
async function findToast(text: string) {
  const title = await body.findByText(text)
  const item = title.closest<HTMLElement>("[data-sonner-toast]")
  await expect(item).not.toBeNull()
  await waitFor(() => {
    expect(item).toHaveAttribute("data-mounted", "true")
    expect(getComputedStyle(item as HTMLElement).opacity).toBe("1")
  })
  return within(item as HTMLElement)
}

export const Success: Story = {
  render: () => (
    <Button variant="outline" onClick={showSuccess}>
      Toon melding
    </Button>
  ),
  play: async ({ canvas }) => {
    await clearToasts()
    await userEvent.click(canvas.getByRole("button", { name: "Toon melding" }))
    const item = await findToast("Project Renovatie hoofdkantoor is opgeslagen")
    await expect(body.getByRole("region", { name: /Meldingen/ })).toBeVisible()

    await userEvent.click(item.getByRole("button", { name: "Melding sluiten" }))
    await waitFor(() =>
      expect(
        body.queryByText("Project Renovatie hoofdkantoor is opgeslagen")
      ).not.toBeInTheDocument()
    )
  },
}

export const Error: Story = {
  render: () => (
    <Button variant="outline" onClick={showError}>
      Toon melding
    </Button>
  ),
  play: async ({ canvas }) => {
    await clearToasts()
    await userEvent.click(canvas.getByRole("button", { name: "Toon melding" }))
    const item = await findToast("Factuur 2026-0142 is niet verstuurd")
    await expect(
      item.getByText(
        "De server reageert niet. Je wijzigingen staan nog in het formulier."
      )
    ).toBeVisible()
    await expect(
      item.getByRole("button", { name: "Opnieuw proberen" })
    ).toBeVisible()
    await expect(
      item.getByRole("button", { name: "Melding sluiten" })
    ).toBeVisible()
  },
}

export const Info: Story = {
  render: () => (
    <Button variant="outline" onClick={showInfo}>
      Toon melding
    </Button>
  ),
  play: async ({ canvas }) => {
    await clearToasts()
    await userEvent.click(canvas.getByRole("button", { name: "Toon melding" }))
    const item = await findToast("Export gestart")
    await expect(
      item.getByText("Je krijgt een melding als het bestand klaar is.")
    ).toBeVisible()

    const toastElement = body
      .getByText("Export gestart")
      .closest<HTMLElement>("[data-sonner-toast]")
    await userEvent.tab()
    await expect(toastElement).toHaveFocus()
    await userEvent.tab()
    await expect(
      item.getByRole("button", { name: "Melding sluiten" })
    ).toHaveFocus()
    await userEvent.keyboard("{Enter}")
    await waitFor(() =>
      expect(body.queryByText("Export gestart")).not.toBeInTheDocument()
    )
  },
}

export const WithAction: Story = {
  name: "With action",
  render: () => (
    <Button variant="outline" onClick={showWithAction}>
      Toon melding
    </Button>
  ),
  play: async ({ canvas }) => {
    await clearToasts()
    const trigger = canvas.getByRole("button", { name: "Toon melding" })
    await userEvent.click(trigger)
    let item = await findToast("Offerte-renovatie.pdf is verwijderd")
    await userEvent.click(item.getByRole("button", { name: "Ongedaan maken" }))
    await expect(onUndo).toHaveBeenCalled()
    await waitFor(() =>
      expect(
        body.queryByText("Offerte-renovatie.pdf is verwijderd")
      ).not.toBeInTheDocument()
    )

    await userEvent.click(trigger)
    item = await findToast("Offerte-renovatie.pdf is verwijderd")
    await expect(
      item.getByRole("button", { name: "Ongedaan maken" })
    ).toBeVisible()
  },
}

export const Stacked: Story = {
  render: () => (
    <Button variant="outline" onClick={showStacked}>
      Toon meldingen
    </Button>
  ),
  play: async ({ canvas }) => {
    await clearToasts()
    await userEvent.click(
      canvas.getByRole("button", { name: "Toon meldingen" })
    )
    await findToast("Project Renovatie hoofdkantoor is opgeslagen")
    await findToast("Factuur 2026-0142 is niet verstuurd")
    await findToast("Export gestart")

    const top = (text: string) =>
      body
        .getByText(text)
        .closest("[data-sonner-toast]")
        ?.getBoundingClientRect().top ?? 0
    await waitFor(() => {
      expect(top("Export gestart")).toBeLessThan(
        top("Factuur 2026-0142 is niet verstuurd")
      )
      expect(top("Factuur 2026-0142 is niet verstuurd")).toBeLessThan(
        top("Project Renovatie hoofdkantoor is opgeslagen")
      )
    })
  },
}
