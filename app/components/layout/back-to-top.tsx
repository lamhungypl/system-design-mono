"use client"

import { useEffect, useState } from "react"
import { Affix } from "~/components/ui/affix"
import { cn } from "~/lib/utils"

export function BackToTop() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    function check() {
      setVisible(window.scrollY > 240)
    }
    check()
    window.addEventListener("scroll", check, { passive: true })
    return () => window.removeEventListener("scroll", check)
  }, [])

  if (!visible) return null

  return (
    <div className="pointer-events-none fixed bottom-0 right-0 z-40 p-5">
      <Affix offsetBottom={16}>
        <button
          type="button"
          onClick={() =>
            window.scrollTo({ top: 0, behavior: "smooth" })
          }
          className={cn(
            "pointer-events-auto flex size-10 items-center justify-center rounded-full border border-border bg-card shadow-lg transition-all",
            "hover:bg-accent hover:text-accent-foreground hover:-translate-y-0.5",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          )}
          aria-label="Back to top"
        >
          <svg
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="size-4"
          >
            <path d="M8 13V3M3 8l5-5 5 5" />
          </svg>
        </button>
      </Affix>
    </div>
  )
}
