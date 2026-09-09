import { CaretSortIcon } from "@radix-ui/react-icons"
import clsx from "clsx"
import { X } from "lucide-react"
import React, {
  ForwardedRef,
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react"
import { useTranslation } from "react-i18next"

import { Badge } from "~/hr-port/components/base/badge"
import { EMPTY_ARRAY } from "~/hr-port/constants"
import { SelectOption } from "~/hr-port/types/common"
import { cn } from "~/hr-port/utils/style"

import AppSelectOptionList from "../ui/app-select-option-list/app-select-option-list"
import { select_all_option_value } from "../ui/app-select-option-list/constants"
import { Button } from "./button"
import { Popover, PopoverContent, PopoverTrigger } from "./popover"

export type MultiSelectOption = {
  disableDeselect?: boolean
} & SelectOption

export type MultiSelectProps<T = MultiSelectOption> = {
  className?: string
  clearPlaceholder?: string
  disabled?: boolean
  disablePortal?: boolean
  enableSelectAll?: boolean
  getOptionKey?: (option: T) => string
  icon?: React.ReactNode
  onBlur?: () => void
  onChange?: (newValue: string[], newOptions: T[]) => void
  onSearch?: (searchKey: string) => void
  options?: T[]
  placeholder?: string
  showSelectAllOption?: boolean
  translateLabel?: boolean
  value?: string[]
}

export type MultiSelectRef = {
  focus: () => void
}

/*
  value = ['a', 'b', 'c']
  options = [{ value: 'a', label: 'option a' }, { value: 'b', label: 'option b' }]
  onChange(['a', 'b'])
*/

const MAX_DISPLAYED_OPTIONS = 10

const MultiSelectInner = <T extends MultiSelectOption>(
  props: MultiSelectProps<T>,
  ref: ForwardedRef<MultiSelectRef>
) => {
  const {
    value: parentValues,
    options: parentOptions = EMPTY_ARRAY as T[],
    onChange,
    placeholder,
    className,
    onBlur,
    onSearch,
    disabled,
    disablePortal = false,
    icon,
    getOptionKey,
    showSelectAllOption = true,
    translateLabel = false,
  } = props
  const { t } = useTranslation()
  const isControlled = parentValues !== undefined
  const [open, setOpen] = useState(false)
  const [selectedOptions, setSelectedOptions] = useState<T[]>([])
  const selectedValues = useMemo(
    () => selectedOptions.map((option) => option.value),
    [selectedOptions]
  )
  const isParentSearch = !!onSearch
  const buttonRef = useRef<HTMLButtonElement>(null)

  const options = useMemo(() => {
    return parentOptions.map((option) => ({
      ...option,
      label: translateLabel ? t(option.label) : option.label,
    }))
  }, [parentOptions, translateLabel, t])

  const optionsMap = useMemo(() => {
    return options.reduce(
      (prev, option) => ({ ...prev, [option.value]: option }),
      {} as Record<string, T>
    )
  }, [options])

  const onClickOption = useCallback(
    (value: string) => {
      let nextValue: string[] = []
      let nextSelected: T[] = []

      if (value === select_all_option_value) {
        const isAllSelected = selectedOptions.length === options.length
        nextSelected = isAllSelected ? [] : options
        nextValue = nextSelected.map((item) => item.value)
      } else {
        if (optionsMap[value].disableDeselect) return

        nextSelected = selectedOptions.slice()
        const selectedIndex = nextSelected.findIndex(
          (option) => option.value === value
        )

        if (selectedIndex !== -1) {
          nextSelected.splice(selectedIndex, 1)
        } else {
          nextSelected.push(optionsMap[value])
        }
        nextValue = nextSelected.map((option) => option.value)
      }
      if (!isControlled) setSelectedOptions(nextSelected)
      onChange?.(nextValue, nextSelected)
    },
    [optionsMap, selectedOptions, onChange, options, isControlled]
  )

  useEffect(() => {
    if (parentValues && !isParentSearch) {
      if (parentValues.length === 0 || options.length === 0) {
        setSelectedOptions(EMPTY_ARRAY)
        return
      }

      const nextSelected = parentValues
        .map((v) => optionsMap[v])
        .filter(Boolean)
      setSelectedOptions(nextSelected)
    }
  }, [parentValues, isParentSearch, options, optionsMap])

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
            "flex max-h-fit w-full max-w-full flex-1 justify-between overflow-hidden px-3 py-2",
            className,
            clsx({ "border-primary": open })
          )}
          disabled={disabled}
          ref={buttonRef}
          variant="input"
        >
          {icon}
          <div
            className={cn(
              "flex max-h-[4.3rem] flex-1 flex-wrap gap-1 overflow-x-hidden overflow-y-auto",
              {
                "pb-0.5": selectedOptions.length > MAX_DISPLAYED_OPTIONS,
              }
            )}
          >
            {selectedOptions.slice(0, MAX_DISPLAYED_OPTIONS).map((option) => {
              return (
                <Badge
                  key={getOptionKey?.(option as T) ?? option.value}
                  variant="default"
                  className="flex max-w-full px-2 py-0 text-xs font-normal"
                  onClick={(e) => {
                    e.preventDefault() // avoid close popover on click
                  }}
                >
                  <div className="flex-1 truncate overflow-hidden">
                    {option.label}
                  </div>
                  {!disabled && !option.disableDeselect && (
                    <div
                      className="ml-1"
                      onClick={() => {
                        onClickOption(option.value)
                      }}
                    >
                      <X className="h-3 w-3 text-primary-foreground" />
                    </div>
                  )}
                </Badge>
              )
            })}
            {selectedOptions.length > MAX_DISPLAYED_OPTIONS && (
              <div className="rounded-md border border-border bg-accent px-2">
                ...+{selectedOptions.length - MAX_DISPLAYED_OPTIONS}
              </div>
            )}
            {selectedOptions.length === 0 && (
              <span className="text-muted-foreground">{placeholder}</span>
            )}
          </div>
          <CaretSortIcon className="h-4 w-4 flex-shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className={cn(`p-0`)}
        style={{ width: "var(--radix-popover-trigger-width)" }}
        disablePortal={disablePortal}
      >
        <AppSelectOptionList
          options={options}
          selected={selectedValues}
          onClickOption={(value) => onClickOption(value)}
          mode="multiple"
          showSelectAllOption={showSelectAllOption}
        />
      </PopoverContent>
    </Popover>
  )
}

const MultiSelect = forwardRef(MultiSelectInner) as <
  T extends MultiSelectOption,
>(
  props: { ref?: ForwardedRef<MultiSelectRef> } & MultiSelectProps<T>
) => ReturnType<typeof MultiSelectInner>

export default MultiSelect
