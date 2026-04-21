"use client"

import { useState } from "react"
import { DataTable, useDataTable, type ColumnType } from "~/components/data-table"
import { Button } from "~/components/ui/button"
import { DemoSection } from "~/components/ui/demo-block"
import { people, type Person } from "~/components/data-table/demos/sample-data"

const columns: ColumnType<Person>[] = [
  { title: "Name", dataIndex: "name", key: "name" },
  { title: "Role", dataIndex: "role", key: "role" },
  { title: "Status", dataIndex: "status", key: "status" },
  { title: "City", dataIndex: "city", key: "city" },
]

export default function RowGroupingDemo() {
  return (
    <div className="flex flex-col gap-6">
      <DemoSection label="Monolith API — pass grouping={['status']} to group rows by the status field">
        <MonolithExample />
      </DemoSection>
      <DemoSection label="Composition API — controlled grouping state">
        <CompositionExample />
      </DemoSection>
    </div>
  )
}

function MonolithExample() {
  const [grouping, setGrouping] = useState<string[]>(["status"])
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <span className="text-xs text-muted-foreground">Group by:</span>
        {(["status", "role"] as const).map((g) => (
          <Button
            key={g}
            size="xs"
            variant={grouping[0] === g ? "default" : "outline"}
            onClick={() => setGrouping([g])}
          >
            {g}
          </Button>
        ))}
        <Button
          size="xs"
          variant={grouping.length === 0 ? "default" : "outline"}
          onClick={() => setGrouping([])}
        >
          none
        </Button>
      </div>
      <DataTable
        columns={columns}
        dataSource={people}
        pagination={false}
        grouping={grouping}
        onGroupingChange={setGrouping}
      />
    </div>
  )
}

function CompositionExample() {
  const [grouping, setGrouping] = useState<string[]>(["role"])
  const table = useDataTable<Person>({
    columns,
    dataSource: people,
    pagination: false,
    grouping,
    onGroupingChange: setGrouping,
  })
  return (
    <DataTable.Root table={table}>
      <DataTable.Container>
        <DataTable.Table>
          <DataTable.Header />
          <DataTable.Body />
        </DataTable.Table>
      </DataTable.Container>
    </DataTable.Root>
  )
}
