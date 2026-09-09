import { useCallback, useMemo } from "react"
import { useController, useFormContext } from "react-hook-form"

import { useOptionsQuery } from "~/hr-port/api/options/options.query"
import { Avatar, AvatarImage } from "~/hr-port/components/base/avatar"
import FormFieldViewOnly from "~/hr-port/components/form/form-field-view-only/form-field-view-only"
import Select, { SelectProps } from "~/hr-port/components/ui/select/Select"
import TruncatedText from "~/hr-port/components/ui/truncated-text/truncated-text"
import {
  InheritedFieldAttribute,
  InheritType,
} from "~/hr-port/features/dynamic-form/utils/attribute"
import { SelectOption } from "~/hr-port/types/common"
import { isData } from "~/hr-port/utils/object"
import { cn } from "~/hr-port/utils/style"

import FormLayout from "../form-layout/form-layout"
import { FormFieldProps } from "../types"

export type FormSelectProps<T extends SelectOption = SelectOption> = {
  inherited_field?: InheritedFieldAttribute[]
  required?: boolean
  reverse?: boolean
  service_path?: string
} & FormFieldProps &
  Omit<SelectProps<T>, "value" | "name">

const FormSelect = <T extends SelectOption = SelectOption>(
  props: FormSelectProps<T>
) => {
  const {
    name,
    label = "",
    className,
    required,
    options: parentOptions,
    onChange: parentOnChange,
    service_path,
    viewOnly,
    vertical = false,
    tooltip,
    reverse,
    optionWithIcon,
    inherited_field,
    layoutProps,
    ...rest
  } = props

  const { control, setValue } = useFormContext()
  const {
    field,
    fieldState: { error },
  } = useController({
    name,
    control,
  })

  const { data: optionsFromApi } = useOptionsQuery(
    { service_path: service_path ?? "" },
    { enabled: !!service_path }
  )

  const options = useMemo(() => {
    if (isData(optionsFromApi)) return optionsFromApi as unknown as T[]
    return parentOptions ?? []
  }, [optionsFromApi, parentOptions])

  const isError = !!error

  const onChange = (value: string, option: T | null) => {
    if (options && options.length > 0) {
      field.onChange(value)
      parentOnChange?.(value, option)
      handleInheritedFields(value)
    }
  }

  const handleInheritedFields = (parentValue: string) => {
    if (inherited_field?.length) {
      for (const childField of inherited_field) {
        if (childField.inherit_type === InheritType.SELECT_OPTION) {
          const matchedOption = options.find(
            (item) => String(item.value) === parentValue
          )
          if (matchedOption) {
            setValue(
              childField.key_child,
              matchedOption[childField.select_option_property],
              {
                shouldValidate: true,
              }
            )
          }
        }
      }
    }
  }

  const transformValue = useCallback(
    (value: any) => {
      const matched = options.find((item) => item.value === value)
      return (
        <div className="inline-flex max-w-full items-center gap-2">
          <TruncatedText text={matched?.label} className="line-clamp-1" />
          {optionWithIcon && (
            <Avatar className="h-5 w-5 flex-shrink-0 rounded-[1px]">
              <AvatarImage
                src={matched?.icon_file_path}
                alt={matched?.label}
                className="object-cover"
              />
            </Avatar>
          )}
        </div>
      )
    },
    [optionWithIcon, options]
  )

  if (viewOnly) {
    return <FormFieldViewOnly {...props} transformValue={transformValue} />
  }

  return (
    <FormLayout
      label={label}
      tooltip={tooltip}
      error={error?.message}
      required={required}
      vertical={vertical}
      reverse={reverse}
      {...layoutProps}
    >
      <Select
        {...field}
        {...rest}
        optionWithIcon={optionWithIcon}
        onChange={onChange}
        options={options}
        className={cn(
          {
            "border-action-red": isError,
          },
          className
        )}
      />
    </FormLayout>
  )
}

export default FormSelect
