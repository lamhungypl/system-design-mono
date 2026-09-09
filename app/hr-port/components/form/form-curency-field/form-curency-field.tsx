import clsx from "clsx"
import { useEffect, useMemo, useState } from "react"
import { useController, useFormContext } from "react-hook-form"

import FormFieldViewOnly from "~/hr-port/components/form/form-field-view-only/form-field-view-only"
import { FormFieldProps } from "~/hr-port/components/form/types"
import AppInput, {
  AppInputProps,
} from "~/hr-port/components/ui/app-input/app-input"
import { CurrencyByRegion } from "~/hr-port/constants"
import { formatCurrency } from "~/hr-port/utils/money"
import { cn } from "~/hr-port/utils/style"

import FormLayout from "../form-layout/form-layout"

export type FormCurrencyFieldProps = {
  applyMask?: boolean
  isCurrency?: boolean
  isShowCurrency?: boolean
  roundingType?: string
} & AppInputProps &
  FormFieldProps

const FormCurrencyField = (props: FormCurrencyFieldProps) => {
  const {
    viewOnly,
    name,
    label,
    required,
    vertical = false,
    isCurrency,
    roundingType,
    tooltip,
    layoutProps,
    ...rest
  } = props
  const methods = useFormContext()
  const { control, clearErrors, setValue } = methods
  const {
    field,
    fieldState: { error },
  } = useController({ name, control })
  const [originalVal, setOriginalVal] = useState(field.value)
  const [curRounding, setCurRounding] = useState(roundingType)
  const isError = !!error

  const isChangedRounding = useMemo(() => {
    return (isCurrency && curRounding != roundingType) || false
  }, [curRounding, isCurrency, roundingType])

  const handleOnChange = (event: any) => {
    let value = event.target.value.trim()

    if (isCurrency) {
      value = value.replace(/[^\d.-]/g, "")
    } else {
      value = value.replace(/[^\d-]/g, "")
    }
    if (isNaN(value)) {
      field.onChange("")
      return
    }
    if (!isChangedRounding) {
      setOriginalVal(value)
    }
    field.onChange(value)
  }

  const handleOnBlur = (event: any) => {
    let value = event.target.value.toString().trim()
    if (isCurrency) {
      value = formatCurrency(value, {
        roundingType,
        currency: CurrencyByRegion.THB,
      })
    }

    if (isError) clearErrors(field.name)

    field.onBlur()
    field.onChange(value)
    rest.onChange?.(event)
  }

  useEffect(() => {
    if (isChangedRounding) {
      setCurRounding(roundingType)
      const val = formatCurrency(originalVal, {
        roundingType,
        currency: CurrencyByRegion.THB,
      })
      setValue(field.name, val)
      field.onBlur()
      field.onChange(val)
    }
  }, [field, isChangedRounding, originalVal, roundingType, setValue])

  if (viewOnly) {
    return <FormFieldViewOnly {...props} />
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
        onChange={handleOnChange}
        onBlur={handleOnBlur}
        className={cn(
          rest.className,
          clsx({
            "border-action-red": isError,
          })
        )}
      />
    </FormLayout>
  )
}

export default FormCurrencyField
