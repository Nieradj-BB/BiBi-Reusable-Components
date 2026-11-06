import { zodResolver } from "@hookform/resolvers/zod"
import type { Meta, StoryObj } from "@storybook/react-vite"
import { useForm } from "react-hook-form"
import { expect, fn, userEvent, waitFor } from "storybook/test"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import { FormActions, FormStack } from "@/components/ui/form-field"
import {
  Form as RhfForm,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form-rhf"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

const clientSchema = z.object({
  client: z.string().trim().min(1, "Vul de naam van de klant in."),
  email: z
    .string()
    .trim()
    .min(1, "Vul een e-mailadres in.")
    .pipe(z.email("Vul een volledig e-mailadres in, zoals naam@bedrijf.nl.")),
  note: z.string(),
})

type ClientValues = z.infer<typeof clientSchema>

const onSave = fn()

function ClientForm() {
  const form = useForm<ClientValues>({
    resolver: zodResolver(clientSchema),
    defaultValues: { client: "", email: "", note: "" },
  })

  return (
    <RhfForm {...form}>
      <FormStack asChild>
        <form
          noValidate
          aria-label="Klant toevoegen"
          onSubmit={form.handleSubmit((values) => onSave(values))}
          onReset={() => form.reset()}
        >
          <FormField
            control={form.control}
            name="client"
            render={({ field }) => (
              <FormItem>
                <FormLabel required>Klantnaam</FormLabel>
                <FormControl>
                  <Input type="text" required {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel required>E-mailadres voor facturen</FormLabel>
                <FormControl>
                  <Input type="email" required {...field} />
                </FormControl>
                <FormDescription>
                  Hier sturen we elke factuur naartoe.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="note"
            render={({ field }) => (
              <FormItem>
                <FormLabel optional>Opmerking</FormLabel>
                <FormControl>
                  <Textarea rows={3} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormActions>
            <Button variant="outline" type="reset">
              Annuleren
            </Button>
            <Button type="submit">Klant toevoegen</Button>
          </FormActions>
        </form>
      </FormStack>
    </RhfForm>
  )
}

const meta = {
  title: "Components/Inputs & forms/Form (react-hook-form)",
  component: ClientForm,
  decorators: [
    (Story) => (
      // Error and help text need the card surface for contrast.
      <div className="w-full max-w-xl rounded-xl bg-card p-4">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ClientForm>

export default meta

type Story = StoryObj<typeof meta>

export const Form: Story = {
  play: async ({ canvas }) => {
    const client = canvas.getByRole("textbox", { name: "Klantnaam" })
    const email = canvas.getByRole("textbox", {
      name: "E-mailadres voor facturen",
    })
    const submit = canvas.getByRole("button", { name: "Klant toevoegen" })

    await expect(email).toHaveAccessibleDescription(
      "Hier sturen we elke factuur naartoe."
    )

    await userEvent.click(submit)
    await waitFor(() => expect(client).toHaveFocus())
    await expect(client).toHaveAttribute("aria-invalid", "true")
    await expect(client).toHaveAccessibleDescription(
      "Vul de naam van de klant in."
    )
    await expect(email).toHaveAccessibleDescription(
      "Hier sturen we elke factuur naartoe. Vul een e-mailadres in."
    )

    await userEvent.type(client, "Van Dijk Bouw")
    await userEvent.type(email, "factuur@vandijkbouw")
    await userEvent.click(submit)
    await waitFor(() => expect(email).toHaveFocus())
    await expect(client).not.toHaveAttribute("aria-invalid")
    await expect(email).toHaveAccessibleDescription(
      "Hier sturen we elke factuur naartoe. Vul een volledig e-mailadres in, zoals naam@bedrijf.nl."
    )

    await userEvent.type(email, ".nl")
    await userEvent.click(submit)
    await waitFor(() =>
      expect(onSave).toHaveBeenCalledWith({
        client: "Van Dijk Bouw",
        email: "factuur@vandijkbouw.nl",
        note: "",
      })
    )
    await expect(canvas.queryAllByRole("alert")).toHaveLength(0)

    await userEvent.click(canvas.getByRole("button", { name: "Annuleren" }))
    await waitFor(() => expect(client).toHaveValue(""))
    await expect(email).toHaveValue("")
    ;(document.activeElement as HTMLElement | null)?.blur()
  },
}
