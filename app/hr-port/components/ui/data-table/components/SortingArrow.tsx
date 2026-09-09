import { SortDirection } from "@tanstack/react-table"
import { HTMLProps, memo } from "react"

import {
  AppArrowDropDownIcon,
  AppArrowDropUpIcon,
} from "~/hr-port/assets/svgs/icons/Icon"
import { cn } from "~/hr-port/utils/style"

type Props = {
  sortDirection: false | SortDirection
} & HTMLProps<HTMLDivElement>

const SortingArrow = ({ sortDirection, ...props }: Props) => {
  return (
    <div
      {...props}
      className={cn("flex flex-col gap-0.5", "cursor-pointer", props.className)}
    >
      <AppArrowDropUpIcon
        className={cn(
          "transition-all",
          sortDirection === "asc" && "text-primary"
        )}
      />
      <AppArrowDropDownIcon
        className={cn(
          "transition-all",
          sortDirection === "desc" && "text-primary"
        )}
      />
    </div>
  )
}

export default memo(SortingArrow)
