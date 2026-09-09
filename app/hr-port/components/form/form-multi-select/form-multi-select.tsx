import { useMemo, useState } from "react"
import { useController, useFormContext } from "react-hook-form"
import { useDebounce } from "use-debounce"

import { useOptionsQuery } from "~/hr-port/api/options/options.query"
import MultiSelect, {
  MultiSelectOption,
  MultiSelectProps,
} from "~/hr-port/components/base/multi-select"
import { isData } from "~/hr-port/utils/object"
import { cn } from "~/hr-port/utils/style"

import FormLayout from "../form-layout/form-layout"
import { FormFieldProps } from "../types"

export type FormMultiSelectProps<T extends MultiSelectOption> = {
  className?: string
  required?: boolean
  service_path?: string
} & FormFieldProps &
  Omit<MultiSelectProps<T>, "value" | "onBlur">

const FormMultiSelect = <T extends MultiSelectOption>({
  name,
  label,
  required,
  service_path,
  onSearch: parentOnSearch,
  options: parentOptions,
  vertical = false,
  tooltip,
  onChange: propsOnChange,
  ...rest
}: FormMultiSelectProps<T>) => {
  const { control } = useFormContext()
  const {
    field,
    fieldState: { error },
  } = useController({
    name,
    control,
  })

  const isParentSearch = !!parentOnSearch
  const isApiSearch = !!service_path

  const [searchKey] = useState("")

  const [debouncedSearchKey] = useDebounce(searchKey, 200)

  const { data: apiOptions } = useOptionsQuery(
    { service_path: service_path ?? "", search_key: debouncedSearchKey },
    { enabled: !!service_path }
  )

  const options = useMemo(() => {
    if (isParentSearch) return parentOptions ?? []
    if (isApiSearch) {
      if (isData(apiOptions)) return apiOptions as T[]
      return []
    }
    return parentOptions ?? []
  }, [parentOptions, apiOptions, isApiSearch, isParentSearch])

  const onSearchCallback = useMemo(() => {
    if (isParentSearch) return parentOnSearch
    return undefined
  }, [isParentSearch, parentOnSearch])

  const isError = !!error

  const innerValue = useMemo(
    () => (Array.isArray(field.value) ? field.value : []),
    [field.value]
  )

  return (
    <FormLayout
      label={label}
      tooltip={tooltip}
      error={error?.message}
      required={required}
      vertical={vertical}
    >
      <MultiSelect
        {...field}
        {...rest}
        onChange={(newValue, options) => {
          field.onChange(newValue)
          if (newValue.length === 0) field.onBlur()
          propsOnChange?.(newValue, options)
        }}
        value={innerValue}
        onBlur={() => {
          field.onBlur()
        }}
        options={options}
        onSearch={onSearchCallback}
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

export default FormMultiSelect
