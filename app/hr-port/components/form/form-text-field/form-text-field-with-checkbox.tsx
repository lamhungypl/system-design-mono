import clsx from "clsx"
import { useEffect, useMemo, useRef, useState } from "react"
import { useController, useFormContext, useWatch } from "react-hook-form"
import { useParams } from "react-router"

import { useCalculateDeduction } from "~/hr-port/api/options/options.query"
import { useRegionSettingQuery } from "~/hr-port/api/region-setting/region-setting.query"
import {
  FormControl,
  FormField,
  FormItem,
} from "~/hr-port/components/base/form"
import FormFieldViewOnly, {
  FormFieldViewOnlyProps,
} from "~/hr-port/components/form/form-field-view-only/form-field-view-only"
import FormTooltip from "~/hr-port/components/form/form-tooltip/form-tooltip"
import { FormFieldProps } from "~/hr-port/components/form/types"
import { AppCheckbox } from "~/hr-port/components/ui/app-checkbox/app-checkbox"
import AppInput, {
  AppInputProps,
} from "~/hr-port/components/ui/app-input/app-input"
import { env } from "~/hr-port/config/env"
import { RoundingType } from "~/hr-port/constants"
import { useFieldsInfo } from "~/hr-port/features/profiles/providers/FieldsInfoProvider"
import { useSectionSum } from "~/hr-port/features/profiles/providers/SectionSumProvider"
import { formatCurrency } from "~/hr-port/utils/money"
import { isData } from "~/hr-port/utils/object"
import { cn } from "~/hr-port/utils/style"

export type FormTextFieldWithCheckboxProps = {
  deduction_service?: string
  formatter?: string
  label_disable?: boolean
  label_only?: boolean
  label_tooltip?: string
  link_to?: string
  maxValue?: number
} & AppInputProps &
  FormFieldProps &
  Pick<FormFieldViewOnlyProps, "transformValue">

