"use client"

import { useState } from "react"
import { cn } from "~/lib/utils"

type AlertType = "info" | "success" | "warning" | "error"

interface AlertProps {
  type?: AlertType
  message: React.ReactNode
  description?: React.ReactNode
  showIcon?: boolean
  closable?: boolean
  onClose?: () => void
  action?: React.ReactNode
  className?: string
}

const typeStyles: Record<AlertType, string> = {
  info: "bg-blue-50 border-blue-200 text-blue-900 dark:bg-blue-950/40 dark:border-blue-800/60 dark:text-blue-100",
  success:
    "bg-green-50 border-green-200 text-green-900 dark:bg-green-950/40 dark:border-green-800/60 dark:text-green-100",
  warning:
    "bg-amber-50 border-amber-200 text-amber-900 dark:bg-amber-950/40 dark:border-amber-800/60 dark:text-amber-100",
  error: "bg-red-50 border-red-200 text-red-900 dark:bg-red-950/40 dark:border-red-800/60 dark:text-red-100",
}

const iconColorStyles: Record<AlertType, string> = {
  info: "text-blue-500",
  success: "text-green-500",
  warning: "text-amber-500",
  error: "text-red-500",
}

function AlertIcon({ type, className }: { type: AlertType; className?: string }) {
  const cls = cn("size-4 shrink-0", className)
  if (type === "success")
    return (
      <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={cls}>
        <circle cx="8" cy="8" r="6.5" />
        <path d="M5 8.5l2 2 4-4" />
      </svg>
    )
  if (type === "warning")
    return (
      <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={cls}>
        <path d="M8 2L1.5 13.5h13L8 2Z" />
        <path d="M8 6.5v3M8 11h.01" />
      </svg>
    )
  if (type === "error")
    return (
      <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={cls}>
        <circle cx="8" cy="8" r="6.5" />
        <path d="M5.5 5.5l5 5M10.5 5.5l-5 5" />
      </svg>
    )
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={cls}>
      <circle cx="8" cy="8" r="6.5" />
      <path d="M8 7.5V11M8 5h.01" />
    </svg>
  )
}

function Alert({ type = "info", message, description, showIcon, closable, onClose, action, className }: AlertProps) {
  const [visible, setVisible] = useState(true)

  if (!visible) return null

  function handleClose() {
    setVisible(false)
    onClose?.()
  }

  return (
    <div
      role="alert"
      className={cn("flex gap-3 rounded-lg border px-4 py-3 text-sm", typeStyles[type], className)}
    >
      {showIcon && <AlertIcon type={type} className={cn("mt-0.5", iconColorStyles[type])} />}
      <div className="flex-1 min-w-0">
        <div className="font-medium leading-snug">{message}</div>
        {description && <div className="mt-1 text-sm opacity-80 leading-relaxed">{description}</div>}
        {action && <div className="mt-2">{action}</div>}
      </div>
      {closable && (
        <button
          onClick={handleClose}
          aria-label="Close alert"
          className="mt-0.5 shrink-0 rounded opacity-60 transition-opacity hover:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="size-4">
            <path d="M3 3l10 10M13 3L3 13" />
          </svg>
        </button>
      )}
    </div>
  )
}

export { Alert }
export type { AlertType }
