import clsx from "clsx"
import { useController, useFormContext } from "react-hook-form"

import {
  FormControl,
  FormField,
  FormItem,
} from "~/hr-port/components/base/form"
import {
  TextareaProps as BaseTextareaProps,
  Textarea,
} from "~/hr-port/components/base/textarea"
import FormFieldViewOnly, {
  FormFieldViewOnlyProps,
} from "~/hr-port/components/form/form-field-view-only/form-field-view-only"
import FormTooltip from "~/hr-port/components/form/form-tooltip/form-tooltip"
import { FormFieldProps } from "~/hr-port/components/form/types"
import { AppInputProps } from "~/hr-port/components/ui/app-input/app-input"
import { cn } from "~/hr-port/utils/style"

export type FormTextFieldProps = AppInputProps &
  BaseTextareaProps &
  FormFieldProps &
  Pick<FormFieldViewOnlyProps, "transformValue">

const FormTextarea = (props: FormTextFieldProps) => {
  const {
    viewOnly,
    name,
    label,
    required,
    vertical = false,
    tooltip,
    transformValue,
    onChange: onChangeProp,
    onBlur: onBlurProp,
    ...rest
  } = props
  const methods = useFormContext()
  const { control } = methods
  const {
    field,
    fieldState: { error },
  } = useController({ name, control })

  const isError = !!error

  if (viewOnly) {
    return <FormFieldViewOnly {...props} transformValue={transformValue} />
  }

  return (
    <FormField name={name}>
      <div>
        <FormItem
          className={cn(
            "justify-start gap-3",
            clsx({ "flex-col items-stretch gap-1": vertical })
          )}
        >
          {(label || tooltip) && (
            <div
              className={cn(
                "flex items-center",
                clsx({ "w-[19%]": !vertical })
              )}
            >
              {label && (
                <span
                  className={cn(
                    "text-xs font-medium break-words text-[#5F656A]",
                    clsx({ "red-asterisk": required })
                  )}
                >
                  {label}
                </span>
              )}
              {tooltip && <FormTooltip label={tooltip} />}
            </div>
          )}
          <FormControl>
            <Textarea
              {...rest}
              {...field}
              onChange={(e) => {
                field.onChange(e.target.value)
                onChangeProp?.(e)
              }}
              onBlur={(e) => {
                field.onBlur()
                onBlurProp?.(e)
              }}
              className={cn(
                rest.className,
                clsx({
                  "border-action-red": isError,
                })
              )}
            />
          </FormControl>
        </FormItem>
        {isError && (
          <div className={cn("flex", vertical ? "pt-1" : "gap-3")}>
            {!vertical && <span className="w-[19%]"></span>}
            <span className="text-xxs text-action-red">{error.message}</span>
          </div>
        )}
      </div>
    </FormField>
  )
}

export default FormTextarea
