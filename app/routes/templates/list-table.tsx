"use client"

import { useState } from "react"
import { Settings, Bell, ChevronDown, ChevronUp } from "lucide-react"
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { Select } from "~/components/ui/select"
import { DataTable, type ColumnType } from "~/components/data-table"
import { Tag } from "~/components/ui/tag"

interface Rule {
  id: number
  name: string
  desc: string
  calls: number
  status: "running" | "online" | "offline"
  scheduled: string
}

const rules: Rule[] = [
  { id: 1, name: "TradeCode-01", desc: "This is a description", calls: 1023456, status: "running", scheduled: "2024-01-01 10:00" },
  { id: 2, name: "TradeCode-02", desc: "This is a description", calls: 983214, status: "online", scheduled: "2024-01-02 08:00" },
  { id: 3, name: "TradeCode-03", desc: "This is a description", calls: 856432, status: "running", scheduled: "2024-01-03 14:00" },
  { id: 4, name: "TradeCode-04", desc: "This is a description", calls: 745123, status: "offline", scheduled: "2024-01-04 09:00" },
  { id: 5, name: "TradeCode-05", desc: "This is a description", calls: 634789, status: "online", scheduled: "2024-01-05 11:00" },
  { id: 6, name: "TradeCode-06", desc: "This is a description", calls: 523456, status: "running", scheduled: "2024-01-06 13:00" },
  { id: 7, name: "TradeCode-07", desc: "This is a description", calls: 412345, status: "offline", scheduled: "2024-01-07 16:00" },
  { id: 8, name: "TradeCode-08", desc: "This is a description", calls: 301234, status: "online", scheduled: "2024-01-08 10:30" },
]

const statusTagColor: Record<Rule["status"], string> = {
  running: "processing",
  online: "success",
  offline: "default",
}

const statusOptions = [
  { value: "", label: "All" },
  { value: "running", label: "Running" },
  { value: "online", label: "Online" },
  { value: "offline", label: "Offline" },
]

export default function ListTable() {
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [expanded, setExpanded] = useState(false)
  const [selectedKeys, setSelectedKeys] = useState<(string | number)[]>([])

  const filtered = rules.filter((r) => {
    const matchSearch =
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.desc.toLowerCase().includes(search.toLowerCase())
    const matchStatus = !statusFilter || r.status === statusFilter
    return matchSearch && matchStatus
  })

  const columns: ColumnType<Rule>[] = [
    {
      title: "Rule Name",
      dataIndex: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
      render: (val) => <span className="font-medium text-primary">{val as string}</span>,
    },
    { title: "Description", dataIndex: "desc" },
    {
      title: "Service Calls",
      dataIndex: "calls",
      sorter: (a, b) => a.calls - b.calls,
      render: (val) => (val as number).toLocaleString(),
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (val) => (
        <Tag color={statusTagColor[val as Rule["status"]]}>
          {val as string}
        </Tag>
      ),
    },
    { title: "Last Scheduled", dataIndex: "scheduled" },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <div className="flex gap-3 text-xs text-primary">
          <button className="hover:underline flex items-center gap-1">
            <Settings className="size-3" /> Configure
          </button>
          <button className="hover:underline flex items-center gap-1">
            <Bell className="size-3" /> Subscribe
          </button>
        </div>
      ),
    },
  ]

  return (
    <div className="p-6 space-y-4">
      <div>
        <h1 className="text-xl font-semibold">Search Table</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Query and manage rule configurations.</p>
      </div>

      {/* Search Form */}
      <div className="rounded-xl border bg-card p-4">
        <div className="flex flex-wrap gap-3 items-end">
          <div>
            <label className="text-xs text-muted-foreground block mb-1">Rule Name</label>
            <Input
              placeholder="Enter rule name"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-48"
              allowClear
              onClear={() => setSearch("")}
            />
          </div>
          {expanded && (
            <div>
              <label className="text-xs text-muted-foreground block mb-1">Status</label>
              <Select
                options={statusOptions}
                value={statusFilter}
                onChange={setStatusFilter}
                className="w-40"
              />
            </div>
          )}
          <div className="flex gap-2 items-center">
            <Button size="sm" onClick={() => {}}>Query</Button>
            <Button size="sm" variant="outline" onClick={() => { setSearch(""); setStatusFilter("") }}>Reset</Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setExpanded(!expanded)}
              className="text-primary gap-1"
            >
              {expanded ? "Collapse" : "Expand"}
              {expanded ? <ChevronUp className="size-3" /> : <ChevronDown className="size-3" />}
            </Button>
          </div>
        </div>
      </div>

      {/* DataTable */}
      <DataTable
        columns={columns}
        dataSource={filtered}
        rowKey="id"
        rowSelection={{
          type: "checkbox",
          selectedRowKeys: selectedKeys,
          onChange: (keys) => setSelectedKeys(keys as (string | number)[]),
        }}
        pagination={{ defaultPageSize: 5, showSizeChanger: true }}
        bordered
      />
    </div>
  )
}
