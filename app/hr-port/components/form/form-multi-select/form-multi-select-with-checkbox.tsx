import clsx from "clsx"
import { FC, useEffect, useMemo, useRef, useState } from "react"
import { useController, useFormContext, useWatch } from "react-hook-form"
import { useParams } from "react-router"
import { useDebounce } from "use-debounce"

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
import MultiSelect, {
  MultiSelectProps,
} from "~/hr-port/components/base/multi-select"
import { AppCheckbox } from "~/hr-port/components/ui/app-checkbox/app-checkbox"
import { env } from "~/hr-port/config/env"
import { RoundingType } from "~/hr-port/constants"
import { useFieldsInfo } from "~/hr-port/features/profiles/providers/FieldsInfoProvider"
import { useSectionSum } from "~/hr-port/features/profiles/providers/SectionSumProvider"
import { SelectOption } from "~/hr-port/types/common"
import { formatCurrency } from "~/hr-port/utils/money"
import { isData } from "~/hr-port/utils/object"
import { cn } from "~/hr-port/utils/style"

import FormTooltip from "../form-tooltip/form-tooltip"
import { FormFieldProps } from "../types"

export type FormMultiSelectWithCheckboxProps = {
  className?: string
  deduction_service?: string
  formatter?: string
  hierarchy_label: string[]
  label_disable?: boolean
  label_only?: boolean
  label_tooltip?: string
  link_to?: string
  options?: SelectOption[]
  required?: boolean
  service_path?: string
} & FormFieldProps &
  Omit<MultiSelectProps, "value" | "onChange" | "options" | "onBlur">

const FormMultiSelectWithCheckbox: FC<FormMultiSelectWithCheckboxProps> = (
  props
) => {
  const {
    name,
    label,
    required,
    service_path,
    onSearch: parentOnSearch,
    options: parentOptions,
    label_disable,
    label_only,
    label_tooltip,
    deduction_service,
    link_to,
    hierarchy_label,
    vertical,
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

  const isParentSearch = !!parentOnSearch
  const isApiSearch = !!service_path

  const [searchKey, setSearchKey] = useState("")

  const [debouncedSearchKey] = useDebounce(searchKey, 200)

  const { data: apiOptions } = useOptionsQuery(
    { service_path: service_path ?? "", search_key: debouncedSearchKey },
    { enabled: !!service_path }
  )

  const options = useMemo(() => {
    if (isParentSearch) return parentOptions ?? []
    if (isApiSearch) {
      if (isData(apiOptions)) return apiOptions
      return []
    }
    return parentOptions ?? []
  }, [parentOptions, apiOptions, isApiSearch, isParentSearch])

  const onSearchCallback = useMemo(() => {
    if (isParentSearch) return parentOnSearch
    if (service_path) return setSearchKey
    return undefined
  }, [isParentSearch, service_path, parentOnSearch, setSearchKey])

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

  useCalculateDeduction(
    {
      deduction_service: deductionServiceUrl,
      payload: linkToValue,
    },
    { enabled: !link_to || !!linkToValue }
  )

  const { data: regionSettingMap } = useRegionSettingQuery()

  const moneyValue = useMemo(() => {
    if (!isData(regionSettingMap)) return null
    if (!Array.isArray(field.value)) return 0
    const value: number = field.value.reduce((prev, curr) => {
      const numValue = regionSettingMap[
        [...hierarchy_label, curr].join(".") as RegionSettingMapKey
      ] as number
      if (isNaN(numValue)) return prev
      return prev + numValue
    }, 0)
    return value
  }, [regionSettingMap, field.value, hierarchy_label])

  useEffect(() => {
    if (moneyValue !== null) setSumItem(name, moneyValue)
  }, [moneyValue, setSumItem, name])

  useEffect(() => {
    if (isInitial.current && Array.isArray(field.value)) {
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
                    field.onChange([])
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
                <MultiSelect
                  {...rest}
                  onChange={(newValue) => {
                    field.onChange(newValue)
                    if (newValue.length === 0) field.onBlur()
                  }}
                  value={field.value}
                  onBlur={() => {
                    field.onBlur()
                  }}
                  options={options}
                  onSearch={onSearchCallback}
                  className={cn(
                    rest.className,
                    clsx({
                      "border-action-red": isError,
                    })
                  )}
                  disabled={!checked || rest.disabled}
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

export default FormMultiSelectWithCheckbox
