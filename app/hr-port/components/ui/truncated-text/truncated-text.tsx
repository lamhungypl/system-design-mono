import React, { HTMLProps, useLayoutEffect, useRef, useState } from "react"

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "~/hr-port/components/base/tooltip"
import { cn } from "~/hr-port/utils/style"

export type TruncatedTextProps = {
  stopPropagation?: boolean
  text: string | React.ReactNode
} & HTMLProps<HTMLDivElement>

const TruncatedText = ({
  text,
  stopPropagation = false,
  ...props
}: TruncatedTextProps) => {
  const textRef = useRef<HTMLDivElement>(null)
  const [isTruncated, setIsTruncated] = useState(false)

  useLayoutEffect(() => {
    const checkTruncation = () => {
      if (textRef.current) {
        const element = textRef.current
        const isTruncated = element.scrollHeight > element.clientHeight
        setIsTruncated(isTruncated)
      }
    }

    // Initial check
    checkTruncation()

    // Create ResizeObserver to monitor size changes
    const resizeObserver = new ResizeObserver(checkTruncation)
    if (textRef.current) {
      resizeObserver.observe(textRef.current)
    }

    return () => {
      resizeObserver.disconnect()
    }
  }, [text])

  const textContent = (
    <div
      {...props}
      ref={textRef}
      className={cn("break-words", props.className)}
    >
      {text}
    </div>
  )

  if (!isTruncated) {
    return textContent
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild className="cursor-pointer">
        {textContent}
      </TooltipTrigger>
      <TooltipContent
        sideOffset={5}
        onClick={stopPropagation ? (e) => e.stopPropagation() : undefined}
        className="break-words"
      >
        {text}
      </TooltipContent>
    </Tooltip>
  )
}

export default TruncatedText
