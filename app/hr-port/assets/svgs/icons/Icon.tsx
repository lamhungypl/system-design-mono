import React, { forwardRef } from "react"

import { ReactComponent as ArrowDownRoundedFilled } from "~/hr-port/assets/svgs/arrow-down-rounded-filled.svg"
import { ReactComponent as ArrowDropDown } from "~/hr-port/assets/svgs/arrow-drop-down.svg"
import { ReactComponent as ArrowDropUp } from "~/hr-port/assets/svgs/arrow-drop-up.svg"
import { ReactComponent as ArrowLeft } from "~/hr-port/assets/svgs/arrow-left.svg"
import { ReactComponent as ArrowRight2 } from "~/hr-port/assets/svgs/arrow-right-2.svg"
import { ReactComponent as ArrowRight } from "~/hr-port/assets/svgs/arrow-right.svg"
import { ReactComponent as BellFilled } from "~/hr-port/assets/svgs/bell-filled.svg"
import { ReactComponent as BellOutlined } from "~/hr-port/assets/svgs/bell-outlined.svg"
import { ReactComponent as CalculationEdit } from "~/hr-port/assets/svgs/calculation-edit.svg"
import { ReactComponent as CalculatorFilled } from "~/hr-port/assets/svgs/calculator-filled.svg"
import { ReactComponent as CalculatorOutlined } from "~/hr-port/assets/svgs/calculator-outlined.svg"
import { ReactComponent as CalendarFilled } from "~/hr-port/assets/svgs/calendar-filled.svg"
import { ReactComponent as CalendarOutlined } from "~/hr-port/assets/svgs/calendar-outlined.svg"
import { ReactComponent as CircleArrowRight } from "~/hr-port/assets/svgs/circle-arrow-right.svg"
import { ReactComponent as DocsCSV } from "~/hr-port/assets/svgs/docs-csv.svg"
import { ReactComponent as DocsXLSX } from "~/hr-port/assets/svgs/docs-xlsx.svg"
import { ReactComponent as DotFill } from "~/hr-port/assets/svgs/dot-fill.svg"
import { ReactComponent as EmployeeAvatarPlaceholder } from "~/hr-port/assets/svgs/employee-avatar-placeholder.svg"
import { ReactComponent as EmptyBox } from "~/hr-port/assets/svgs/empty-box.svg"
import { ReactComponent as Empty } from "~/hr-port/assets/svgs/empty.svg"
import { ReactComponent as Error } from "~/hr-port/assets/svgs/error-icon.svg"
import { ReactComponent as Exit } from "~/hr-port/assets/svgs/exit.svg"
import { ReactComponent as Hand } from "~/hr-port/assets/svgs/hand-icon.svg"
import { ReactComponent as HomeFilled } from "~/hr-port/assets/svgs/home-filled.svg"
import { ReactComponent as HomeOutlined } from "~/hr-port/assets/svgs/home-outlined.svg"
import { ReactComponent as HRSettingsFilled } from "~/hr-port/assets/svgs/hr-settings-filled.svg"
import { ReactComponent as HRSettingsOulined } from "~/hr-port/assets/svgs/hr-settings-outlined.svg"
import { ReactComponent as Check } from "~/hr-port/assets/svgs/imgs/check.svg"
import { ReactComponent as Edit } from "~/hr-port/assets/svgs/imgs/edit.svg"
import { ReactComponent as Trash } from "~/hr-port/assets/svgs/imgs/trash.svg"
import { ReactComponent as Upload } from "~/hr-port/assets/svgs/imgs/upload.svg"
import { ReactComponent as InfoDanger } from "~/hr-port/assets/svgs/info-danger.svg"
import { ReactComponent as InfoWarning } from "~/hr-port/assets/svgs/info-warning.svg"
import { ReactComponent as Info } from "~/hr-port/assets/svgs/info.svg"
import { ReactComponent as QuestionFilled } from "~/hr-port/assets/svgs/question-filled.svg"
import { ReactComponent as QuestionOutlined } from "~/hr-port/assets/svgs/question-outlined.svg"
import { ReactComponent as SendFilled } from "~/hr-port/assets/svgs/send-filled.svg"
import { ReactComponent as SendOutlined } from "~/hr-port/assets/svgs/send-outlined.svg"
import { ReactComponent as SettingsFilled } from "~/hr-port/assets/svgs/settings-filled.svg"
import { ReactComponent as SettingsOutlined } from "~/hr-port/assets/svgs/settings-outlined.svg"
import { ReactComponent as Success } from "~/hr-port/assets/svgs/success-icon.svg"
import { ReactComponent as Tick } from "~/hr-port/assets/svgs/tick.svg"
import { ReactComponent as Warning } from "~/hr-port/assets/svgs/warning-icon.svg"
import { cn } from "~/hr-port/utils/style"
export type SVGProps = React.ComponentProps<"svg">

