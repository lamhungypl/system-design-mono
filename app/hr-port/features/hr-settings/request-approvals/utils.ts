import { isBefore } from "date-fns/isBefore"

import { stringToDate } from "~/hr-port/utils/date"

export const isFilterDateRangeValid = (
  startDateValue: string,
  endDateValue: string
) => {
  if (startDateValue && endDateValue) {
    const startDate = stringToDate(startDateValue, "yyyy-MM-dd")
    const endDate = stringToDate(endDateValue, "yyyy-MM-dd")
    if (startDate && endDate && isBefore(endDate, startDate)) {
      return false
    }
  }
  return true
}
