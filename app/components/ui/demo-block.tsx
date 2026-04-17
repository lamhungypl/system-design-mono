"use client"

import { useState, useEffect } from "react"
import { codeToHtml } from "shiki"
import { cn } from "~/lib/utils"

interface DemoBlockProps {
  title: string
  description?: string
  code: string
  children: React.ReactNode
}

const cache = new Map<string, string>()

async function highlight(code: string): Promise<string> {
  const hit = cache.get(code)
  if (hit) return hit
  const html = await codeToHtml(code, {
    lang: "tsx",
    theme: "github-light",
    colorReplacements: { "#ffffff": "transparent" },
  })
  cache.set(code, html)
  return html
}

export function DemoItem({
  label,
  children,
  className,
}: {
  label: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      {children}
      <span className="text-xs text-muted-foreground">{label}</span>
    </div>
  )
}

export function DemoSection({
  label,
  children,
  className,
}: {
  label: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <p className="text-xs font-medium text-muted-foreground">{label}</p>
      {children}
    </div>
  )
}

export function DemoBlock({ title, description, code, children }: DemoBlockProps) {
  const [open, setOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const [html, setHtml] = useState("")

  useEffect(() => {
    highlight(code).then(setHtml)
  }, [code])

  function copy() {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="rounded-xl border border-border overflow-hidden">
      {/* header */}
      <div className="px-5 pt-4 pb-3 border-b border-border bg-muted/30">
        <h2 className="text-sm font-semibold">{title}</h2>
        {description && (
          <p className="mt-0.5 text-sm text-muted-foreground">{description}</p>
        )}
      </div>

      {/* live preview */}
      <div className="px-6 py-6">{children}</div>

      {/* toolbar */}
      <div className="flex items-center justify-end gap-1 border-t border-border px-3 py-1.5">
        <button
          onClick={() => setOpen((v) => !v)}
          className={cn(
            "inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition-colors",
            "text-muted-foreground hover:bg-accent hover:text-foreground",
            open && "bg-accent text-foreground",
          )}
          aria-label={open ? "Hide code" : "Show code"}
        >
          <CodeIcon />
          {open ? "Hide code" : "Show code"}
        </button>
        <button
          onClick={copy}
          className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          aria-label="Copy code"
        >
          {copied ? <CheckIcon /> : <CopyIcon />}
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>

      {/* collapsible code panel */}
      <div
        className={cn(
          "grid transition-[grid-template-rows] duration-200",
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
        )}
      >
        <div className="overflow-hidden">
          <div
            className="border-t border-border bg-muted/40 overflow-auto max-h-96 text-sm [&_pre]:!m-0 [&_pre]:p-5 [&_pre]:leading-relaxed [&_pre]:!bg-transparent"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        </div>
      </div>
    </div>
  )
}

function CodeIcon() {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="size-3.5"
    >
      <path d="M5 4 1 8l4 4M11 4l4 4-4 4M9 2l-2 12" />
    </svg>
  )
}

function CopyIcon() {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="size-3.5"
    >
      <rect x="6" y="6" width="8" height="8" rx="1.5" />
      <path d="M10 6V3.5A1.5 1.5 0 0 0 8.5 2h-5A1.5 1.5 0 0 0 2 3.5v5A1.5 1.5 0 0 0 3.5 10H6" />
    </svg>
  )
}

function CheckIcon() {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="size-3.5"
    >
      <path d="M2.5 8.5 6 12l7.5-8" />
    </svg>
  )
}
