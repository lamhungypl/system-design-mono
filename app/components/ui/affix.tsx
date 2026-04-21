"use client"

import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from "react"
import { cn } from "~/lib/utils"

interface AffixProps {
  /** Pin to the top when scrolled past — number of pixels from the target top. */
  offsetTop?: number
  /** Pin to the bottom when scrolled below — number of pixels from the target bottom. */
  offsetBottom?: number
  /** Scroll container. Defaults to window. */
  target?: () => HTMLElement | Window | null
  /** Fires when the affixed state changes. */
  onChange?: (affixed: boolean) => void
  /** Optional z-index. Defaults to 10. */
  zIndex?: number
  children: React.ReactNode
  className?: string
}

const useIsoLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect

interface TargetRect {
  top: number
  bottom: number
  left: number
  width: number
}

function getTargetRect(el: HTMLElement | Window): TargetRect {
  if (el instanceof Window) {
    return { top: 0, bottom: window.innerHeight, left: 0, width: window.innerWidth }
  }
  const r = el.getBoundingClientRect()
  return { top: r.top, bottom: r.bottom, left: r.left, width: r.width }
}

function Affix({
  offsetTop,
  offsetBottom,
  target,
  onChange,
  zIndex = 10,
  children,
  className,
}: AffixProps) {
  const placeholderRef = useRef<HTMLDivElement | null>(null)
  const [affixed, setAffixed] = useState(false)
  const [rect, setRect] = useState<{ width: number; height: number; left: number } | null>(null)
  const [targetTop, setTargetTop] = useState(0)
  const [targetBottom, setTargetBottom] = useState(0)

  const pinTop = offsetTop !== undefined ? offsetTop : null
  const pinBottom = offsetBottom !== undefined ? offsetBottom : null

  const targetFnRef = useRef(target)
  targetFnRef.current = target
  const onChangeRef = useRef(onChange)
  onChangeRef.current = onChange

  useIsoLayoutEffect(() => {
    const placeholder = placeholderRef.current
    if (!placeholder) return

    let currentTarget: HTMLElement | Window | null = null

    function compute() {
      if (!placeholder) return
      const resolved = targetFnRef.current?.() ?? window
      if (resolved !== currentTarget) {
        if (currentTarget) currentTarget.removeEventListener("scroll", compute)
        currentTarget = resolved
        currentTarget.addEventListener("scroll", compute, { passive: true })
      }

      const phRect = placeholder.getBoundingClientRect()
      const tgtRect = getTargetRect(currentTarget)

      let shouldAffix = false
      if (pinTop !== null) {
        shouldAffix = phRect.top - tgtRect.top <= pinTop
      } else if (pinBottom !== null) {
        shouldAffix = tgtRect.bottom - phRect.bottom <= pinBottom
      }

      setAffixed((prev) => {
        if (prev !== shouldAffix) onChangeRef.current?.(shouldAffix)
        return shouldAffix
      })
      setRect({ width: phRect.width, height: phRect.height, left: phRect.left })
      setTargetTop(tgtRect.top)
      setTargetBottom(tgtRect.bottom)
    }

    compute()

    window.addEventListener("resize", compute, { passive: true })
    window.addEventListener("scroll", compute, { passive: true })

    const ro = typeof ResizeObserver !== "undefined" ? new ResizeObserver(compute) : null
    if (ro && placeholder) ro.observe(placeholder)

    return () => {
      window.removeEventListener("resize", compute)
      window.removeEventListener("scroll", compute)
      if (currentTarget) currentTarget.removeEventListener("scroll", compute)
      ro?.disconnect()
    }
  }, [pinTop, pinBottom])

  const placeholderStyle: CSSProperties | undefined =
    affixed && rect ? { height: rect.height, width: rect.width } : undefined

  const affixedStyle: CSSProperties | undefined = affixed
    ? {
        position: "fixed",
        zIndex,
        width: rect?.width,
        left: rect?.left,
        ...(pinTop !== null ? { top: targetTop + pinTop } : {}),
        ...(pinBottom !== null ? { bottom: window.innerHeight - targetBottom + pinBottom } : {}),
      }
    : undefined

  return (
    <div ref={placeholderRef} style={placeholderStyle} className={cn(!affixed && className)}>
      <div style={affixedStyle} className={cn(affixed && className)}>
        {children}
      </div>
    </div>
  )
}

export { Affix }
export type { AffixProps }
