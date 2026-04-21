"use client"

import { DataTable, useDataTable, type ColumnType } from "~/components/data-table"
import { DemoSection } from "~/components/ui/demo-block"
import { people, type Person } from "~/components/data-table/demos/sample-data"

const columns: ColumnType<Person>[] = [
  { title: "Name", dataIndex: "name" },
  { title: "Role", dataIndex: "role" },
  { title: "City", dataIndex: "city" },
]

const data = people.slice(0, 5)

function ExpandedPanel({ record }: { record: Person }) {
  return (
    <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-xs">
      <dt className="font-medium text-muted-foreground">Status</dt>
      <dd>{record.status}</dd>
      <dt className="font-medium text-muted-foreground">Joined</dt>
      <dd>{record.joined}</dd>
      <dt className="font-medium text-muted-foreground">Age</dt>
      <dd>{record.age}</dd>
    </dl>
  )
}

export default function ExpandableDemo() {
  return (
    <div className="flex flex-col gap-6">
      <DemoSection label="Monolith API">
        <DataTable
          columns={columns}
          dataSource={data}
          pagination={false}
          expandable={{
            expandedRowRender: (record) => <ExpandedPanel record={record} />,
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
    dataSource: data,
    pagination: false,
    expandable: { expandedRowRender: (r) => <ExpandedPanel record={r} /> },
  })
  return (
    <DataTable.Root
      table={table}
      expandedRowRender={(r) => <ExpandedPanel record={r} />}
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