export type AppIcon = React.ForwardRefExoticComponent<
  Omit<React.SVGProps<SVGSVGElement>, "ref"> &
    React.RefAttributes<SVGSVGElement>
>

export const AppTrashIcon = forwardRef<SVGSVGElement, SVGProps>(
  function TrashIcon(props, ref) {
    const { className, ...rest } = props

    return (
      <Trash {...rest} ref={ref} className={cn("text-action-red", className)} />
    )
  }
)

export const AppEditIcon = forwardRef<SVGSVGElement, SVGProps>(
  function EditIcon(props, ref) {
    const { className, ...rest } = props

    return (
      <Edit {...rest} ref={ref} className={cn("text-action-blue", className)} />
    )
  }
)

export const AppCheckIcon = forwardRef<SVGSVGElement, SVGProps>(
  function EditIcon(props, ref) {
    const { className, ...rest } = props

    return <Check {...rest} ref={ref} className={cn("text-white", className)} />
  }
)

export const AppUploadIcon = forwardRef<SVGSVGElement, SVGProps>(
  function UploadIcon(props, ref) {
    const { className, ...rest } = props

    return <Upload {...rest} ref={ref} className={cn("", className)} />
  }
)

export const AppArrowDropDownIcon = forwardRef<SVGSVGElement, SVGProps>(
  function ArrowDropDownIcon(props, ref) {
    const { className, ...rest } = props

    return (
      <ArrowDropDown
        {...rest}
        ref={ref}
        className={cn("text-[#BFBFBF]", className)}
      />
    )
  }
)

export const AppArrowDropUpIcon = forwardRef<SVGSVGElement, SVGProps>(
  function ArrowDropUpIcon(props, ref) {
    const { className, ...rest } = props

    return (
      <ArrowDropUp
        {...rest}
        ref={ref}
        className={cn("text-[#BFBFBF]", className)}
      />
    )
  }
)

export const AppTickIcon = forwardRef<SVGSVGElement, SVGProps>(
  function TickIcon(props, ref) {
    const { className, ...rest } = props

    return (
      <Tick {...rest} ref={ref} className={cn("text-primary", className)} />
    )
  }
)

export const AppEmptyBoxIcon = forwardRef<SVGSVGElement, SVGProps>(
  function EmptyBoxIcon(props, ref) {
    const { ...rest } = props

    return <EmptyBox {...rest} ref={ref} />
  }
)

export const AppEmptyIcon = forwardRef<SVGSVGElement, SVGProps>(
  function EmptyIcon(props, ref) {
    const { ...rest } = props

    return <Empty {...rest} ref={ref} />
  }
)

export const AppInfoWarningIcon = forwardRef<SVGSVGElement, SVGProps>(
  function InfoWarningIcon(props, ref) {
    const { className, ...rest } = props
    return (
      <InfoWarning
        {...rest}
        ref={ref}
        className={cn("shrink-0 text-[#BB7305]", className)}
      />
    )
  }
)
export const AppInfoDangerIcon = forwardRef<SVGSVGElement, SVGProps>(
  function InfoDangerIcon(props, ref) {
    const { ...rest } = props
    return <InfoDanger {...rest} ref={ref} />
  }
)
export const AppInfoIcon = forwardRef<SVGSVGElement, SVGProps>(
  function InfoIcon(props, ref) {
    const { ...rest } = props
    return <Info {...rest} ref={ref} />
  }
)

export const AppDotFillIcon = forwardRef<SVGSVGElement, SVGProps>(
  function DotFillIcon(props, ref) {
    const { className, ...rest } = props
    return (
      <DotFill {...rest} ref={ref} className={cn("text-primary", className)} />
    )
  }
)

export const AppCalculatorOutlinedIcon = forwardRef<SVGSVGElement, SVGProps>(
  function CalculatorOutlinedIcon(props, ref) {
    const { className, ...rest } = props
    return (
      <CalculatorOutlined
        {...rest}
        ref={ref}
        className={cn("h-6 w-6 text-[#BB7305]", className)}
      />
    )
  }
)

