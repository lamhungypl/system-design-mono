import { LocalesByRegion, RoundingType } from "~/hr-port/constants"

import { mathjs } from "./math"

export type FormatCurrency = (
  value: string | number,
  options?: FormatCurrencyOptions
) => string

export type FormatCurrencyOptions = {
  currency?: string /**
   * decide formatting regex
   */
  locale?: string
  maskString?: string
  precision?: number
  roundingType?: string | null
}

export const formatCurrency: FormatCurrency = (value, options) => {
  const {
    roundingType,
    currency,
    precision: _precision,
    locale = LocalesByRegion.THB,
    maskString,
  } = options ?? {}
  if (maskString) return maskString
  if (typeof value !== "number" && !value) return ""
  let numericValue = value.toString().replace(/[^0-9.]/g, "") // Remove non-numeric characters except '.'
  if (numericValue === "") return ""
  if (numericValue === ".") numericValue = "0"

  let precision = _precision

  if (precision == undefined && roundingType) precision = 2

  switch (roundingType) {
    case RoundingType.MONEY_ADJUSTMENT_SOCIAL:
      numericValue = mathjs
        .round(parseFloat(numericValue), precision)
        .toString()
      break
    case RoundingType.ROUND_UP:
      numericValue = mathjs.ceil(parseFloat(numericValue), precision).toString()
      break
    case RoundingType.ROUND_DOWN:
      numericValue = mathjs
        .floor(parseFloat(numericValue), precision)
        .toString()
      break
    case RoundingType.NO_ADJUST:
      numericValue = mathjs.fix(parseFloat(numericValue), precision).toString()
      break
    default:
  }

  const formatOptions: Intl.NumberFormatOptions = {
    currency,
    style: currency ? "currency" : undefined,
    maximumFractionDigits: 0,
  }

  let [integerPart, decimalPart = ""] = numericValue.split(".")

  integerPart = new Intl.NumberFormat(locale, formatOptions).format(
    parseInt(integerPart)
  )

  if (precision != undefined && decimalPart.length < precision) {
    decimalPart = `${decimalPart}${"0".repeat(precision - decimalPart.length)}`
  }

  const result = [integerPart, decimalPart].filter(Boolean).join(".")

  return result
}

export type ReverseFormatCurrency = (
  value: string,
  options?: {
    locale?: string
  }
) => string

export const reverseFormatCurrency: ReverseFormatCurrency = (
  value,
  { locale = LocalesByRegion.THB } = {}
) => {
  const separatorDecimal = new Intl.NumberFormat(locale, {
    style: "decimal",
  })
    .format(11.11)
    .replace(/\d/g, "")

  const separatorThousands = new Intl.NumberFormat(locale, {
    style: "decimal",
  })
    .format(1111)
    .replace(/\d/g, "")

  const result = value
    .replace(/[^\d.,-]/g, "")
    .replace(new RegExp(`[${separatorThousands}]`, "g"), "")
    .replace(separatorDecimal, ".")

  return result
}

export type FormatNumber = (
  value: string,
  options?: FormatNumberOptions
) => string

export type FormatNumberOptions = {
  precision?: number
}

export const formatNumber: FormatNumber = (value: string, options) => {
  const { precision: _precision } = options ?? {}
  if (!value) return ""
  let numericValue = value.replace(/[^0-9.]/g, "") // Remove non-numeric characters except '.'
  if (numericValue === "") return ""
  if (numericValue === ".") numericValue = "0"

  let precision = _precision

  if (precision == undefined) precision = 2

  if (!precision) {
    return numericValue.split(".")[0]
  }
  numericValue = mathjs.fix(parseFloat(numericValue), precision).toString()

  return numericValue
}
