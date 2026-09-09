import React, { ReactNode } from "react"
import { useTranslation } from "react-i18next"

import { Button } from "~/hr-port/components/base/button"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "~/hr-port/components/base/tooltip"
import { cn } from "~/hr-port/utils/style"

type Props = {
  editable?: boolean
  onEditRequested: () => void
  readView: React.ReactNode
  readViewFitContainerWidth?: boolean
  tooltip?: ReactNode
}

const ReadView = (props: Props) => {
  const { t } = useTranslation()
  const {
    onEditRequested,
    readView,
    readViewFitContainerWidth,
    tooltip = t("common.tooltip.click_to_edit"),
    editable,
  } = props
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div
          className={cn(
            "group/read-view inline-block w-full max-w-full min-w-[50px] rounded",
            "rounded-md bg-transparent ring-transparent transition-colors hover:cursor-auto",
            {
              "ring-1 hover:ring-[#e8e8e8]": editable,
            }
          )}
          onClick={onEditRequested}
        >
          <Button
            asChild
            onClick={onEditRequested}
            variant="ghost"
            className="w-full max-w-full justify-start p-0 whitespace-normal hover:bg-transparent"
          >
            <div className={cn({ "w-full": readViewFitContainerWidth })}>
              {readView}
            </div>
          </Button>
        </div>
      </TooltipTrigger>
      {tooltip && <TooltipContent>{tooltip}</TooltipContent>}
    </Tooltip>
  )
}

export default ReadView
