import { ComponentProps } from "react"

import { ReactComponent as InfoIcon } from "~/hr-port/assets/svgs/info.svg"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "~/hr-port/components/base/tooltip"
import { cn } from "~/hr-port/utils/style"

export type FormTooltipProps = {
  label: string
  slotProps?: {
    content?: ComponentProps<typeof TooltipContent>
    trigger?: ComponentProps<typeof TooltipTrigger>
  }
} & ComponentProps<typeof Tooltip>

const FormTooltip = ({ label, slotProps, ...rest }: FormTooltipProps) => {
  return (
    <Tooltip {...rest}>
      <TooltipTrigger
        type="button"
        {...slotProps?.trigger}
        className={cn("ml-2 text-[#BFBFBF]", slotProps?.trigger?.className)}
      >
        <InfoIcon />
      </TooltipTrigger>
      <TooltipContent
        {...slotProps?.content}
        className={cn("whitespace-pre-line", slotProps?.content?.className)}
      >
        {label}
      </TooltipContent>
    </Tooltip>
  )
}

export default FormTooltip
