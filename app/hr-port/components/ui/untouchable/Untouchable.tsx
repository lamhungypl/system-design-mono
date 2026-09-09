import { HTMLProps } from "react"

import { cn } from "~/hr-port/utils/style"

export type UntouchableProps = HTMLProps<HTMLDivElement>

export default function Untouchable(props: UntouchableProps) {
  return (
    <div
      {...props}
      aria-hidden="true"
      tabIndex={-1}
      className={cn("pointer-events-none", props.className)}
    />
  )
}
