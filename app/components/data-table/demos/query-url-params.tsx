"use client"

import { useMemo } from "react"
import { useSearchParams } from "react-router"
import { useQuery, queryOptions } from "@tanstack/react-query"
import { DataTable, type ColumnType } from "~/components/data-table"
import { Select } from "~/components/ui/select"
import { DemoSection } from "~/components/ui/demo-block"
import { people, type Person } from "~/components/data-table/demos/sample-data"

const columns: ColumnType<Person>[] = [
  { title: "Name", dataIndex: "name" },
  { title: "Role", dataIndex: "role" },
  { title: "Status", dataIndex: "status" },
  { title: "City", dataIndex: "city" },
]

interface ListParams {
  page: number
  pageSize: number
  role: string
  status: string
}

interface ListResponse {
  rows: Person[]
  total: number
}

// Mocked API: filters + paginates client-side over our sample data, but simulates a
// server round-trip with a small delay so the loading state is visible.
async function fetchPeople(params: ListParams): Promise<ListResponse> {
  await new Promise((r) => setTimeout(r, 400))
  const filtered = people.filter(
    (p) =>
      (!params.role || p.role === params.role) &&
      (!params.status || p.status === params.status),
  )
  const start = (params.page - 1) * params.pageSize
  return {
    rows: filtered.slice(start, start + params.pageSize),
    total: filtered.length,
  }
}

const peopleListQuery = (params: ListParams) =>
  queryOptions({
    queryKey: ["people", "list", params],
    queryFn: () => fetchPeople(params),
    placeholderData: (prev) => prev,
  })

function usePeopleList() {
  const [searchParams, setSearchParams] = useSearchParams()

  const params: ListParams = useMemo(
    () => ({
      page: Math.max(1, Number(searchParams.get("page") ?? "1")),
      pageSize: Math.max(1, Number(searchParams.get("size") ?? "5")),
      role: searchParams.get("role") ?? "",
      status: searchParams.get("status") ?? "",
    }),
    [searchParams],
  )

  const { data, isFetching } = useQuery(peopleListQuery(params))

  const setParam = (key: string, value: string, { resetPage = false } = {}) => {
    setParams({ [key]: value }, { resetPage })
  }

  const setParams = (
    patch: Record<string, string>,
    { resetPage = false }: { resetPage?: boolean } = {},
  ) => {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev)
        Object.entries(patch).forEach(([k, v]) => {
          if (v) next.set(k, v)
          else next.delete(k)
        })
        if (resetPage) next.set("page", "1")
        return next
      },
      { replace: true },
    )
  }

  return { params, data, isFetching, setParam, setParams }
}

export default function QueryUrlParamsDemo() {
  return (
    <div className="flex flex-col gap-6">
      <DemoSection label="Server-driven list with useQuery — filter + page state live in the URL (look at ?role=&status=&page=&size=)">
        <Example />
      </DemoSection>
    </div>
  )
}

function Example() {
  const { params, data, isFetching, setParam, setParams } = usePeopleList()

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-end gap-3 rounded-lg border border-border bg-muted/30 p-3">
        <label className="flex flex-col gap-1">
          <span className="text-xs text-muted-foreground">Role</span>
          <Select
            size="small"
            value={params.role}
            onChange={(v) => setParam("role", v, { resetPage: true })}
            options={[
              { value: "", label: "Any" },
              { value: "Engineer", label: "Engineer" },
              { value: "Designer", label: "Designer" },
              { value: "PM", label: "PM" },
              { value: "Analyst", label: "Analyst" },
            ]}
            className="w-40"
          />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-xs text-muted-foreground">Status</span>
          <Select
            size="small"
            value={params.status}
            onChange={(v) => setParam("status", v, { resetPage: true })}
            options={[
              { value: "", label: "Any" },
              { value: "Active", label: "Active" },
              { value: "Invited", label: "Invited" },
              { value: "Paused", label: "Paused" },
            ]}
            className="w-40"
          />
        </label>
        <p className="ml-auto text-xs text-muted-foreground">
          {isFetching ? "Fetching…" : `${data?.total ?? 0} matches`}
        </p>
      </div>

      <DataTable<Person>
        columns={columns}
        dataSource={data?.rows ?? []}
        loading={isFetching && !data}
        pagination={{
          current: params.page,
          pageSize: params.pageSize,
          total: data?.total ?? 0,
          pageSizeOptions: [5, 10, 20],
          onChange: (page, size) => {
            setParams({ page: String(page), size: String(size) })
          },
        }}
      />
    </div>
  )
}
