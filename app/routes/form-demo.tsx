"use client"

import { useState } from "react"
import { cn } from "~/lib/utils"
import { Button } from "~/components/ui/button"
import { Field, FieldLabel, FieldError, FieldGroup } from "~/components/ui/field"

type Status = { type: "success" | "error"; message: string } | null

export default function FormDemo() {
  const [simulateFailure, setSimulateFailure] = useState(false)
  const [status, setStatus] = useState<Status>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setStatus(null)

    // Simulate async request
    await new Promise((r) => setTimeout(r, 800))

    setStatus(
      simulateFailure
        ? { type: "error", message: "Something went wrong. Please check your details and try again." }
        : { type: "success", message: "Your message was sent successfully. We'll be in touch soon." }
    )
    setLoading(false)
  }

  return (
    <div className="p-8">
      <div className="max-w-md">
        <h1 className="text-xl font-semibold">Contact</h1>
        <p className="mt-1 mb-6 text-sm text-muted-foreground">
          Fill out the form below and we'll get back to you.
        </p>

        <form onSubmit={handleSubmit} noValidate>
          {/* Inline status banner */}
          {status && (
            <div
              role="alert"
              aria-live="polite"
              className={cn(
                "mb-6 flex items-start gap-3 rounded-lg border px-4 py-3 text-sm",
                status.type === "success"
                  ? "border-green-200 bg-green-50 text-green-800 dark:border-green-800/40 dark:bg-green-950/30 dark:text-green-300"
                  : "border-destructive/30 bg-destructive/5 text-destructive dark:border-destructive/40 dark:bg-destructive/10",
              )}
            >
              <StatusIcon type={status.type} />
              <span>{status.message}</span>
            </div>
          )}

          <FieldGroup className="gap-5">
            <Field>
              <FieldLabel htmlFor="name">Full name</FieldLabel>
              <Input id="name" name="name" placeholder="Jane Smith" required />
            </Field>

            <Field>
              <FieldLabel htmlFor="email">Email address</FieldLabel>
              <Input id="email" name="email" type="email" placeholder="jane@example.com" required />
            </Field>

            <Field>
              <FieldLabel htmlFor="message">Message</FieldLabel>
              <Textarea id="message" name="message" placeholder="How can we help?" rows={4} required />
            </Field>

            {/* Simulate toggle */}
            <div className="flex items-center justify-between rounded-lg border border-border px-4 py-3">
              <div>
                <p className="text-sm font-medium">Simulate failure</p>
                <p className="text-xs text-muted-foreground">Toggle to test error state</p>
              </div>
              <Switch
                checked={simulateFailure}
                onChange={setSimulateFailure}
                aria-label="Simulate failure"
              />
            </div>

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? "Sending…" : "Send message"}
            </Button>
          </FieldGroup>
        </form>
      </div>
    </div>
  )
}

// ── Primitives ────────────────────────────────────────────────────────────────

function Input({ className, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      className={cn(
        "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs outline-none",
        "placeholder:text-muted-foreground",
        "focus-visible:ring-2 focus-visible:ring-ring",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    />
  )
}

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      className={cn(
        "flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs outline-none",
        "placeholder:text-muted-foreground",
        "focus-visible:ring-2 focus-visible:ring-ring",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "resize-none",
        className,
      )}
      {...props}
    />
  )
}

function Switch({
  checked,
  onChange,
  "aria-label": ariaLabel,
}: {
  checked: boolean
  onChange: (v: boolean) => void
  "aria-label"?: string
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={ariaLabel}
      onClick={() => onChange(!checked)}
      className={cn(
        "relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        checked ? "bg-primary" : "bg-input",
      )}
    >
      <span
        className={cn(
          "pointer-events-none block size-4 rounded-full bg-white shadow-sm transition-transform duration-200",
          checked ? "translate-x-4" : "translate-x-0",
        )}
      />
    </button>
  )
}

function StatusIcon({ type }: { type: "success" | "error" }) {
  if (type === "success") {
    return (
      <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 size-4 shrink-0">
        <circle cx="8" cy="8" r="6.5" />
        <path d="m5 8 2 2 4-4" />
      </svg>
    )
  }
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 size-4 shrink-0">
      <circle cx="8" cy="8" r="6.5" />
      <path d="M8 5v3.5M8 11h.01" />
    </svg>
  )
}
