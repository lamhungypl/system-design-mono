"use client"

import { useEffect, useRef } from "react"
import { cn } from "~/lib/utils"

interface DialogProps {
  open: boolean
  onClose: () => void
  children: React.ReactNode
  className?: string
}

function Dialog({ open, onClose, children, className }: DialogProps) {
  const ref = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (open) {
      if (!el.open) el.showModal()
    } else {
      if (el.open) el.close()
    }
  }, [open])

  // Sync native close (Escape key) back to state
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const handle = () => onClose()
    el.addEventListener("close", handle)
    return () => el.removeEventListener("close", handle)
  }, [onClose])

  // Close on backdrop click
  function handleClick(e: React.MouseEvent<HTMLDialogElement>) {
    if (e.target === ref.current) onClose()
  }

  return (
    <dialog
      ref={ref}
      onClick={handleClick}
      className={cn(
        // Reset browser default styles then apply ours
        "m-auto w-full max-w-md rounded-xl border border-border bg-card p-6 shadow-xl outline-none",
        "backdrop:bg-black/40 backdrop:backdrop-blur-[2px]",
        className,
      )}
    >
      {children}
    </dialog>
  )
}

function DialogHeader({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div className="flex-1">{children}</div>
      <button
        onClick={onClose}
        aria-label="Close dialog"
        className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="size-4">
          <path d="M3 3l10 10M13 3L3 13" />
        </svg>
      </button>
    </div>
  )
}

function DialogTitle({ className, ...props }: React.ComponentProps<"h2">) {
  return (
    <h2
      className={cn("text-base font-semibold text-foreground", className)}
      {...props}
    />
  )
}

function DialogDescription({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p
      className={cn("mt-1.5 text-sm text-muted-foreground leading-relaxed", className)}
      {...props}
    />
  )
}

function DialogFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("mt-6 flex items-center justify-end gap-2", className)}
      {...props}
    />
  )
}

export { Dialog, DialogHeader, DialogTitle, DialogDescription, DialogFooter }
