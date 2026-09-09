import { addYears, format, Locale, parse } from "date-fns"
import { enUS, ja, th } from "date-fns/locale"

import i18n from "~/hr-port/config/i18n"
import { defaultLanguage, Language } from "~/hr-port/constants"
import { language_local_storage_key } from "~/hr-port/lib/language/constants"

const localeMap: Record<string, Locale> = {
  [Language.TH]: th,
  [Language.JP]: ja,
  [Language.EN]: enUS,
}

export type FormatDateDisplay = (
  inputValue: string | Date | null,
  options?: FormatDateDisplayOptions
) => string

export type FormatDateDisplayOptions = {
  fromFormat?: string
  language?: string
  toFormat?: string
}

export const formatDateDisplay: FormatDateDisplay = (inputValue, options) => {
  const {
    fromFormat,
    toFormat = i18n.t("common.date_format"),
    language = localStorage.getItem(language_local_storage_key) ??
      defaultLanguage,
  } = options ?? {}
  if (!inputValue) return ""
  try {
    const dateLocale = localeMap[language] ?? enUS

    let date: Date
    if (typeof inputValue === "string") {
      if (fromFormat) {
        date = parse(inputValue, fromFormat, new Date())
      } else {
        date = new Date(inputValue)
      }
    } else {
      date = inputValue
    }

    if (language === Language.TH) {
      date = addYears(date, 543)
    }

    return format(date, toFormat, { locale: dateLocale })
  } catch (error) {
    console.error(error)
    return ""
  }
}
