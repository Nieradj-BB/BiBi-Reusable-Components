import * as React from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"
import { expect, waitFor, within } from "storybook/test"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogBody,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogError,
  DialogFooter,
  DialogHeader,
  DialogHint,
  DialogStep,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

const meta = {
  title: "Components/Overlays/Dialog",
  component: DialogContent,
  parameters: { layout: "centered" },
} satisfies Meta<typeof DialogContent>

export default meta
type Story = StoryObj<typeof meta>

function Field({ children }: { children: React.ReactNode }) {
  return <div className="flex w-full min-w-0 flex-col gap-1">{children}</div>
}

function FormDialog() {
  const [open, setOpen] = React.useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Project toevoegen</Button>
      </DialogTrigger>
      <DialogContent
        onKeyDown={(event) => {
          if (event.key === "Enter" && (event.ctrlKey || event.metaKey)) {
            setOpen(false)
          }
        }}
      >
        <DialogHeader>
          <DialogTitle>Project toevoegen</DialogTitle>
          <DialogDescription>
            Het project verschijnt direct in het overzicht van je team.
          </DialogDescription>
        </DialogHeader>
        <DialogBody>
          <Field>
            <Label htmlFor="dialog-form-name" className="mb-1">
              Projectnaam
            </Label>
            <Input
              id="dialog-form-name"
              defaultValue="Renovatie hoofdkantoor"
            />
          </Field>
          <Field>
            <Label htmlFor="dialog-form-client" className="mb-1">
              Klant
            </Label>
            <Input
              id="dialog-form-client"
              placeholder="Bijvoorbeeld: Van Dijk Bouw"
              aria-describedby="dialog-form-client-help"
            />
            <p
              id="dialog-form-client-help"
              className="text-xs text-muted-foreground"
            >
              Zoals de klant op de factuur staat.
            </p>
          </Field>
          <Field>
            <Label htmlFor="dialog-form-note" className="mb-1">
              Omschrijving
            </Label>
            <Textarea id="dialog-form-note" />
          </Field>
        </DialogBody>
        <DialogFooter>
          <DialogHint>Ctrl+Enter slaat op</DialogHint>
          <DialogClose asChild>
            <Button variant="outline">Annuleren</Button>
          </DialogClose>
          <Button
            aria-keyshortcuts="Control+Enter Meta+Enter"
            onClick={() => setOpen(false)}
          >
            Opslaan
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export const Form: Story = {
  render: () => <FormDialog />,
  play: async ({ canvas, userEvent }) => {
    const body = within(document.body)
    const trigger = canvas.getByRole("button", { name: "Project toevoegen" })

    await userEvent.click(trigger)
    const dialog = await body.findByRole("dialog", {
      name: "Project toevoegen",
    })
    await expect(dialog).toHaveAccessibleDescription(
      "Het project verschijnt direct in het overzicht van je team."
    )
    await expect(body.getByLabelText("Projectnaam")).toHaveFocus()

    // A click on the scrim does not close the dialog.
    const overlay = document.querySelector<HTMLElement>(
      "[data-slot=dialog-overlay]"
    )
    if (overlay) await userEvent.click(overlay)
    await expect(dialog).toBeInTheDocument()

    await userEvent.keyboard("{Escape}")
    await waitFor(() => expect(body.queryByRole("dialog")).toBeNull())
    await expect(trigger).toHaveFocus()

    await userEvent.click(trigger)
    await body.findByRole("dialog", { name: "Project toevoegen" })
    await userEvent.keyboard("{Control>}{Enter}{/Control}")
    await waitFor(() => expect(body.queryByRole("dialog")).toBeNull())

    await userEvent.click(trigger)
    await body.findByRole("dialog", { name: "Project toevoegen" })
    await userEvent.click(body.getByRole("button", { name: "Venster sluiten" }))
    await waitFor(() => expect(body.queryByRole("dialog")).toBeNull())
    await expect(trigger).toHaveFocus()

    await userEvent.click(trigger)
    await body.findByRole("dialog", { name: "Project toevoegen" })
  },
}

function ValidationDialog() {
  const [name, setName] = React.useState("")
  const [nameError, setNameError] = React.useState(false)
  const [saveError, setSaveError] = React.useState(false)
  const nameRef = React.useRef<HTMLInputElement>(null)

  function save() {
    if (name.trim() === "") {
      setNameError(true)
      nameRef.current?.focus()
      return
    }
    setNameError(false)
    // The story simulates a save that fails on the server.
    setSaveError(true)
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Project toevoegen</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Project toevoegen</DialogTitle>
          <DialogDescription>
            Het project verschijnt direct in het overzicht van je team.
          </DialogDescription>
        </DialogHeader>
        <DialogBody>
          <Field>
            <Label htmlFor="dialog-validation-name" className="mb-1">
              Projectnaam
            </Label>
            <Input
              ref={nameRef}
              id="dialog-validation-name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              aria-invalid={nameError || undefined}
              aria-describedby={
                nameError ? "dialog-validation-name-error" : undefined
              }
            />
            {nameError && (
              <p
                id="dialog-validation-name-error"
                className="text-sm text-destructive"
              >
                Vul een projectnaam in.
              </p>
            )}
          </Field>
          <Field>
            <Label htmlFor="dialog-validation-client" className="mb-1">
              Klant
            </Label>
            <Input id="dialog-validation-client" defaultValue="Van Dijk Bouw" />
          </Field>
          {saveError && (
            <DialogError>
              Het project is niet opgeslagen. Probeer het opnieuw.
            </DialogError>
          )}
        </DialogBody>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Annuleren</Button>
          </DialogClose>
          <Button onClick={save}>Opslaan</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export const ValidationError: Story = {
  name: "Validation error",
  render: () => <ValidationDialog />,
  play: async ({ canvas, userEvent }) => {
    const body = within(document.body)
    await userEvent.click(
      canvas.getByRole("button", { name: "Project toevoegen" })
    )
    await body.findByRole("dialog", { name: "Project toevoegen" })
    const name = body.getByLabelText("Projectnaam")
    const save = body.getByRole("button", { name: "Opslaan" })

    await userEvent.click(save)
    await expect(name).toHaveAttribute("aria-invalid", "true")
    await expect(name).toHaveAccessibleDescription("Vul een projectnaam in.")
    await expect(name).toHaveFocus()

    await userEvent.type(name, "Renovatie")
    await userEvent.click(save)
    await expect(body.getByRole("alert")).toHaveTextContent(
      "Het project is niet opgeslagen. Probeer het opnieuw."
    )
    // A failed save keeps the input.
    await expect(name).toHaveValue("Renovatie")

    await userEvent.clear(name)
    await userEvent.click(save)
    await expect(name).toHaveAttribute("aria-invalid", "true")
  },
}

function SubmittingDialog() {
  const [open, setOpen] = React.useState(false)
  const [submitting, setSubmitting] = React.useState(false)

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        // The dialog cannot close until sending finishes.
        if (!submitting) setOpen(next)
      }}
    >
      <DialogTrigger asChild>
        <Button>Factuur versturen</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Factuur versturen</DialogTitle>
          <DialogDescription>
            De factuur gaat per e-mail naar de contactpersoon van de klant.
          </DialogDescription>
        </DialogHeader>
        <DialogBody>
          <Field>
            <Label htmlFor="dialog-submitting-mail" className="mb-1">
              E-mailadres
            </Label>
            <Input
              id="dialog-submitting-mail"
              type="email"
              defaultValue="administratie@noordkade.example"
            />
          </Field>
        </DialogBody>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Annuleren</Button>
          </DialogClose>
          <Button aria-busy={submitting} onClick={() => setSubmitting(true)}>
            {submitting ? "Versturen…" : "Versturen"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export const Submitting: Story = {
  render: () => <SubmittingDialog />,
  play: async ({ canvas, userEvent }) => {
    const body = within(document.body)
    await userEvent.click(
      canvas.getByRole("button", { name: "Factuur versturen" })
    )
    const dialog = await body.findByRole("dialog", {
      name: "Factuur versturen",
    })

    await userEvent.click(body.getByRole("button", { name: "Versturen" }))
    const submit = body.getByRole("button", { name: "Versturen…" })
    await expect(submit).toBeEnabled()

    await userEvent.keyboard("{Escape}")
    await expect(dialog).toBeInTheDocument()
    await userEvent.click(body.getByRole("button", { name: "Annuleren" }))
    await expect(dialog).toBeInTheDocument()
  },
}

const steps = [
  {
    title: "Projecten aanmaken",
    points: [
      "Kies Project toevoegen rechtsboven in het overzicht.",
      "Geef het project een naam en koppel de klant.",
      "Je kunt de gegevens later altijd nog aanpassen.",
    ],
  },
  {
    title: "Documenten koppelen",
    points: [
      "Sleep een document naar een project, of kies het via Document toevoegen.",
      "Een document kan bij meer projecten horen; het staat maar op een plek opgeslagen.",
      "Iedereen in het projectteam ziet het document zodra het gekoppeld is.",
      "Ontkoppelen verwijdert niets: het document blijft in Documenten staan.",
      "Facturen koppel je niet hier, die horen bij de klant.",
    ],
  },
  {
    title: "Facturen versturen",
    points: [
      "Open de klant en kies Factuur maken.",
      "Controleer het bedrag en de vervaldatum voordat je verstuurt.",
    ],
  },
  {
    title: "Team uitnodigen",
    points: [
      "Nodig collega's uit via Team en dan Uitnodigen.",
      "Zij zien alleen de projecten waarvoor ze zijn uitgenodigd.",
    ],
  },
]

function StepsDialog() {
  const [step, setStep] = React.useState(0)
  const current = steps[step]
  const last = step === steps.length - 1

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Uitleg bekijken</Button>
      </DialogTrigger>
      <DialogContent size="xl" layout="steps" closeLabel="Uitleg sluiten">
        <DialogHeader>
          <DialogStep>
            {step + 1} van {steps.length}
          </DialogStep>
          <DialogTitle>{current.title}</DialogTitle>
        </DialogHeader>
        <DialogBody role="region" aria-label={`Uitleg, stap ${step + 1}`}>
          <DialogDescription
            asChild
            className="flex list-disc flex-col gap-2 pl-5 text-foreground"
          >
            <ul>
              {current.points.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
          </DialogDescription>
        </DialogBody>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="ghost">Overslaan</Button>
          </DialogClose>
          <div className="ml-auto flex gap-2">
            <Button
              variant="outline"
              disabled={step === 0}
              onClick={() => setStep(step - 1)}
            >
              Vorige
            </Button>
            {last ? (
              <DialogClose asChild>
                <Button>Klaar</Button>
              </DialogClose>
            ) : (
              <Button onClick={() => setStep(step + 1)}>Volgende</Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export const Steps: Story = {
  render: () => <StepsDialog />,
  play: async ({ canvas, userEvent }) => {
    const body = within(document.body)
    const trigger = canvas.getByRole("button", { name: "Uitleg bekijken" })

    await userEvent.click(trigger)
    await body.findByRole("dialog", { name: "Projecten aanmaken" })
    await expect(body.getByText("1 van 4")).toBeVisible()
    await expect(body.getByRole("button", { name: "Vorige" })).toBeDisabled()

    await userEvent.click(body.getByRole("button", { name: "Volgende" }))
    await expect(
      body.getByRole("dialog", { name: "Documenten koppelen" })
    ).toBeVisible()
    await expect(
      body.getByRole("region", { name: "Uitleg, stap 2" })
    ).toHaveAttribute("tabindex", "0")

    await userEvent.keyboard("{Escape}")
    await waitFor(() => expect(body.queryByRole("dialog")).toBeNull())
    await expect(trigger).toHaveFocus()

    await userEvent.click(trigger)
    await body.findByRole("dialog", { name: "Documenten koppelen" })
  },
}
