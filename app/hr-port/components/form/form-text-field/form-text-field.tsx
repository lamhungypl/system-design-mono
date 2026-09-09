import { useController, useFormContext } from "react-hook-form"

import { useRegionSettingQuery } from "~/hr-port/api/region-setting/region-setting.query"
import FormFieldViewOnly, {
  FormFieldViewOnlyProps,
} from "~/hr-port/components/form/form-field-view-only/form-field-view-only"
import { FormFieldProps } from "~/hr-port/components/form/types"
import AppInput, {
  AppInputProps,
} from "~/hr-port/components/ui/app-input/app-input"
import { formatCurrency } from "~/hr-port/utils/money"
import { isData } from "~/hr-port/utils/object"
import { cn } from "~/hr-port/utils/style"

import FormLayout from "../form-layout/form-layout"

export type FormTextFieldProps = AppInputProps &
  FormFieldProps &
  Pick<FormFieldViewOnlyProps, "transformValue">

const FormTextField = (props: FormTextFieldProps) => {
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
    layoutProps,
    // PORT: form-dynamic-field passes `isInGrid` here; it is not an AppInput prop, so
    // React 19 warns when `...rest` spreads it onto the <input>. Destructured out.
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    isInGrid,
    ...rest
  } = props as FormTextFieldProps & { isInGrid?: boolean }
  const { data: regionSettingMap } = useRegionSettingQuery()
  const methods = useFormContext()
  const { control } = methods
  const {
    field,
    fieldState: { error },
  } = useController({ name, control })

  const isError = !!error

  if (viewOnly) {
    return (
      <FormFieldViewOnly
        {...props}
        transformValue={(value) => {
          if (transformValue) return transformValue(value)
          if (rest.type === "money" && isData(regionSettingMap))
            return formatCurrency(value, {
              roundingType: regionSettingMap.rounding_mode,
              precision: regionSettingMap.rounding_scale,
              currency: regionSettingMap.region_currency,
            })
          return null
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
      <AppInput
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
          {
            "border-action-red": isError,
          },
          rest.className
        )}
      />
    </FormLayout>
  )
}

export default FormTextField
