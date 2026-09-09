import { useController, useFormContext } from "react-hook-form"

import { FormLabel } from "~/hr-port/components/base/form"
import { FormFieldProps } from "~/hr-port/components/form/types"
import { AppCheckbox } from "~/hr-port/components/ui/app-checkbox/app-checkbox"
import { SelectOption } from "~/hr-port/types/common"
import { cn } from "~/hr-port/utils/style"

import FormLayout from "../form-layout/form-layout"

type Props = {
  options: SelectOption[]
  optionsLayoutClassName?: string
} & FormFieldProps

const FormCheckboxGroup = (props: Props) => {
  const {
    name,
    label,
    options,
    vertical,
    required,
    tooltip,
    layoutProps,
    optionsLayoutClassName,
  } = props
  const methods = useFormContext()
  const { control } = methods
  const {
    field: { value, onChange, ref },
    fieldState: { error },
  } = useController({ name, control })
  const handleCheckboxChange = (val: string) => {
    if (value === undefined) return
    if (value.includes(val)) {
      onChange(value.filter((item: string) => item !== val))
    } else {
      onChange([...value, val])
    }
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
      <div
        className={cn(`grid flex-1 grid-cols-3 gap-4`, optionsLayoutClassName)}
      >
        {options.map((option) => (
          <div className="flex items-center space-x-2" key={option.value}>
            <AppCheckbox
              id={option.value}
              checked={value?.includes(option.value)}
              onCheckedChange={() => handleCheckboxChange(option.value)}
              ref={ref}
            />
            {label && (
              <FormLabel htmlFor={option.value}>{option.label}</FormLabel>
            )}
          </div>
        ))}
      </div>
    </FormLayout>
  )
}

export default FormCheckboxGroup
