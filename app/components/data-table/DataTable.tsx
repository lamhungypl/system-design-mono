import type { RowData } from "@tanstack/react-table"
import type { TableProps } from "./types"
import { useDataTable } from "./use-data-table"
import * as Parts from "./parts"

function DataTableImpl<T extends RowData>(
  props: TableProps<T> & {
    stickyHeader?: boolean
    onColumnReorder?: (sourceId: string, targetId: string) => void
  },
) {
  const {
    loading,
    size,
    bordered,
    showHeader,
    locale,
    expandable,
    pagination,
    className,
    scroll,
    infinite,
    stickyHeader,
    onColumnReorder,
  } = props
  const table = useDataTable(props)

  return (
    <Parts.Root<T>
      table={table}
      size={size}
      bordered={bordered}
      showHeader={showHeader}
      loading={loading}
      emptyText={locale?.emptyText}
      expandedRowRender={expandable?.expandedRowRender}
      rowExpandable={expandable?.rowExpandable}
      scrollY={scroll?.y}
      stickyHeader={stickyHeader}
      infinite={infinite}
      onColumnReorder={onColumnReorder}
      className={className}
    >
      <Parts.Container>
        <Parts.Table>
          <Parts.Header />
          <Parts.Body />
        </Parts.Table>
      </Parts.Container>
      {pagination !== false && (
        <Parts.Pagination
          pageSizeOptions={pagination?.pageSizeOptions}
          showSizeChanger={pagination?.showSizeChanger ?? true}
          showTotal={pagination?.showTotal}
        />
      )}
    </Parts.Root>
  )
}

const DataTable = Object.assign(DataTableImpl, {
  Root: Parts.Root,
  Toolbar: Parts.Toolbar,
  Container: Parts.Container,
  Table: Parts.Table,
  Header: Parts.Header,
  Body: Parts.Body,
  Pagination: Parts.Pagination,
})

export { DataTable }
