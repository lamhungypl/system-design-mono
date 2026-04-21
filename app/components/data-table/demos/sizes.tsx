"use client"

import { DataTable, useDataTable, type ColumnType, type TableSize } from "~/components/data-table"
import { DemoSection } from "~/components/ui/demo-block"
import { people, type Person } from "~/components/data-table/demos/sample-data"

const columns: ColumnType<Person>[] = [
  { title: "Name", dataIndex: "name" },
  { title: "Role", dataIndex: "role" },
  { title: "City", dataIndex: "city" },
]

const data = people.slice(0, 4)
const sizeList: TableSize[] = ["small", "middle", "large"]

export default function SizesDemo() {
  return (
    <div className="flex flex-col gap-6">
      {sizeList.map((size) => (
        <div key={size} className="flex flex-col gap-3">
          <p className="text-xs font-medium text-muted-foreground capitalize">{size}</p>
          <div className="flex flex-col gap-6">
            <DemoSection label="Monolith API">
              <DataTable columns={columns} dataSource={data} pagination={false} size={size} />
            </DemoSection>
            <DemoSection label="Composition API">
              <Composed size={size} />
            </DemoSection>
          </div>
        </div>
      ))}
    </div>
  )
}

function Composed({ size }: { size: TableSize }) {
  const table = useDataTable<Person>({ columns, dataSource: data, pagination: false })
  return (
    <DataTable.Root table={table} size={size}>
      <DataTable.Container>
        <DataTable.Table>
          <DataTable.Header />
          <DataTable.Body />
        </DataTable.Table>
      </DataTable.Container>
    </DataTable.Root>
  )
}
