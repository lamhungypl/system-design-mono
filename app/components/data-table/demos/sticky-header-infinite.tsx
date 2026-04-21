"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { DataTable, useDataTable, type ColumnType } from "~/components/data-table"
import { DemoSection } from "~/components/ui/demo-block"
import { people, type Person } from "~/components/data-table/demos/sample-data"

const columns: ColumnType<Person>[] = [
  { title: "Name", dataIndex: "name" },
  { title: "Role", dataIndex: "role", sorter: (a, b) => a.role.localeCompare(b.role) },
  { title: "Status", dataIndex: "status" },
  { title: "City", dataIndex: "city" },
  { title: "Joined", dataIndex: "joined" },
]

function useFakeInfinite() {
  const [rows, setRows] = useState<Person[]>(people.slice(0, 8))
  const [loading, setLoading] = useState(false)
  const mountedRef = useRef(false)
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([])
  useEffect(() => {
    mountedRef.current = true
    return () => {
      mountedRef.current = false
      timersRef.current.forEach(clearTimeout)
    }
  }, [])
  const hasMore = rows.length < 80
  const onLoadMore = useCallback(() => {
    if (loading || !hasMore || !mountedRef.current) return
    setLoading(true)
    const t = setTimeout(() => {
      if (!mountedRef.current) return
      setRows((prev) => {
        const start = prev.length
        const next = Array.from({ length: 8 }, (_, i) => {
          const seed = people[(start + i) % people.length]
          return { ...seed, key: String(start + i + 1) }
        })
        return [...prev, ...next]
      })
      setLoading(false)
    }, 600)
    timersRef.current.push(t)
  }, [loading, hasMore])
  return { rows, loading, hasMore, onLoadMore }
}

export default function StickyHeaderInfiniteDemo() {
  return (
    <div className="flex flex-col gap-6">
      <DemoSection label="Monolith API — setting scroll.y enables a sticky header automatically">
        <MonolithExample />
      </DemoSection>
      <DemoSection label="Composition API — pass scrollY on DataTable.Root">
        <CompositionExample />
      </DemoSection>
    </div>
  )
}

function MonolithExample() {
  const { rows, loading, hasMore, onLoadMore } = useFakeInfinite()
  return (
    <DataTable
      columns={columns}
      dataSource={rows}
      pagination={false}
      scroll={{ y: 280 }}
      infinite={{ hasMore, loading, onLoadMore }}
    />
  )
}

function CompositionExample() {
  const { rows, loading, hasMore, onLoadMore } = useFakeInfinite()
  const table = useDataTable<Person>({ columns, dataSource: rows, pagination: false })
  return (
    <DataTable.Root
      table={table}
      scrollY={280}
      stickyHeader
      infinite={{ hasMore, loading, onLoadMore }}
    >
      <DataTable.Container>
        <DataTable.Table>
          <DataTable.Header />
          <DataTable.Body />
        </DataTable.Table>
      </DataTable.Container>
    </DataTable.Root>
  )
}