export const AppCalculatorFilledIcon = forwardRef<SVGSVGElement, SVGProps>(
  function CalculatorFilledIcon(props, ref) {
    const { className, ...rest } = props
    return (
      <CalculatorFilled
        {...rest}
        ref={ref}
        className={cn("h-6 w-6 text-white", className)}
      />
    )
  }
)

export const AppCircleArrowRightIcon = forwardRef<SVGSVGElement, SVGProps>(
  function CircleArrowRightIcon(props, ref) {
    const { className, ...rest } = props
    return <CircleArrowRight {...rest} ref={ref} className={cn(className)} />
  }
)
export const AppCalculationEditIcon = forwardRef<SVGSVGElement, SVGProps>(
  function CalculationEditIcon(props, ref) {
    return <CalculationEdit {...props} ref={ref} />
  }
)

export const AppCircleTickIcon = forwardRef<SVGSVGElement, SVGProps>(
  function TickIcon(props, ref) {
    const { className, ...rest } = props

    return (
      <Tick
        {...rest}
        ref={ref}
        className={cn(
          "h-3 w-3 rounded-full bg-[#25A65C] text-white",
          className
        )}
      />
    )
  }
)

export const AppDocsCSVIcon = forwardRef<SVGSVGElement, SVGProps>(
  function DocsCSVIcon(props, ref) {
    const { className, ...rest } = props

    return <DocsCSV {...rest} ref={ref} className={cn("h-8 w-7", className)} />
  }
)

export const AppDocsXLSXIcon = forwardRef<SVGSVGElement, SVGProps>(
  function DocsXLSXIcon(props, ref) {
    const { className, ...rest } = props

    return <DocsXLSX {...rest} ref={ref} className={cn("h-8 w-7", className)} />
  }
)

export const SuccessIcon = forwardRef<SVGSVGElement, SVGProps>(
  function DocsCSVIcon(props, ref) {
    const { className, ...rest } = props

    return <Success {...rest} ref={ref} className={cn("h-5 w-5", className)} />
  }
)

export const WarningIcon = forwardRef<SVGSVGElement, SVGProps>(
  function DocsCSVIcon(props, ref) {
    const { className, ...rest } = props

    return <Warning {...rest} ref={ref} className={cn("h-5 w-5", className)} />
  }
)

export const ErrorIcon = forwardRef<SVGSVGElement, SVGProps>(
  function DocsCSVIcon(props, ref) {
    const { className, ...rest } = props

    return <Error {...rest} ref={ref} className={cn("h-5 w-5", className)} />
  }
)

export const AppArrowLeftIcon = forwardRef<SVGSVGElement, SVGProps>(
  function ArrowLeftIcon(props, ref) {
    const { className, ...rest } = props

    return (
      <ArrowLeft {...rest} ref={ref} className={cn("h-4 w-4", className)} />
    )
  }
)

export const AppArrowRightIcon = forwardRef<SVGSVGElement, SVGProps>(
  function ArrowRightIcon(props, ref) {
    const { className, ...rest } = props

    return (
      <ArrowRight {...rest} ref={ref} className={cn("h-4 w-4", className)} />
    )
  }
)

export const AppSendOutlinedIcon = forwardRef<SVGSVGElement, SVGProps>(
  function SendIcon(props, ref) {
    const { className, ...rest } = props

    return (
      <SendOutlined {...rest} ref={ref} className={cn("h-6 w-6", className)} />
    )
  }
)

export const AppSendFilledIcon = forwardRef<SVGSVGElement, SVGProps>(
  function SendIcon(props, ref) {
    const { className, ...rest } = props
    return (
      <SendFilled {...rest} ref={ref} className={cn("h-6 w-6", className)} />
    )
  }
)

export const AppHandIcon = forwardRef<SVGSVGElement, SVGProps>(
  function HandIcon(props, ref) {
    const { className, ...rest } = props

    return <Hand {...rest} ref={ref} className={cn("h-4 w-4", className)} />
  }
)

export const AppHomeOutlinedIcon = forwardRef<SVGSVGElement, SVGProps>(
  function HomeOutlinedIcon(props, ref) {
    const { className, ...rest } = props
    return (
      <HomeOutlined {...rest} ref={ref} className={cn("h-6 w-6", className)} />
    )
  }
)

export const AppHomeFilledIcon = forwardRef<SVGSVGElement, SVGProps>(
  function HomeFilledIcon(props, ref) {
    const { className, ...rest } = props

    return (
      <HomeFilled {...rest} ref={ref} className={cn("h-6 w-6", className)} />
    )
  }
)

