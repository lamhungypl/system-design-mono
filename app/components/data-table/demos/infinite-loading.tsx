"use client"

import { useMemo } from "react"
import { useInfiniteQuery, infiniteQueryOptions } from "@tanstack/react-query"
import { DataTable, useDataTable, type ColumnType } from "~/components/data-table"
import { DemoSection } from "~/components/ui/demo-block"
import { people, type Person } from "~/components/data-table/demos/sample-data"

const columns: ColumnType<Person>[] = [
  { title: "#", render: (_v, _r, i) => i + 1, width: 60 },
  { title: "Name", dataIndex: "name" },
  { title: "Role", dataIndex: "role" },
  { title: "City", dataIndex: "city" },
]

interface Page {
  rows: Person[]
  nextPage: number | null
}

// Mocked queryFn — in a real app this would fetch from an API.
async function fetchPeoplePage(pageParam: number, pageSize: number): Promise<Page> {
  await new Promise((r) => setTimeout(r, 500))
  const start = pageParam * pageSize
  const end = Math.min(start + pageSize, 60)
  if (start >= 60) return { rows: [], nextPage: null }
  const rows = Array.from({ length: end - start }, (_, i) => {
    const seed = people[(start + i) % people.length]
    return { ...seed, key: String(start + i + 1) }
  })
  return { rows, nextPage: end >= 60 ? null : pageParam + 1 }
}

const pageSize = 6
const peopleQuery = infiniteQueryOptions({
  queryKey: ["people", "infinite", pageSize],
  queryFn: ({ pageParam }) => fetchPeoplePage(pageParam, pageSize),
  initialPageParam: 0,
  getNextPageParam: (lastPage) => lastPage.nextPage,
})

function usePeopleInfinite() {
  const { data, isFetching, hasNextPage, fetchNextPage } = useInfiniteQuery(peopleQuery)
  const rows = useMemo(
    () => (data?.pages ?? []).flatMap((p) => p.rows),
    [data],
  )
  return {
    rows,
    loading: isFetching,
    hasMore: !!hasNextPage,
    onLoadMore: () => fetchNextPage(),
  }
}

export default function InfiniteLoadingDemo() {
  return (
    <div className="flex flex-col gap-6">
      <DemoSection label="Monolith API — useInfiniteQuery drives the data, queryFn is mocked">
        <MonolithExample />
      </DemoSection>
      <DemoSection label="Composition API">
        <CompositionExample />
      </DemoSection>
    </div>
  )
}

function MonolithExample() {
  const { rows, loading, hasMore, onLoadMore } = usePeopleInfinite()
  return (
    <DataTable
      columns={columns}
      dataSource={rows}
      pagination={false}
      scroll={{ y: 260 }}
      infinite={{ hasMore, loading, onLoadMore }}
    />
  )
}

function CompositionExample() {
  const { rows, loading, hasMore, onLoadMore } = usePeopleInfinite()
  const table = useDataTable<Person>({ columns, dataSource: rows, pagination: false })
  return (
    <DataTable.Root
      table={table}
      scrollY={260}
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
