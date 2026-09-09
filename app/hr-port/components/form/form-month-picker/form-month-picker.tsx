import clsx from "clsx"
import {
  add,
  eachMonthOfInterval,
  endOfMonth,
  endOfYear,
  format,
  isEqual,
  parse,
} from "date-fns"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { FC, useMemo, useState } from "react"
import { useController, useFormContext } from "react-hook-form"
import { useTranslation } from "react-i18next"

import { Button, buttonVariants } from "~/hr-port/components/base/button"
import { FormControl } from "~/hr-port/components/base/form"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/hr-port/components/base/popover"
import { FormFieldProps } from "~/hr-port/components/form/types"
import { formatDateDisplay } from "~/hr-port/features/common/utils/datetime"
import { date_db_format } from "~/hr-port/utils/date"
import { cn } from "~/hr-port/utils/style"

import FormLayout from "../form-layout/form-layout"

interface FormMonthPickerProps extends FormFieldProps {
  chooseDateEnd?: boolean
  className?: string
  disabled?: boolean
  displayFormat?: string
  required?: boolean
}

const FormMonthPicker: FC<FormMonthPickerProps> = (props) => {
  const { t } = useTranslation()
  const {
    name,
    label,
    required,
    className,
    vertical,
    displayFormat = t("common.date_format"),
    chooseDateEnd = false,
    disabled = false,
    layoutProps,
  } = props
  const { control } = useFormContext()
  const {
    field,
    fieldState: { error },
  } = useController({
    name,
    control,
  })
  const [open, setOpen] = useState(false)

  const currentMonth = field.value ? new Date(field.value) : new Date()
  const [currentYear, setCurrentYear] = useState(format(currentMonth, "yyyy"))
  const firstDayCurrentYear = parse(currentYear, "yyyy", new Date())

  const months = eachMonthOfInterval({
    start: firstDayCurrentYear,
    end: endOfYear(firstDayCurrentYear),
  })

  function previousYear() {
    const firstDayNextYear = add(firstDayCurrentYear, { years: -1 })
    setCurrentYear(format(firstDayNextYear, "yyyy"))
  }

  function nextYear() {
    const firstDayNextYear = add(firstDayCurrentYear, { years: 1 })
    setCurrentYear(format(firstDayNextYear, "yyyy"))
  }

  function isEqualMonth(date: Date, dateCompare: Date) {
    return isEqual(
      `${date.getMonth()}${date.getFullYear()}`,
      `${dateCompare.getMonth()}${dateCompare.getFullYear()}`
    )
  }

  const displayedValue = useMemo(() => {
    const value = field.value as string
    if (!value) return ""
    const monthVal = chooseDateEnd
      ? endOfMonth(parse(value, date_db_format, new Date()))
      : parse(value, date_db_format, new Date())
    return formatDateDisplay(monthVal, {
      toFormat: displayFormat,
    })
  }, [chooseDateEnd, field.value, displayFormat])

  const isError = !!error

  const handleChooseMonth = (month: Date) => {
    if (disabled) return

    const monthVal = chooseDateEnd ? endOfMonth(month) : month
    field.onChange(monthVal ? format(monthVal, date_db_format) : "")
    field.onBlur()
    setOpen(false)
  }

  return (
    <FormLayout
      label={label}
      // tooltip={tooltip}
      error={error?.message}
      required={required}
      vertical={vertical}
      {...layoutProps}
    >
      <Popover
        open={open}
        onOpenChange={(open) => {
          setOpen(open)
          if (!open) {
            field.onBlur()
          }
        }}
      >
        <PopoverTrigger asChild>
          <FormControl>
            <Button
              className={cn(
                "relative w-full max-w-full flex-1 justify-between overflow-hidden py-2 pr-7 pl-3",
                "font-normal text-inherit",
                "border-input bg-transparent",
                "disabled:border-[#F4F4F4] disabled:bg-[#F4F4F4]",
                {
                  "border-action-red": isError,
                },
                className,
                clsx({ "border-primary": open })
              )}
              onClick={() => setOpen(true)}
              ref={field.ref}
              disabled={disabled}
            >
              {displayedValue}
            </Button>
          </FormControl>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <div className="p-3">
            <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
              <div className="space-y-4">
                <div className="relative flex items-center justify-center pt-1">
                  <div
                    className="text-xs font-medium"
                    aria-live="polite"
                    role="presentation"
                    id="month-picker"
                  >
                    {formatDateDisplay(firstDayCurrentYear, {
                      toFormat: "yyyy",
                    })}
                  </div>
                  <div className="flex items-center space-x-1">
                    <button
                      name="previous-year"
                      aria-label="Go to previous year"
                      className={cn(
                        buttonVariants({ variant: "outline" }),
                        "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100",
                        "absolute left-1"
                      )}
                      type="button"
                      onClick={previousYear}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </button>
                    <button
                      name="next-year"
                      aria-label="Go to next year"
                      className={cn(
                        buttonVariants({ variant: "outline" }),
                        "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100",
                        "absolute right-1 disabled:bg-slate-100"
                      )}
                      type="button"
                      // disabled={isFuture(add(firstDayCurrentYear, { years: 1 }))}
                      onClick={nextYear}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <div
                  className="grid w-full grid-cols-3 gap-2"
                  role="grid"
                  aria-labelledby="month-picker"
                >
                  {months.map((month) => (
                    <div
                      key={month.toString()}
                      className="relative p-0 text-center text-xs focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-slate-100 first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md dark:[&:has([aria-selected])]:bg-slate-800"
                      role="presentation"
                    >
                      <button
                        name="day"
                        className={cn(
                          "inline-flex h-9 w-16 items-center justify-center rounded-md bg-popover p-0 text-xs font-normal",
                          "transition-colors hover:bg-primary/70 hover:text-primary-foreground",
                          {
                            "bg-primary text-primary-foreground": isEqualMonth(
                              month,
                              currentMonth
                            ),
                          }
                        )}
                        // disabled={isFuture(month)}
                        role="gridcell"
                        tabIndex={-1}
                        type="button"
                        onClick={() => handleChooseMonth(month)}
                      >
                        {formatDateDisplay(month, {
                          toFormat: "MMM",
                        })}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </FormLayout>
  )
}

export default FormMonthPicker
