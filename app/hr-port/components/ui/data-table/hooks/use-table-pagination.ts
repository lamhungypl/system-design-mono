import { useControllableValue } from "ahooks"
import { useCallback, useMemo } from "react"

import {
  DOTS,
  range,
} from "~/hr-port/components/ui/data-table/utils/pagination-utils"

export type PaginationParams = {
  /**
   *  @description number of page numbers displayed at  end of the pagination.
   */
  boundaries?: number
  initialPage?: number
  onChange?: (page: number) => void

  /**
   * @description page in 1-based indexing
   */
  page?: number
  siblings?: number
  total: number
}
export type PaginationReturns = {
  /**
   * @description active page in 1-based indexing
   */
  active: number
  first: () => void
  last: () => void
  next: () => void
  paginationRange: Array<number | typeof DOTS>
  previous: () => void
  setPage: (pageNumber: number) => void
}

export const useTablePagination = (props: PaginationParams) => {
  const { total: total_, siblings = 0, boundaries = 1 } = props

  const total = Math.max(Math.trunc(total_), 0)
  const [activePage, setActivePage] = useControllableValue(props, {
    valuePropName: "page",
    trigger: "onChange",
    defaultValuePropName: "initialPage",
    defaultValue: 1,
  })

  const setPage = useCallback(
    (pageNumber: number) => {
      if (pageNumber <= 0) {
        setActivePage(1)
      } else if (pageNumber > total) {
        setActivePage(total)
      } else {
        setActivePage(pageNumber)
      }
    },
    [total, setActivePage]
  )

  const next = useCallback(() => setPage(activePage + 1), [activePage, setPage])
  const previous = useCallback(
    () => setPage(activePage - 1),
    [activePage, setPage]
  )
  const first = useCallback(() => setPage(1), [setPage])
  const last = useCallback(() => setPage(total), [total, setPage])

  const paginationRange = useMemo<PaginationReturns["paginationRange"]>(() => {
    const totalPageNumbers = siblings * 2 + 3 + boundaries

    if (totalPageNumbers >= total) {
      return range(1, total)
    }

    const leftSiblingIndex = Math.max(activePage - siblings, boundaries)
    const rightSiblingIndex = Math.min(
      activePage + siblings,
      total - boundaries
    )

    const shouldShowLeftDots = leftSiblingIndex > boundaries + 2
    const shouldShowRightDots = rightSiblingIndex < total - (boundaries + 1)

    if (!shouldShowLeftDots && shouldShowRightDots) {
      const leftItemCount = siblings * 2 + boundaries + 2
      return [
        ...range(1, leftItemCount),
        DOTS,
        ...range(total - (boundaries - 1), total),
      ]
    }

    if (shouldShowLeftDots && !shouldShowRightDots) {
      const rightItemCount = boundaries + 1 + 2 * siblings
      return [
        ...range(1, boundaries),
        DOTS,
        ...range(total - rightItemCount, total),
      ]
    }

    return [
      ...range(1, boundaries),
      DOTS,
      ...range(leftSiblingIndex, rightSiblingIndex),
      DOTS,
      ...range(total - boundaries + 1, total),
    ]
  }, [activePage, boundaries, siblings, total])

  return {
    paginationRange: paginationRange,
    active: activePage,
    setPage,
    next,
    previous,
    first,
    last,
  } satisfies PaginationReturns
}
