import { CaretSortIcon } from "@radix-ui/react-icons"
import { useControllableValue } from "ahooks"
import clsx from "clsx"
import React, {
  ForwardedRef,
  forwardRef,
  useCallback,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react"
import { useTranslation } from "react-i18next"

import { Avatar, AvatarImage } from "~/hr-port/components/base/avatar"
import { Button } from "~/hr-port/components/base/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/hr-port/components/base/popover"
import { SelectOption } from "~/hr-port/types/common"
import { getSelectOptions } from "~/hr-port/utils/object"
import { cn } from "~/hr-port/utils/style"

import AppSelectOptionList from "../app-select-option-list/app-select-option-list"
import { select_all_option_value } from "../app-select-option-list/constants"

export type SelectProps<T extends SelectOption = SelectOption> = {
  allowClear?: boolean
  autoFocus?: boolean
  className?: string
  defaultValue?: string
  disabled?: boolean
  disablePortal?: boolean
  icon?: React.ReactNode
  inputPlaceholder?: string
  onBlur?: () => void
  onChange?: (value: string, option: T | null) => void
  options?: T[]
  optionWithIcon?: boolean
  placeholder?: string
  renderOption?: (option: T) => React.ReactNode
  shouldChange?: (value: string) => Promise<boolean>
  showSelectAllOption?: boolean
  slotProps?: {
    check?: React.ComponentProps<"svg">
    expandIcon?: React.ComponentProps<typeof CaretSortIcon>
    popoverContent?: React.ComponentProps<typeof PopoverContent>
  }
  translateLabel?: boolean
  value?: string
}

export type SelectRef = {
  focus: () => void
}

const SelectInner = <T extends SelectOption = SelectOption>(
  props: SelectProps<T>,
  ref: ForwardedRef<SelectRef>
) => {
  const { t } = useTranslation()
  const {
    options: parentOptions = [],
    defaultValue = "",
    disabled,
    placeholder,
    onChange: onChangeProp,
    className,
    onBlur,
    allowClear = true,
    icon,
    disablePortal = false,
    optionWithIcon,
    slotProps,
    shouldChange,
    autoFocus = true,
    showSelectAllOption = false,
    translateLabel = false,
  } = props
  const [open, setOpen] = useState(false)
  const [value, setValue] = useControllableValue(props, { defaultValue })
  const buttonRef = useRef<HTMLButtonElement>(null)

  const options = useMemo(() => {
    return getSelectOptions({
      data: parentOptions,
      labelAccessor: "label",
      valueAccessor: "value",
    }).map((option) => ({
      ...option,
      label: translateLabel ? t(option.label) : option.label,
    }))
  }, [parentOptions, translateLabel, t])

  const handleSelectOption = useCallback(
    async (option: T) => {
      const optionValue = option.value as string
      if (shouldChange) {
        const isShouldChange = await shouldChange(optionValue)
        if (!isShouldChange) return
      }
      const isClear =
        optionValue === select_all_option_value ||
        (allowClear && optionValue === value)
      const nextValue = isClear ? "" : optionValue

      setValue(nextValue)

      setOpen(false)
      onBlur?.()
      onChangeProp?.(nextValue, nextValue === "" ? null : option)
    },
    [allowClear, onBlur, onChangeProp, setValue, shouldChange, value]
  )

  const selectedOption = useMemo(() => {
    return options?.find((option) => option.value === value)
  }, [options, value])

  const renderLabel = useMemo(() => {
    if (selectedOption?.label)
      return (
        <>
          <span className="truncate">{selectedOption.label}</span>
          {optionWithIcon && (
            <Avatar className="h-5 w-5 flex-shrink-0 rounded-[1px]">
              <AvatarImage
                src={selectedOption?.icon_file_path}
                alt={selectedOption?.label}
                className="object-cover"
              />
            </Avatar>
          )}
        </>
      )
    if (showSelectAllOption) return t("common.select_option.all")
    return placeholder
  }, [showSelectAllOption, placeholder, optionWithIcon, selectedOption, t])

  useImperativeHandle(ref, () => ({
    focus: () => {
      buttonRef.current?.focus()
    },
  }))

  return (
    <Popover
      open={open}
      onOpenChange={(open) => {
        setOpen(open)
        if (!open) {
          onBlur?.()
        }
      }}
    >
      <PopoverTrigger asChild>
        <Button
          className={cn(
            "relative w-full max-w-full flex-1 justify-between gap-2 overflow-hidden px-3 py-2",
            className,
            clsx({ "border-primary": open })
          )}
          disabled={disabled}
          data-value={value}
          ref={buttonRef}
          variant="input"
        >
          <div className="flex flex-1 items-center gap-2 overflow-hidden">
            {!!icon && <div className="flex-shrink-0">{icon}</div>}
            <div
              className={cn("flex items-center gap-2 truncate", {
                "text-muted-foreground": !selectedOption,
              })}
            >
              {renderLabel}
            </div>
          </div>
          <CaretSortIcon className="h-4 w-4 flex-shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        {...slotProps?.popoverContent}
        className={cn(`p-0`, slotProps?.popoverContent?.className)}
        style={{
          width: "min(var(--radix-popover-trigger-width)",
          minWidth: "fit-content",
          ...slotProps?.popoverContent?.style,
        }}
        disablePortal={disablePortal}
        onOpenAutoFocus={(e) => {
          if (!autoFocus) {
            e.preventDefault()
          }
        }}
      >
        <AppSelectOptionList
          options={options}
          selected={value}
          onClickOption={(_, option) => handleSelectOption(option)}
          mode="single"
          showSelectAllOption={showSelectAllOption}
        />
      </PopoverContent>
    </Popover>
  )
}

const Select = forwardRef(SelectInner) as <
  T extends SelectOption = SelectOption,
>(
  props: { ref?: ForwardedRef<SelectRef> } & SelectProps<T>
) => ReturnType<typeof SelectInner>

export default Select
