import { RadioGroupProps } from "@radix-ui/react-radio-group"
import { useEffect } from "react"
import { useController, useFormContext } from "react-hook-form"

import { FormLabel } from "~/hr-port/components/base/form"
import FormFieldViewOnly from "~/hr-port/components/form/form-field-view-only/form-field-view-only"
import { FormFieldProps } from "~/hr-port/components/form/types"
import {
  AppRadio,
  AppRadioItem,
} from "~/hr-port/components/ui/app-radio/app-radio"
import { SelectOption } from "~/hr-port/types/common"
import { cn } from "~/hr-port/utils/style"

import FormLayout from "../form-layout/form-layout"

export type FormRadioProps = {
  options: ({ disabled?: boolean } & SelectOption)[]
} & FormFieldProps &
  RadioGroupProps

const FormRadio = (props: FormRadioProps) => {
  const {
    name,
    required,
    disabled,
    dir,
    orientation,
    defaultValue,
    className,
    label,
    options,
    vertical,
    tooltip,
    viewOnly,
    layoutProps,
  } = props
  const { control } = useFormContext()

  const {
    field,
    fieldState: { error },
  } = useController({ name, control })

  useEffect(() => {
    if (viewOnly) return
    if (!field.value) {
      if (defaultValue && options.find((item) => item.value === defaultValue))
        field.onChange(defaultValue)
      else field.onChange(options[0]?.value)
    }
  }, [field, defaultValue, options, viewOnly])

  if (viewOnly) {
    return (
      <FormFieldViewOnly
        {...props}
        transformValue={(value) => {
          return options.find((item) => item.value === value)?.label || value
        }}
      />
    )
  }

  return (
    <FormLayout
      label={label}
      tooltip={tooltip}
      error={error?.message}
      required={required}
      vertical={vertical}
      {...layoutProps}
    >
      <AppRadio
        defaultValue={defaultValue}
        className={cn(className, "min-h-9")}
        disabled={disabled}
        onValueChange={(value) => {
          field.onChange(value)
        }}
        dir={dir}
        orientation={orientation}
        value={field.value}
      >
        {options &&
          options.map((option) => (
            <div key={option.value} className="flex items-center space-x-2">
              <AppRadioItem
                value={option.value}
                id={`${name}-${option.value}`}
                disabled={option?.disabled}
              />
              <FormLabel
                className={cn({ "text-[#BFBFBF]": option?.disabled })}
                htmlFor={`${name}-${option.value}`}
              >
                {option.label}
              </FormLabel>
            </div>
          ))}
      </AppRadio>
    </FormLayout>
  )
}

export default FormRadio
