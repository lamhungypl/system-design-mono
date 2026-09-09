import i18n from "~/hr-port/config/i18n"

const { t } = i18n
export const DOTS = "dots"

export const range = (start: number, end: number) => {
  const length = end - start + 1
  return Array.from({ length }, (_, index) => index + start)
}

export type LabelDisplayedRowsParams = {
  count: number
  from: number
  to: number
}

export const defaultLabelDisplayedRows = (params: LabelDisplayedRowsParams) => {
  const { from, to, count } = params
  return t("common.table.pagination.displayed_rows", { from, to, count })
}
