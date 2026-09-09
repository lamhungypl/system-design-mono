import { useController, useFormContext } from "react-hook-form"

import { FormLabel } from "~/hr-port/components/base/form"
import { FormFieldProps } from "~/hr-port/components/form/types"
import { AppCheckbox } from "~/hr-port/components/ui/app-checkbox/app-checkbox"
import { cn } from "~/hr-port/utils/style"

import FormLayout from "../form-layout/form-layout"

type Props = {
  disabled?: boolean
  onChange?: (checked: boolean) => void
  reverse?: boolean
} & FormFieldProps

const FormCheckbox = (props: Props) => {
  const {
    name,
    label,
    reverse = false,
    layoutProps,
    className,
    onChange: parentOnChange,
    disabled,
  } = props
  const methods = useFormContext()
  const { control } = methods
  const {
    field: { value, onChange, ref },
    fieldState: { error },
  } = useController({ name, control })

  return (
    <FormLayout
      reverse={reverse}
      label={label && <FormLabel htmlFor={name}>{label}</FormLabel>}
      error={error?.message}
      {...layoutProps}
    >
      <AppCheckbox
        id={name}
        checked={value}
        onCheckedChange={(checked: boolean) => {
          onChange(checked)
          parentOnChange?.(checked)
        }}
        ref={ref}
        className={cn(className)}
        disabled={disabled}
      />
    </FormLayout>
  )
}

export default FormCheckbox