const FormTextFieldWithCheckbox = (props: FormTextFieldWithCheckboxProps) => {
  const {
    viewOnly,
    name,
    label,
    required,
    label_tooltip,
    label_disable,
    label_only,
    transformValue,
    deduction_service,
    link_to,
    maxValue,
    vertical,
    ...rest
  } = props
  const methods = useFormContext()
  const { control } = methods
  const {
    field,
    fieldState: { error },
  } = useController({ name, control })
  const { id } = useParams()
  const isInitial = useRef(true)
  const { setSumItem } = useSectionSum()
  const [checked, setChecked] = useState(false)
  const { fieldMap, deductionCheckedMap, setDeductionCheckedMap } =
    useFieldsInfo()
  const linkToValue = useWatch({ name: link_to ?? "" })

  const transformedLinkToValue = useMemo(() => {
    if (!linkToValue) return undefined
    if (Array.isArray(linkToValue)) {
      const members: Record<string | number, any>[] = []
      linkToValue.forEach((obj) => {
        const member = Object.entries(obj).reduce(
          (prev, [id, value]) => {
            prev[fieldMap[id]?.label] = value
            return prev
          },
          {} as Record<string | number, any>
        )
        members.push(member)
      })
      return {
        members,
      }
    }
    return undefined
  }, [linkToValue, fieldMap])

  const deductionServiceUrl = useMemo(() => {
    if (!id) return ""
    try {
      const url = new URL(
        deduction_service ? `${env.API_URL}/${deduction_service}` : ""
      )
      const searchParams = url.searchParams
      if (searchParams.get("employee_id") !== null) {
        searchParams.set("employee_id", id)
      }
      url.search = searchParams.toString()
      return url.href
    } catch {
      return ""
    }
  }, [deduction_service, id])

  const { data: deductionValue } = useCalculateDeduction(
    {
      deduction_service: deductionServiceUrl,
      payload: transformedLinkToValue,
    },
    { enabled: !link_to || !!transformedLinkToValue }
  )

  const { data: regionSettingMap } = useRegionSettingQuery()

  const moneyValue = useMemo(() => {
    if (!isData(deductionValue)) return null
    return deductionValue.allowance
  }, [deductionValue])

  const isError = !!error

  useEffect(() => {
    if (isInitial.current && field.value !== undefined) {
      isInitial.current = false
      setChecked(
        label_only
          ? field.value === "true"
          : !!field.value || deductionCheckedMap[name]
      )

      if (!label_only) {
        const formattedValue = formatCurrency(field.value, {
          roundingType: RoundingType.ROUND_UP,
        })

        const transformedValue = formattedValue.replace(/,/g, "")
        field.onChange(transformedValue)
      }
    }
    if (label_only) {
      if (moneyValue !== null) setSumItem(name, checked ? moneyValue : 0)
    } else {
      setSumItem(name, Number(field.value))
    }
  }, [
    field,
    label_only,
    setSumItem,
    checked,
    name,
    moneyValue,
    deductionCheckedMap,
  ])

  const displayedValue = useMemo(() => {
    let value = field.value
    if (!checked) return ""
    if (label_only) {
      if (!checked) return ""
      if (moneyValue === null) return ""
      value = moneyValue.toString()
    } else {
      if (!field.value) value = "0"
    }

    if (isNaN(Number(value))) return ""
    return formatCurrency(value, {
      roundingType: RoundingType.ROUND_UP,
    })
  }, [field.value, label_only, moneyValue, checked])

  if (viewOnly) {
    return <FormFieldViewOnly {...props} transformValue={transformValue} />
  }

  return (
    <FormField name={name}>
      <div className="col-span-2">
        <FormItem
          className={cn(
            "justify-start",
            clsx({
              "gap-3": !vertical,
              "flex-wrap gap-1": vertical,
            })
          )}
        >
          <div
            className={cn(
              "flex min-h-9 items-center",
              clsx({ "w-[40%]": !vertical, "w-full": vertical })
            )}
          >
            <AppCheckbox
              className="mr-2"
              disabled={label_disable || rest.disabled}
              checked={checked}
              onCheckedChange={(checked) => {
                if (checked !== "indeterminate") {
                  setChecked(checked)
                  setDeductionCheckedMap((prev) => ({
                    ...prev,
                    [name]: checked,
                  }))
                  if (label_only) {
                    field.onChange(checked ? "true" : "false")
                  } else {
                    if (!checked) field.onChange("")
                  }

                  field.onBlur()
                }
              }}
            />
            {label && (
              <span
                className={cn(
                  "text-xs font-medium break-words text-foreground",
                  clsx({
                    "red-asterisk": required,
                    "text-[#BFBFBF]": label_disable || rest.disabled,
                  })
                )}
              >
                {label}
              </span>
            )}
            {label_tooltip && <FormTooltip label={label_tooltip} />}
          </div>
          {!label_only && (
            <div
              className={cn(clsx({ "w-[30%]": !vertical, "w-full": vertical }))}
            >
              <FormControl>
                <AppInput
                  {...rest}
                  {...field}
                  onChange={(e) => {
                    field.onChange(e.target.value)
                  }}
                  className={cn(
                    rest.className,
                    clsx({
                      "border-action-red": isError,
                    })
                  )}
                  disabled={rest.disabled || !checked}
                  maxValue={maxValue}
                  formatCurrencyOptions={{
                    currency: isData(regionSettingMap)
                      ? regionSettingMap.region_currency
                      : undefined,
                  }}
                />
              </FormControl>
            </div>
          )}
          {displayedValue && (
            <div
              className={cn(
                "flex flex-1 justify-end text-xs font-medium text-foreground",
                clsx({
                  "mt-1": vertical,
                })
              )}
            >
              {`฿${displayedValue}`}
            </div>
          )}
        </FormItem>
        {isError && (
          <div className={cn("flex", "gap-3")}>
            <span className="w-[40%]"></span>
            <span className="text-xxs text-action-red">{error.message}</span>
          </div>
        )}
      </div>
    </FormField>
  )
}

export default FormTextFieldWithCheckbox
