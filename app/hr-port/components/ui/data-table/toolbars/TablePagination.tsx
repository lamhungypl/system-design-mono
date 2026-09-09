import { forwardRef, HTMLProps, ReactNode } from "react"
import { useTranslation } from "react-i18next"

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "~/hr-port/components/base/pagination"
import {
  PaginationParams,
  useTablePagination,
} from "~/hr-port/components/ui/data-table/hooks/use-table-pagination"
import {
  defaultLabelDisplayedRows,
  DOTS,
  LabelDisplayedRowsParams,
} from "~/hr-port/components/ui/data-table/utils/pagination-utils"
import PaginationButton from "~/hr-port/components/ui/pagination-button/pagination-button"
import Select from "~/hr-port/components/ui/select/Select"
import { pageSizeOptions } from "~/hr-port/constants"
import { cn } from "~/hr-port/utils/style"

type Props = {
  labelDisplayedRows?: (params: LabelDisplayedRowsParams) => ReactNode
  labelRowsPerPage?: ReactNode
  onPageChange: (page: number) => void
  onRowsPerPageChange: (rowsPerPage: number) => void
  pageIndex: number
  rowsPerPage: number
  rowsPerPageOptions?: any[]
  slotProps?: {
    infoWrapper?: HTMLProps<HTMLDivElement>
  }
  totalCount: number
  totalPages: number
} & HTMLProps<HTMLDivElement> &
  Pick<PaginationParams, "boundaries" | "siblings">

const TablePagination = forwardRef<HTMLDivElement, Props>((props, ref) => {
  const {
    pageIndex,
    onPageChange,
    rowsPerPage,
    totalCount,
    totalPages,
    onRowsPerPageChange,
    labelDisplayedRows = defaultLabelDisplayedRows,
    labelRowsPerPage: labelRowsPerPageProp,
    boundaries,
    siblings,
    slotProps,
    ...rest
  } = props
  const { t } = useTranslation()
  const labelRowsPerPage =
    labelRowsPerPageProp ?? `${t("common.table.pagination.rows_per_page")}:`

  const { active, next, previous, paginationRange, setPage } =
    useTablePagination({
      total: totalPages,
      page: pageIndex + 1,
      onChange: onPageChange,
      boundaries,
      siblings,
    })

  return (
    <div
      {...rest}
      ref={ref}
      className={cn("flex items-center justify-end gap-4 py-3", rest.className)}
    >
      <div
        {...slotProps?.infoWrapper}
        className={cn(
          "flex items-center gap-4",
          slotProps?.infoWrapper?.className
        )}
      >
        <span className="text-xs text-[#5F656A]">
          {labelDisplayedRows({
            from: totalCount === 0 ? 0 : pageIndex * rowsPerPage + 1,
            to: Math.min(totalCount, (pageIndex + 1) * rowsPerPage),
            count: totalCount,
          })}
        </span>
        <span className="text-primary-100 inline-flex items-center gap-2 text-xs">
          <span>{labelRowsPerPage}</span>
          <Select
            value={rowsPerPage.toString()}
            placeholder={rowsPerPage.toString()}
            onChange={(v) => onRowsPerPageChange(Number(v))}
            options={pageSizeOptions}
            className="border-none focus:ring-0"
            allowClear={false}
          />
        </span>
      </div>
      <div className="flex items-center justify-center">
        <Pagination>
          <PaginationContent className="gap-2">
            <PaginationItem key="prev">
              <PaginationButton
                asChild
                onClick={previous}
                disabled={active === 1}
              >
                <PaginationPrevious
                  slotProps={{
                    icon: {
                      className: cn({
                        "text-[#5F656A]": active > 1,
                        "text-[#BFBFBF]": active <= 1,
                      }),
                    },
                  }}
                />
              </PaginationButton>
            </PaginationItem>

            {paginationRange.map((pageItem, index) => {
              if (pageItem === DOTS) {
                return (
                  // prettier-ignore
                  <PaginationItem key={pageItem + index}> {/* NOSONAR */}
                    <PaginationButton asChild onClick={() => {}}>
                      <PaginationEllipsis />
                    </PaginationButton>
                  </PaginationItem>
                )
              }
              return (
                <PaginationItem key={pageItem}>
                  <PaginationButton
                    isActive={active === pageItem}
                    asChild
                    onClick={() => setPage(pageItem)}
                  >
                    <PaginationLink>{pageItem}</PaginationLink>
                  </PaginationButton>
                </PaginationItem>
              )
            })}

            <PaginationItem key="next">
              <PaginationButton asChild onClick={next}>
                <PaginationNext
                  slotProps={{
                    icon: {
                      className: cn({
                        "text-[#5F656A]": active < totalPages,
                        "text-[#BFBFBF]": active >= totalPages,
                      }),
                    },
                  }}
                />
              </PaginationButton>
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  )
})
TablePagination.displayName = "TablePagination"
export default TablePagination
