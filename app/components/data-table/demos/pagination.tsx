"use client"

import { DataTable, useDataTable, type ColumnType } from "~/components/data-table"
import { DemoSection } from "~/components/ui/demo-block"
import { people, type Person } from "~/components/data-table/demos/sample-data"

const columns: ColumnType<Person>[] = [
  { title: "Name", dataIndex: "name" },
  { title: "Role", dataIndex: "role" },
  { title: "City", dataIndex: "city" },
  { title: "Joined", dataIndex: "joined" },
]

export default function PaginationDemo() {
  return (
    <div className="flex flex-col gap-6">
      <DemoSection label="Monolith API">
        <DataTable
          columns={columns}
          dataSource={people}
          pagination={{
            defaultPageSize: 5,
            pageSizeOptions: [5, 10, 20],
            showSizeChanger: true,
          }}
        />
      </DemoSection>

      <DemoSection label="Composition API">
        <Composed />
      </DemoSection>
    </div>
  )
}

function Composed() {
  const table = useDataTable<Person>({
    columns,
    dataSource: people,
    pagination: { defaultPageSize: 5 },
  })
  return (
    <DataTable.Root table={table}>
      <DataTable.Container>
        <DataTable.Table>
          <DataTable.Header />
          <DataTable.Body />
        </DataTable.Table>
      </DataTable.Container>
      <DataTable.Pagination pageSizeOptions={[5, 10, 20]} />
    </DataTable.Root>
  )
}
