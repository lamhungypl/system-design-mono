import { HTMLProps, PropsWithChildren, ReactNode } from "react"

import { cn } from "~/hr-port/utils/style"

import FormTooltip from "../form-tooltip/form-tooltip"

export type FormLayoutProps = {
  error?: string
  errorClassName?: string
  errorSpacingClassName?: string
  errorWidthPercent?: number
  label?: ReactNode
  labelClassName?: string
  required?: boolean
  reverse?: boolean
  slotProps?: {
    error?: FormLayoutErrorProps
    label?: FormLayoutLabelProps
    wrapper?: HTMLProps<HTMLDivElement>
  }
  tooltip?: string
  vertical?: boolean
}

export type FormLayoutLabelProps = {
  required?: boolean
  slotProps?: {
    label?: HTMLProps<HTMLDivElement>
    wrapper?: HTMLProps<HTMLDivElement>
  }
  tooltip?: string
}

export type FormLayoutErrorProps = HTMLProps<HTMLDivElement>

export type FormLayoutRowProps = HTMLProps<HTMLDivElement>

export function FormLayoutLabel(
  props: PropsWithChildren<FormLayoutLabelProps>
) {
  const { tooltip, required, children, slotProps } = props
  return (
    <div
      {...slotProps?.wrapper}
      className={cn(
        "flex shrink-0 items-center",
        slotProps?.wrapper?.className
      )}
    >
      <span
        {...slotProps?.label}
        className={cn(
          "text-xs font-medium break-words text-[#5F656A]",
          {
            "red-asterisk": required,
          },
          slotProps?.label?.className
        )}
      >
        {children}
      </span>
      {tooltip && <FormTooltip label={tooltip} />}
    </div>
  )
}

export function FormLayoutError(props: FormLayoutErrorProps) {
  const { children, className, ...rest } = props
  return (
    <div {...rest} className={cn("text-xxs text-action-red", className)}>
      {children}
    </div>
  )
}

export function FormLayoutRow(props: FormLayoutRowProps) {
  const { children, className, ...rest } = props
  return (
    <div {...rest} className={cn("flex items-start gap-x-3", className)}>
      {children}
    </div>
  )
}

export default function FormLayout(props: PropsWithChildren<FormLayoutProps>) {
  const {
    label,
    tooltip,
    error,
    reverse,
    vertical,
    required,
    children,
    slotProps,
    labelClassName,
    errorSpacingClassName,
  } = props

  if (vertical) {
    return (
      <div
        {...slotProps?.wrapper}
        className={cn("flex flex-col", slotProps?.wrapper?.className)}
      >
        {!!label && (
          <FormLayoutLabel
            tooltip={tooltip}
            required={required}
            {...slotProps?.label}
            slotProps={{
              ...slotProps?.label?.slotProps,
              wrapper: {
                ...slotProps?.label?.slotProps?.wrapper,
                className: cn(
                  labelClassName,
                  slotProps?.label?.slotProps?.label?.className
                ),
              },
            }}
          >
            {label}
          </FormLayoutLabel>
        )}
        <div className="mt-1" />
        {children}
        {error && (
          <FormLayoutError
            {...slotProps?.error}
            className={cn("mt-0.5", slotProps?.error?.className)}
          >
            {error}
          </FormLayoutError>
        )}
      </div>
    )
  }

  const renderLabel = () => {
    return (
      <>
        {label && (
          <FormLayoutLabel
            tooltip={tooltip}
            required={required}
            {...slotProps?.label}
            slotProps={{
              ...slotProps?.label?.slotProps,
              wrapper: {
                ...slotProps?.label?.slotProps?.wrapper,
                className: cn(
                  "w-20 self-stretch",
                  labelClassName,
                  slotProps?.label?.slotProps?.label?.className
                ),
              },
            }}
          >
            {label}
          </FormLayoutLabel>
        )}
      </>
    )
  }

  const renderErrorSpacing = () => {
    return (
      <div
        className={cn("w-20 shrink-0", errorSpacingClassName ?? labelClassName)}
      ></div>
    )
  }

  return (
    <div
      {...slotProps?.wrapper}
      className={cn("flex-1", slotProps?.wrapper?.className)}
    >
      <FormLayoutRow>
        {!reverse && renderLabel()}
        {children}
        {reverse && renderLabel()}
      </FormLayoutRow>

      {error && (
        <FormLayoutRow className="mt-0.5">
          {!reverse && renderErrorSpacing()}
          <FormLayoutError {...slotProps?.error}>{error}</FormLayoutError>
          {reverse && renderErrorSpacing()}
        </FormLayoutRow>
      )}
    </div>
  )
}
