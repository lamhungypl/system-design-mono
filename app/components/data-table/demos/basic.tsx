"use client"

import { DataTable, useDataTable, type ColumnType } from "~/components/data-table"
import { DemoSection } from "~/components/ui/demo-block"
import { people, type Person } from "~/components/data-table/demos/sample-data"

const columns: ColumnType<Person>[] = [
  { title: "Name", dataIndex: "name", key: "name" },
  { title: "Age", dataIndex: "age", key: "age", align: "right" },
  { title: "Role", dataIndex: "role", key: "role" },
  { title: "City", dataIndex: "city", key: "city" },
]

const data = people.slice(0, 5)

export default function BasicDemo() {
  return (
    <div className="flex flex-col gap-6">
      <DemoSection label="Monolith API">
        <DataTable columns={columns} dataSource={data} pagination={false} />
      </DemoSection>

      <DemoSection label="Composition API">
        <CompositionBasic />
      </DemoSection>
    </div>
  )
}

function CompositionBasic() {
  const table = useDataTable<Person>({
    columns,
    dataSource: data,
    pagination: false,
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
