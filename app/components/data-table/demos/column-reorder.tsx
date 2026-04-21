"use client"

import { useState } from "react"
import { DataTable, useDataTable, type ColumnType } from "~/components/data-table"
import { DemoSection } from "~/components/ui/demo-block"
import { people, type Person } from "~/components/data-table/demos/sample-data"

const columns: ColumnType<Person>[] = [
  { title: "Name", dataIndex: "name", key: "name" },
  { title: "Role", dataIndex: "role", key: "role" },
  { title: "Status", dataIndex: "status", key: "status" },
  { title: "City", dataIndex: "city", key: "city" },
  { title: "Joined", dataIndex: "joined", key: "joined" },
]

const defaultOrder = ["name", "role", "status", "city", "joined"]
const data = people.slice(0, 6)

function reorder(order: string[], sourceId: string, targetId: string) {
  const from = order.indexOf(sourceId)
  const to = order.indexOf(targetId)
  if (from === -1 || to === -1) return order
  const next = [...order]
  const [moved] = next.splice(from, 1)
  next.splice(to, 0, moved)
  return next
}

export default function ColumnReorderDemo() {
  return (
    <div className="flex flex-col gap-6">
      <DemoSection label="Monolith API — drag a column header onto another to reorder">
        <MonolithExample />
      </DemoSection>
      <DemoSection label="Composition API">
        <CompositionExample />
      </DemoSection>
    </div>
  )
}

function MonolithExample() {
  const [order, setOrder] = useState<string[]>(defaultOrder)
  return (
    <div className="flex flex-col gap-2">
      <p className="text-xs text-muted-foreground">Order: {order.join(" → ")}</p>
      <DataTable
        columns={columns}
        dataSource={data}
        pagination={false}
        columnOrder={order}
        onColumnReorder={(src, tgt) => setOrder((prev) => reorder(prev, src, tgt))}
      />
    </div>
  )
}

function CompositionExample() {
  const [order, setOrder] = useState<string[]>(defaultOrder)
  const table = useDataTable<Person>({
    columns,
    dataSource: data,
    pagination: false,
    columnOrder: order,
  })
  return (
    <div className="flex flex-col gap-2">
      <p className="text-xs text-muted-foreground">Order: {order.join(" → ")}</p>
      <DataTable.Root
        table={table}
        onColumnReorder={(src, tgt) => setOrder((prev) => reorder(prev, src, tgt))}
      >
        <DataTable.Container>
          <DataTable.Table>
            <DataTable.Header />
            <DataTable.Body />
          </DataTable.Table>
        </DataTable.Container>
      </DataTable.Root>
    </div>
  )
}