export const AppCalendarFilledIcon = forwardRef<SVGSVGElement, SVGProps>(
  function CalendarFilledIcon(props, ref) {
    const { className, ...rest } = props

    return (
      <CalendarFilled
        {...rest}
        ref={ref}
        className={cn("h-6 w-6", className)}
      />
    )
  }
)

export const AppCalendarOutlinedIcon = forwardRef<SVGSVGElement, SVGProps>(
  function CalendarOutlinedIcon(props, ref) {
    const { className, ...rest } = props

    return (
      <CalendarOutlined
        {...rest}
        ref={ref}
        className={cn("h-6 w-6", className)}
      />
    )
  }
)

export const AppQuestionFilledIcon = forwardRef<SVGSVGElement, SVGProps>(
  function QuestionFilledIcon(props, ref) {
    const { className, ...rest } = props

    return (
      <QuestionFilled
        {...rest}
        ref={ref}
        className={cn("h-6 w-6", className)}
      />
    )
  }
)

export const AppQuestionOutlinedIcon = forwardRef<SVGSVGElement, SVGProps>(
  function QuestionOutlinedIcon(props, ref) {
    const { className, ...rest } = props

    return (
      <QuestionOutlined
        {...rest}
        ref={ref}
        className={cn("h-6 w-6", className)}
      />
    )
  }
)

export const AppBellOutlinedIcon = forwardRef<SVGSVGElement, SVGProps>(
  function BellOutlinedIcon(props, ref) {
    const { className, ...rest } = props

    return (
      <BellOutlined {...rest} ref={ref} className={cn("h-6 w-6", className)} />
    )
  }
)

export const AppBellFilledIcon = forwardRef<SVGSVGElement, SVGProps>(
  function BellFilledIcon(props, ref) {
    const { className, ...rest } = props

    return (
      <BellFilled {...rest} ref={ref} className={cn("h-6 w-6", className)} />
    )
  }
)

export const AppHRSettingsOutlinedIcon = forwardRef<SVGSVGElement, SVGProps>(
  function HRSettingsOutlinedIcon(props, ref) {
    const { className, ...rest } = props
    return (
      <HRSettingsOulined
        {...rest}
        ref={ref}
        className={cn("h-6 w-6", className)}
      />
    )
  }
)
export const AppHRSettingsFilledIcon = forwardRef<SVGSVGElement, SVGProps>(
  function HRSettingsFilledIcon(props, ref) {
    const { className, ...rest } = props
    return (
      <HRSettingsFilled
        {...rest}
        ref={ref}
        className={cn("h-6 w-6", className)}
      />
    )
  }
)

export const AppSettingsFilledIcon = forwardRef<SVGSVGElement, SVGProps>(
  function SettingsFilledIcon(props, ref) {
    const { className, ...rest } = props
    return (
      <SettingsFilled
        {...rest}
        ref={ref}
        className={cn("h-6 w-6", className)}
      />
    )
  }
)

export const AppSettingsOutlinedIcon = forwardRef<SVGSVGElement, SVGProps>(
  function SettingsOutlinedIcon(props, ref) {
    const { className, ...rest } = props
    return (
      <SettingsOutlined
        {...rest}
        ref={ref}
        className={cn("h-6 w-6", className)}
      />
    )
  }
)

export const AppEmployeeAvatarPlaceholderIcon = forwardRef<
  SVGSVGElement,
  SVGProps
>(function EmployeeAvatarPlaceholderIcon(props, ref) {
  const { className, ...rest } = props
  return (
    <EmployeeAvatarPlaceholder
      {...rest}
      ref={ref}
      className={cn("h-10 w-10", className)}
    />
  )
})

export const AppArrowDownRoundedFilledIcon = forwardRef<
  SVGSVGElement,
  SVGProps
>(function ArrowDownRoundedFilledIcon(props, ref) {
  const { className, ...rest } = props
  return (
    <ArrowDownRoundedFilled
      {...rest}
      ref={ref}
      className={cn("h-3 w-3 text-[#D9D9D9]", className)}
    />
  )
})

export const AppArrowRight2Icon = forwardRef<SVGSVGElement, SVGProps>(
  function ArrowRight2Icon(props, ref) {
    const { className, ...rest } = props
    return (
      <ArrowRight2 {...rest} ref={ref} className={cn("h-6 w-6", className)} />
    )
  }
)

export const AppExitIcon = forwardRef<SVGSVGElement, SVGProps>(
  function ExitIcon(props, ref) {
    const { className, ...rest } = props
    return <Exit {...rest} ref={ref} className={cn("h-4 w-4", className)} />
  }
)
