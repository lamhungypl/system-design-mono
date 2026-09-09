/**
 *
 * @description
 * This file is picked from https://github.com/Hacker0x01/react-datepicker/blob/v7.6.0/src/date_utils.ts
 *
 */

import {
  format,
  isBefore,
  isValid as isValidDate,
  longFormatters,
  parse,
} from "date-fns"
import type { Locale as DateFnsLocale, Day } from "date-fns"

export type DateNumberType = Day
interface LocaleObj extends Pick<
  DateFnsLocale,
  "options" | "formatLong" | "localize" | "match"
> {}

export type Locale = string | LocaleObj

function getLocaleScope() {
  // Use this cast to avoid messing with users globalThis (like window) and the rest of keys in the globalThis object we don't care about
  const scope = (typeof window !== "undefined"
    ? window
    : globalThis) as unknown as {
    __localeData__: Record<string, LocaleObj>
    __localeId__?: string
  }

  return scope
}

/**
 * Gets the default locale.
 *
 * @returns - The default locale.
 */
export function getDefaultLocale(): string | undefined {
  const scope = getLocaleScope()

  return scope.__localeId__
}

/**
 * Gets the locale object.
 *
 * @param localeSpec - The locale specification.
 * @returns - The locale object.
 */
export function getLocaleObject(localeSpec?: Locale): LocaleObj | undefined {
  if (typeof localeSpec === "string") {
    // Treat it as a locale name registered by registerLocale
    const scope = getLocaleScope()
    // Null was replaced with undefined to avoid type coercion
    return scope.__localeData__ ? scope.__localeData__[localeSpec] : undefined
  } else {
    // Treat it as a raw date-fns locale object
    return localeSpec
  }
}

type ParseDate = (
  value: string,
  dateFormat: string | string[],
  locale: Locale | undefined,
  strictParsing: boolean,
  minDate?: Date
) => Date | null
/**
 * Parses a date.
 *
 * @param value - The string representing the Date in a parsable form, e.g., ISO 1861
 * @param dateFormat - The date format.
 * @param locale - The locale.
 * @param strictParsing - The strict parsing flag.
 * @param minDate - The minimum date.
 * @returns - The parsed date or null.
 */
// prettier-ignore
export const parseDate: ParseDate = (value, dateFormat, locale, strictParsing, minDate?) => { // NOSONAR
  let parsedDate = null;
  const localeObject = getLocaleObject(locale) || getLocaleObject(getDefaultLocale());
  let strictParsingValueMatch = true;
  if (Array.isArray(dateFormat)) {
    dateFormat.forEach((df) => {
      const tryParseDate = parse(value, df, new Date(), {
        locale: localeObject,
        useAdditionalWeekYearTokens: true,
        useAdditionalDayOfYearTokens: true,
      });
      if (strictParsing) {
        strictParsingValueMatch =
          isValid(tryParseDate, minDate) && value === formatDate(tryParseDate, df, locale);
      }
      if (isValid(tryParseDate, minDate) && strictParsingValueMatch) {
        parsedDate = tryParseDate;
      }
    });
    return parsedDate;
  }

  parsedDate = parse(value, dateFormat, new Date(), {
    locale: localeObject,
    useAdditionalWeekYearTokens: true,
    useAdditionalDayOfYearTokens: true,
  });

  if (strictParsing) {
    strictParsingValueMatch =
      isValid(parsedDate) && value === formatDate(parsedDate, dateFormat, locale);
  } else if (!isValid(parsedDate)) {
    const format = (dateFormat.match(longFormattingTokensRegExp) ?? [])
      .map(function (substring) {
        const firstCharacter = substring[0];
        if (firstCharacter === 'p' || firstCharacter === 'P') {
          // The type in date-fns is `Record<string, LongFormatter>` so we can do our firstCharacter a bit loos but I don't think that this is a good idea
          const longFormatter = longFormatters[firstCharacter]!;
          return localeObject ? longFormatter(substring, localeObject.formatLong) : firstCharacter;
        }
        return substring;
      })
      .join('');

    if (value.length > 0) {
      parsedDate = parse(value, format.slice(0, value.length), new Date(), {
        useAdditionalWeekYearTokens: true,
        useAdditionalDayOfYearTokens: true,
      });
    }

    if (!isValid(parsedDate)) {
      parsedDate = new Date(value);
    }
  }

  return isValid(parsedDate) && strictParsingValueMatch ? parsedDate : null;
};

/**
 * Checks if a given date is valid and not before the minimum date.
 * @param date - The date to be checked.
 * @param minDate - The minimum date allowed. If not provided, defaults to "1/1/1800".
 * @returns A boolean value indicating whether the date is valid and not before the minimum date.
 */
export function isValid(date: Date, minDate?: Date): boolean {
  /* the fallback date is essential to not break test case
   * `should auto update calendar when the updated date text is after props.minDate`
   * and backward compatibility respectfully
   */
  const validDate = isValidDate(date)
  const isBeforeMinDate = minDate ? isBefore(date, minDate) : false
  return validDate && !isBeforeMinDate
}

/**
 * Formats a date.
 *
 * @param date - The date.
 * @param formatStr - The format string.
 * @param locale - The locale.
 * @returns - The formatted date.
 */
export function formatDate(
  date: Date,
  formatStr: string,
  locale?: Locale
): string {
  if (locale === "en") {
    return format(date, formatStr, {
      useAdditionalWeekYearTokens: true,
      useAdditionalDayOfYearTokens: true,
    })
  }
  let localeObj = locale ? getLocaleObject(locale) : undefined
  if (locale && !localeObj) {
    console.warn(
      `A locale object was not found for the provided string ["${locale}"].`
    )
  }
  if (
    !localeObj &&
    !!getDefaultLocale() &&
    !!getLocaleObject(getDefaultLocale())
  ) {
    localeObj = getLocaleObject(getDefaultLocale())
  }
  return format(date, formatStr, {
    locale: localeObj,
    useAdditionalWeekYearTokens: true,
    useAdditionalDayOfYearTokens: true,
  })
}

// This RegExp catches symbols escaped by quotes, and also
// sequences of symbols P, p, and the combinations like `PPPPPPPppppp`
const longFormattingTokensRegExp = /P+p+|P+|p+|''|'(''|[^'])+('|$)|./g // NOSONAR
