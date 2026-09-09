import clsx from "clsx"
import { useEffect, useMemo, useRef, useState } from "react"
import { useController, useFormContext, useWatch } from "react-hook-form"
import { useParams } from "react-router"

import {
  useCalculateDeduction,
  useOptionsQuery,
} from "~/hr-port/api/options/options.query"
import { useRegionSettingQuery } from "~/hr-port/api/region-setting/region-setting.query"
import { RegionSettingMapKey } from "~/hr-port/api/region-setting/region-setting.types"
import {
  FormControl,
  FormField,
  FormItem,
} from "~/hr-port/components/base/form"
import FormFieldViewOnly from "~/hr-port/components/form/form-field-view-only/form-field-view-only"
import FormTooltip from "~/hr-port/components/form/form-tooltip/form-tooltip"
import { AppCheckbox } from "~/hr-port/components/ui/app-checkbox/app-checkbox"
import Select, { SelectProps } from "~/hr-port/components/ui/select/Select"
import { env } from "~/hr-port/config/env"
import { RoundingType } from "~/hr-port/constants"
import { useFieldsInfo } from "~/hr-port/features/profiles/providers/FieldsInfoProvider"
import { useSectionSum } from "~/hr-port/features/profiles/providers/SectionSumProvider"
import { formatCurrency } from "~/hr-port/utils/money"
import { isData } from "~/hr-port/utils/object"
import { cn } from "~/hr-port/utils/style"

import { FormFieldProps } from "../types"

export interface FormSelectWithCheckboxProps
  extends FormFieldProps, Omit<SelectProps, "value" | "name"> {
  className?: string
  deduction_service?: string
  formatter?: string
  from_region_config?: boolean
  hierarchy_label: string[]
  label_disable?: boolean
  label_only?: boolean
  label_tooltip?: string
  link_to?: string
  required?: boolean
  reverse?: boolean
  service_path?: string
}

const FormSelectWithCheckbox = (props: FormSelectWithCheckboxProps) => {
  const {
    name,
    label = "",
    className,
    required,
    options: parentOptions,
    onChange,
    service_path,
    viewOnly,
    label_disable,
    label_only,
    label_tooltip,
    deduction_service,
    link_to,
    hierarchy_label,
    vertical,
    from_region_config,
    ...rest
  } = props

  const { control } = useFormContext()
  const {
    field,
    fieldState: { error },
  } = useController({
    name,
    control,
  })
  const { id } = useParams()
  const isInitial = useRef(true)
  const { setSumItem } = useSectionSum()
  const [checked, setChecked] = useState(false)
  const { deductionCheckedMap, setDeductionCheckedMap } = useFieldsInfo()

  const { data: optionsFromApi } = useOptionsQuery(
    { service_path: service_path ?? "" },
    { enabled: !!service_path }
  )

  const options = useMemo(() => {
    if (isData(optionsFromApi)) return optionsFromApi
    return parentOptions ?? []
  }, [optionsFromApi, parentOptions])

  const isError = !!error

  const linkToValue = useWatch({ name: link_to ?? "" })

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

  const { data: deductionServiceData } = useCalculateDeduction(
    {
      deduction_service: deductionServiceUrl,
      payload: linkToValue,
    },
    { enabled: !link_to || !!linkToValue }
  )

  const { data: regionSettingMap } = useRegionSettingQuery()

  const moneyValue = useMemo(() => {
    if (from_region_config) {
      if (!isData(regionSettingMap)) return null
      const value = regionSettingMap[
        [...hierarchy_label, field.value].join(".") as RegionSettingMapKey
      ] as number
      if (isNaN(value)) return 0
      return value
    } else {
      if (!isData(deductionServiceData)) return null
      const value = Number(deductionServiceData[field.value])
      if (isNaN(value)) return 0
      return value
    }
  }, [
    regionSettingMap,
    field.value,
    hierarchy_label,
    from_region_config,
    deductionServiceData,
  ])

  useEffect(() => {
    if (moneyValue !== null) setSumItem(name, moneyValue)
  }, [moneyValue, setSumItem, name])

  useEffect(() => {
    if (isInitial.current && field.value !== undefined) {
      isInitial.current = false
      setChecked(!!field.value?.length || deductionCheckedMap[name])
    }
  }, [field.value, deductionCheckedMap, name])

  const displayedValue = useMemo(() => {
    if (!checked || !isData(regionSettingMap)) return ""
    if (moneyValue === null) return ""
    const value = moneyValue.toString()

    return formatCurrency(value, {
      roundingType: RoundingType.ROUND_UP,
      currency: regionSettingMap.region_currency,
    })
  }, [checked, moneyValue, regionSettingMap])

  if (viewOnly) {
    return (
      <FormFieldViewOnly
        {...props}
        transformValue={(value) =>
          options.find((item) => item.value === value)?.label
        }
      />
    )
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
                  if (!checked) {
                    field.onChange("")
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
                <Select
                  {...field}
                  {...rest}
                  onChange={(value, option) => {
                    if (options && options.length > 0) {
                      field.onChange(value)
                      onChange?.(value, option)
                    }
                  }}
                  options={options}
                  className={cn(
                    className,
                    clsx({
                      "border-action-red": isError,
                    })
                  )}
                  disabled={!checked || rest.disabled}
                  allowClear={false}
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
              {displayedValue}
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

export default FormSelectWithCheckbox
