import { TZDate } from "@date-fns/tz"
import {
  addMonths,
  addYears,
  differenceInDays,
  differenceInMonths,
  differenceInYears,
  format,
  isAfter,
  isBefore,
  isValid,
  parse,
} from "date-fns"
import { TFunction } from "i18next"

import {
  formatDateDisplay,
  FormatDateDisplayOptions,
} from "~/hr-port/features/common/utils/datetime"

/**
 * TODO: Add more supported date format,
 *
 * @description supported datetime format, better for code suggestion
 */
export type SupportedDateTime = "dd/MM/yyyy" | "yyyy-MM-dd"
export type SupportedDateTimeFormat = SupportedDateTime | string

export const getTimeDuration = (startDate: Date, t: TFunction) => {
  let x = new Date(startDate)
  const y = new Date()
  const years = differenceInYears(y, x)
  x = addYears(x, years)
  const months = differenceInMonths(y, x)
  x = addMonths(x, months)
  const days = differenceInDays(y, x)
  return t("common.time_duration", { years, months, days })
}

export const shortDateRegex = /^\d{4}-\d{2}-\d{2}$/

export type ConvertToLocalTime = (
  utcDateString: string,
  options?: ConvertToLocalTimeOptions
) => string

export type ConvertToLocalTimeOptions = {
  includeTime?: boolean
  timeZone?: string
} & FormatDateDisplayOptions

export const convertToLocalTime: ConvertToLocalTime = (
  utcDateString: string,
  options
) => {
  const {
    timeZone,
    includeTime = true,
    ...formatDateDisplayOptions
  } = options ?? {}
  try {
    if (!utcDateString) return ""
    const fullDateString = shortDateRegex.test(utcDateString)
      ? utcDateString
      : `${utcDateString}Z`
    const tzDate = new TZDate(fullDateString, timeZone)
    const dateString = formatDateDisplay(tzDate, formatDateDisplayOptions)

    const timeString = includeTime ? format(tzDate, "HH:mm") : ""

    return [dateString, timeString].filter(Boolean).join(" ")
  } catch (err) {
    console.error("convertToLocalTime error:", err)
    return ""
  }
}

export const generateOptions = (
  mode: string = "day",
  length: number = 31
): { label: string; value: string }[] => {
  const options =
    mode === "day"
      ? Array.from({ length: length }, (_, i) => i + 1)
      : Array.from({ length: length }, (_, i) => i.toString())

  return options.map((item) => {
    return {
      value: item.toString(),
      label: item.toString(),
    }
  })
}

export const stringToDate = (
  dateString: string,
  format: SupportedDateTimeFormat
) => {
  try {
    const date = parse(dateString, format, new Date())
    return isValid(date) ? date : null
  } catch (error) {
    console.error("stringToDate error:", error)
    return null
  }
}

export const dateToString = (
  dateValue: Date | null,
  formatTo: SupportedDateTimeFormat
) => {
  if (!dateValue) {
    return ""
  }
  const dateString = format(dateValue, formatTo)

  return dateString
}

export const startDate = new Date(1900, 0, 1)
export const endDate = new Date(new Date().getFullYear() + 100, 11, 31)
export const isDateInRange = (
  date: Date | null,
  start: Date = startDate,
  end: Date = endDate
) => {
  return !!date && !isBefore(date, start) && !isAfter(date, end)
}
export const date_db_format = "yyyy-MM-dd"
