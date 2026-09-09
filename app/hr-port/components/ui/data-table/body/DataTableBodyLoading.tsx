import { RowData, Table } from "@tanstack/react-table"
import { forwardRef } from "react"

import { Skeleton } from "~/hr-port/components/base/skeleton"
type Props<T extends RowData> = {
  className?: string
  table: Table<T>
}

const DataTableBodyLoading = forwardRef<
  HTMLTableSectionElement,
  Props<unknown>
>(
  // PORT: the source's render function takes only `props`, which React 19 warns
  // about ("Did you forget to use the ref parameter?"). The ref is now forwarded to
  // the <tbody> it was declared for.
  function DataTableBodyLoadingInner(props, ref) {
    const { table } = props
    const { getState } = table
    const {
      pagination: { pageSize },
    } = getState()

    return (
      <tbody ref={ref} style={{ display: "grid" }}>
        {Array(pageSize)
          .fill(1)
          .map((_, index) => (
            <tr key={index} style={{ display: "flex", width: "100%" }}>
              <td className="pt-1.5" style={{ flexGrow: 1 }}>
                <Skeleton className="h-6 w-full rounded" />
              </td>
            </tr>
          ))}
      </tbody>
    )
  }
)

export default DataTableBodyLoading
