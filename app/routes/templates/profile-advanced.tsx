"use client"

import { Clock } from "lucide-react"
import { DataTable, type ColumnType } from "~/components/data-table"
import { Steps } from "~/components/ui/steps"
import { Tabs } from "~/components/ui/tabs"
import { Tag } from "~/components/ui/tag"

interface SubOrder {
  id: string
  product: string
  merchant: string
  status: "Processing" | "Shipped" | "Delivered"
  amount: number
  logistics: string
}

const subOrders: SubOrder[] = [
  { id: "D3421", product: "iPhone XS Max 256G", merchant: "Apple Official Store", status: "Processing", amount: 8999, logistics: "SF-123456" },
  { id: "D3422", product: "AirPods Pro", merchant: "Apple Official Store", status: "Shipped", amount: 1999, logistics: "YT-987654" },
  { id: "D3423", product: "Apple Pencil 2", merchant: "Third-party Store A", status: "Delivered", amount: 899, logistics: "STO-456789" },
]

const statusColor: Record<SubOrder["status"], "processing" | "warning" | "success"> = {
  Processing: "processing",
  Shipped: "warning",
  Delivered: "success",
}

const orderColumns: ColumnType<SubOrder>[] = [
  { title: "Sub-Order ID", dataIndex: "id", render: (v) => <span className="font-mono text-xs text-primary">{v as string}</span> },
  { title: "Product", dataIndex: "product" },
  { title: "Merchant", dataIndex: "merchant", render: (v) => <span className="text-xs text-muted-foreground">{v as string}</span> },
  {
    title: "Status",
    dataIndex: "status",
    render: (v) => <Tag color={statusColor[v as SubOrder["status"]]}>{v as string}</Tag>,
  },
  { title: "Amount", dataIndex: "amount", render: (v) => <span className="font-semibold">¥{(v as number).toLocaleString()}</span> },
  { title: "Logistics #", dataIndex: "logistics", render: (v) => <span className="font-mono text-xs text-muted-foreground">{v as string}</span> },
]

const stepItems = [
  { title: "Order Placed" },
  { title: "Warehouse Processing" },
  { title: "Shipped" },
  { title: "Delivered" },
]

const tabItems = [
  {
    key: "all",
    label: "All Orders",
    children: <DataTable columns={orderColumns} dataSource={subOrders} rowKey="id" size="small" pagination={false} />,
  },
  {
    key: "processing",
    label: "Processing",
    children: <DataTable columns={orderColumns} dataSource={subOrders.filter((o) => o.status === "Processing")} rowKey="id" size="small" pagination={false} />,
  },
  {
    key: "shipped",
    label: "Shipped",
    children: <DataTable columns={orderColumns} dataSource={subOrders.filter((o) => o.status === "Shipped")} rowKey="id" size="small" pagination={false} />,
  },
  {
    key: "delivered",
    label: "Delivered",
    children: <DataTable columns={orderColumns} dataSource={subOrders.filter((o) => o.status === "Delivered")} rowKey="id" size="small" pagination={false} />,
  },
]

function DescItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="text-sm">
      <div className="text-muted-foreground text-xs mb-0.5">{label}</div>
      <div className="font-medium">{value}</div>
    </div>
  )
}

export default function ProfileAdvanced() {
  return (
    <div className="p-6 space-y-4">
      {/* Status Steps */}
      <div className="rounded-xl border bg-card p-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="font-semibold">Order #298765765</h1>
          <span className="text-sm text-muted-foreground">Placed on 2024-01-15</span>
        </div>
        <Steps current={2} items={stepItems} />
      </div>

      {/* Order Info */}
      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-xl border bg-card p-5">
          <h2 className="font-semibold mb-4">Shipping Information</h2>
          <div className="grid grid-cols-2 gap-4">
            <DescItem label="Recipient" value="付小小" />
            <DescItem label="Phone" value="18100000000" />
            <DescItem label="Address" value="No.77 West Binhe Rd" />
            <DescItem label="City" value="Beijing, Fengtai" />
            <DescItem label="Postcode" value="100000" />
            <DescItem label="Country" value="China" />
          </div>
        </div>
        <div className="rounded-xl border bg-card p-5">
          <h2 className="font-semibold mb-4">Payment Information</h2>
          <div className="grid grid-cols-2 gap-4">
            <DescItem label="Payment Method" value="Alipay" />
            <DescItem label="Account" value="ant****@alipay.com" />
            <DescItem label="Subtotal" value="¥11,897" />
            <DescItem label="Shipping" value="Free" />
            <DescItem label="Discount" value="-¥200" />
            <DescItem label="Total" value="¥11,697" />
          </div>
        </div>
      </div>

      {/* Sub-orders with Tabs */}
      <div className="rounded-xl border bg-card overflow-hidden">
        <Tabs items={tabItems} defaultActiveKey="all" type="line" className="px-2" />
      </div>

      {/* Timeline */}
      <div className="rounded-xl border bg-card p-5">
        <h2 className="font-semibold mb-4">Order Timeline</h2>
        <div className="relative pl-6">
          <div className="absolute left-2 top-2 bottom-2 w-0.5 bg-muted" />
          {[
            { time: "2024-01-15 08:00", event: "Order placed by 付小小" },
            { time: "2024-01-15 08:05", event: "Payment confirmed via Alipay" },
            { time: "2024-01-15 10:00", event: "Order assigned to Apple Official Store" },
            { time: "2024-01-16 09:00", event: "Warehouse processing started" },
            { time: "2024-01-17 14:30", event: "Shipped via SF Express (SF-123456)" },
            { time: "Expected 2024-01-20", event: "Delivery to recipient", pending: true },
          ].map((e, i) => (
            <div key={i} className="flex gap-3 mb-4 relative">
              <div className={`absolute -left-6 mt-1 size-2 rounded-full border-2 bg-background ${e.pending ? "border-muted" : "border-primary"}`} />
              <div>
                <div className={`text-xs font-medium ${e.pending ? "text-muted-foreground" : ""}`}>{e.event}</div>
                <div className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                  <Clock className="size-3" />{e.time}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
