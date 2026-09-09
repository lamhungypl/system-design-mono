import { SwitchProps } from "@radix-ui/react-switch"
import { useController, useFormContext } from "react-hook-form"

import { Switch } from "~/hr-port/components/base/switch"
import { FormFieldProps } from "~/hr-port/components/form/types"
import { cn } from "~/hr-port/utils/style"

import FormLayout from "../form-layout/form-layout"

export type FormSwitchProps = {
  className?: string
  disabled?: boolean
} & FormFieldProps &
  Pick<SwitchProps, "onCheckedChange">

const FormSwitch = (props: FormSwitchProps) => {
  const {
    name,
    label,
    tooltip,
    vertical,
    disabled,
    className,
    onCheckedChange: onCheckedChange,
    layoutProps,
  } = props
  const methods = useFormContext()
  const { control } = methods
  const {
    fieldState: { error },
    field: { value, onChange, ref },
  } = useController({ name, control })

  return (
    <FormLayout
      label={label}
      error={error?.message}
      vertical={vertical}
      tooltip={tooltip}
      {...layoutProps}
    >
      <div className={cn("flex min-h-9 items-center", className)}>
        <Switch
          checked={typeof value === "string" ? value === "true" : value}
          onCheckedChange={(checked) => {
            onChange(checked)
            onCheckedChange?.(checked)
          }}
          ref={ref}
          disabled={disabled}
        />
      </div>
    </FormLayout>
  )
}

export default FormSwitch
