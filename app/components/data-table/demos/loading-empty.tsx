"use client"

import { useState } from "react"
import { DataTable, useDataTable, type ColumnType } from "~/components/data-table"
import { Button } from "~/components/ui/button"
import { Empty } from "~/components/ui/empty"
import { DemoSection } from "~/components/ui/demo-block"
import { people, type Person } from "~/components/data-table/demos/sample-data"

const columns: ColumnType<Person>[] = [
  { title: "Name", dataIndex: "name" },
  { title: "Role", dataIndex: "role" },
  { title: "City", dataIndex: "city" },
]

export default function LoadingEmptyDemo() {
  const [loading, setLoading] = useState(false)

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-2">
        <Button
          size="sm"
          variant="outline"
          disabled={loading}
          onClick={() => {
            setLoading(true)
            setTimeout(() => setLoading(false), 1000)
          }}
        >
          {loading ? "Loading…" : "Simulate load"}
        </Button>
      </div>

      <DemoSection label="Loading — Monolith API">
        <DataTable
          columns={columns}
          dataSource={people.slice(0, 4)}
          pagination={false}
          loading={loading}
        />
      </DemoSection>

      <DemoSection label="Loading — Composition API">
        <LoadingComposed loading={loading} />
      </DemoSection>

      <DemoSection label="Empty — Monolith API">
        <DataTable<Person>
          columns={columns}
          dataSource={[]}
          pagination={false}
          locale={{
            emptyText: <Empty description="No people found" />,
          }}
        />
      </DemoSection>

      <DemoSection label="Empty — Composition API">
        <EmptyComposed />
      </DemoSection>
    </div>
  )
}

function LoadingComposed({ loading }: { loading: boolean }) {
  const table = useDataTable<Person>({
    columns,
    dataSource: people.slice(0, 4),
    pagination: false,
  })
  return (
    <DataTable.Root table={table} loading={loading}>
      <DataTable.Container>
        <DataTable.Table>
          <DataTable.Header />
          <DataTable.Body />
        </DataTable.Table>
      </DataTable.Container>
    </DataTable.Root>
  )
}

function EmptyComposed() {
  const table = useDataTable<Person>({
    columns,
    dataSource: [],
    pagination: false,
  })
  return (
    <DataTable.Root table={table} emptyText={<Empty description="No people found" />}>
      <DataTable.Container>
        <DataTable.Table>
          <DataTable.Header />
          <DataTable.Body />
        </DataTable.Table>
      </DataTable.Container>
    </DataTable.Root>
  )
}
