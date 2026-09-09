import { useComposedRefs } from "@radix-ui/react-compose-refs"
import { CalendarIcon } from "@radix-ui/react-icons"
import { PopoverProps, PopoverTriggerProps } from "@radix-ui/react-popover"
import { useControllableValue } from "ahooks"
import { subYears } from "date-fns"
import React, {
  ForwardedRef,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react"
import { useTranslation } from "react-i18next"

import {
  Calendar,
  CalendarProps,
} from "~/hr-port/components/base/calendar/calendar"
import {
  Popover,
  PopoverContent,
  PopoverContentProps,
  PopoverTrigger,
} from "~/hr-port/components/base/popover"
import AppInput, {
  AppInputProps,
} from "~/hr-port/components/ui/app-input/app-input"
import { Language } from "~/hr-port/constants"
import { formatDateDisplay } from "~/hr-port/features/common/utils/datetime"
import { useLanguage } from "~/hr-port/lib/language/hooks/use-language"
import { endDate, startDate } from "~/hr-port/utils/date"
import { parseDate } from "~/hr-port/utils/date-utils"
import { cn } from "~/hr-port/utils/style"

export type CalendarPickerProps = {
  defaultValue?: Date | null
  disabled?: boolean
  displayFormat?: string
  error?: boolean
  inputRef?: React.Ref<HTMLInputElement>
  maxDate?: Date
  minDate?: Date
  onBlur?: () => void
  onChange?: (date: Date | null) => void
  placeholder?: string
  slotProps?: {
    calendar?: CalendarProps
    input?: Partial<AppInputProps>
    popoverContent?: Partial<PopoverContentProps>
    popoverTrigger?: Partial<PopoverTriggerProps>
  }
  value?: Date | null
} & Pick<PopoverProps, "open" | "onOpenChange">

export type CalendarPickerRef = {
  focus: () => void
}

const CalendarPickerInner = (
  props: CalendarPickerProps,
  ref: ForwardedRef<CalendarPickerRef>
) => {
  const { t } = useTranslation()
  const {
    inputRef: inputRefProp,
    disabled,
    displayFormat = t("common.date_format"),
    slotProps,
    error,
    placeholder = t("common.placeholder.calendar"),
    onBlur,
    minDate = startDate,
    maxDate = endDate,
  } = props
  const [open, setOpen] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const combinedInputRef = useComposedRefs(inputRefProp, inputRef)
  const { language } = useLanguage()

  const [selectedDate, setSelectedDate] = useControllableValue<Date | null>(
    props,
    {
      valuePropName: "value",
      trigger: "onChange",
      defaultValuePropName: "defaultValue",
    }
  )

  const [inputValue, setInputValue] = useState("")

  useEffect(() => {
    setInputValue(
      formatDateDisplay(selectedDate, {
        toFormat: displayFormat,
        language: language,
      })
    )
  }, [selectedDate, displayFormat, setInputValue, language])

  useImperativeHandle(ref, () => ({
    focus: () => {
      inputRef.current?.focus()
    },
  }))

  return (
    <Popover open={open}>
      <PopoverTrigger
        {...slotProps?.popoverTrigger}
        className={cn(
          "flex-1 focus-visible:border-0 focus-visible:outline-none",
          slotProps?.popoverTrigger?.className
        )}
      >
        <AppInput
          {...slotProps?.input}
          placeholder={placeholder}
          prefix={<CalendarIcon />}
          disabled={disabled}
          value={inputValue}
          onChange={(e) => {
            const nextValue = e.target.value
            setInputValue(nextValue)
            if (!nextValue) {
              setSelectedDate(null)
              return
            }
            let nextDate = parseDate(nextValue, displayFormat, undefined, true)
            if (nextDate) {
              if (language === Language.TH) nextDate = subYears(nextDate, 543)
              setSelectedDate(nextDate)
            }
          }}
          onFocus={() => setOpen(true)}
          ref={combinedInputRef}
          className={cn(
            {
              "border-action-red": error,
            },
            slotProps?.input?.className
          )}
        />
      </PopoverTrigger>
      <PopoverContent
        {...slotProps?.popoverContent}
        onOpenAutoFocus={(e) => e.preventDefault()}
        className="w-auto"
        disablePortal
      >
        <Calendar
          {...slotProps?.calendar}
          onClickOutside={(e) => {
            if (e.target === inputRef.current) return
            if (inputValue) {
              const nextDate = parseDate(
                inputValue,
                displayFormat,
                undefined,
                true
              )
              if (!nextDate) {
                setSelectedDate(new Date())
              }
            }
            setOpen(false)
            onBlur?.()
          }}
          minDate={minDate}
          maxDate={maxDate}
          selected={selectedDate}
          onSelect={(date) => {
            setSelectedDate(date)
            setOpen(false)
            onBlur?.()
          }}
          icon={null}
          disabled={disabled}
        />
      </PopoverContent>
    </Popover>
  )
}

const CalendarPicker = forwardRef(CalendarPickerInner)

export default CalendarPicker
