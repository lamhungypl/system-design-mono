"use client"

import { CheckCircle, Clock, Package, Truck } from "lucide-react"
import { DataTable, type ColumnType } from "~/components/data-table"

interface ReturnItem {
  sku: string
  name: string
  barcode: string
  price: number
  qty: number
  total: number
}

const orderItems: ReturnItem[] = [
  { sku: "1234561", name: "iPhone XS Max 256G", barcode: "100208", price: 8999, qty: 1, total: 8999 },
  { sku: "1234562", name: "iPhone XS Max 128G", barcode: "100207", price: 7999, qty: 2, total: 15998 },
  { sku: "1234563", name: "Apple Watch Series 4", barcode: "100206", price: 2999, qty: 1, total: 2999 },
]

const tableColumns: ColumnType<ReturnItem>[] = [
  { title: "SKU", dataIndex: "sku", render: (v) => <span className="font-mono text-xs">{v as string}</span> },
  { title: "Product Name", dataIndex: "name" },
  { title: "Barcode", dataIndex: "barcode" },
  { title: "Unit Price", dataIndex: "price", render: (v) => `¥${(v as number).toLocaleString()}` },
  { title: "Qty", dataIndex: "qty" },
  { title: "Total", dataIndex: "total", render: (v) => <span className="font-semibold">¥{(v as number).toLocaleString()}</span> },
]

const timeline = [
  { label: "Return Order Created", time: "2024-01-15 09:30", done: true, icon: <Clock className="size-3.5" /> },
  { label: "Warehouse Received", time: "2024-01-16 14:20", done: true, icon: <Package className="size-3.5" /> },
  { label: "Quality Inspection", time: "2024-01-17 10:00", done: true, icon: <CheckCircle className="size-3.5" /> },
  { label: "Refund Processing", time: "2024-01-18 11:30", done: false, icon: <Truck className="size-3.5" /> },
  { label: "Refund Complete", time: "Expected 2024-01-20", done: false, icon: <CheckCircle className="size-3.5" /> },
]

function DescItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-2 text-sm">
      <span className="text-muted-foreground w-28 shrink-0">{label}:</span>
      <span className="font-medium">{value}</span>
    </div>
  )
}

export default function ProfileBasic() {
  const grandTotal = orderItems.reduce((s, i) => s + i.total, 0)

  return (
    <div className="p-6 space-y-4">
      {/* Header */}
      <div className="rounded-xl border bg-card p-5">
        <div className="grid grid-cols-4 gap-4 text-center">
          {[
            { label: "Return Order", value: "1000000" },
            { label: "Status", value: "Pending Refund" },
            { label: "Sales Order", value: "298765765" },
            { label: "Sub-Order", value: "D3421" },
          ].map((item) => (
            <div key={item.label}>
              <div className="text-xs text-muted-foreground mb-1">{item.label}</div>
              <div className="font-semibold">{item.value}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {/* Customer Info + Table */}
        <div className="col-span-2 space-y-4">
          <div className="rounded-xl border bg-card p-5">
            <h2 className="font-semibold mb-4">User Information</h2>
            <div className="grid grid-cols-2 gap-3">
              <DescItem label="Customer" value="付小小" />
              <DescItem label="Phone" value="18100000000" />
              <DescItem label="Shipping Via" value="SF Express" />
              <DescItem label="Tracking #" value="SF123456789" />
              <DescItem label="Shipping Address" value="No.77 West Binhe Rd, Fengtai, Beijing" />
              <DescItem label="Notes" value="None" />
            </div>
          </div>

          <div className="rounded-xl border bg-card overflow-hidden">
            <div className="px-5 py-4 border-b font-semibold">Return Items</div>
            <DataTable
              columns={tableColumns}
              dataSource={orderItems}
              rowKey="sku"
              pagination={false}
              size="small"
              bordered
            />
            <div className="flex justify-between items-center px-5 py-3 border-t text-sm">
              <span className="font-semibold">Total:</span>
              <span className="font-bold text-primary text-base">¥{grandTotal.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div className="rounded-xl border bg-card p-5">
          <h2 className="font-semibold mb-4">Return Progress</h2>
          <div className="space-y-0">
            {timeline.map((step, i) => (
              <div key={i} className="flex gap-3">
                <div className="flex flex-col items-center">
                  <div className={`size-6 rounded-full flex items-center justify-center shrink-0 ${step.done ? "bg-primary text-primary-foreground" : "border-2 border-muted text-muted-foreground"}`}>
                    {step.icon}
                  </div>
                  {i < timeline.length - 1 && (
                    <div className={`w-0.5 h-10 mt-1 ${step.done ? "bg-primary" : "bg-muted"}`} />
                  )}
                </div>
                <div className="pb-8">
                  <div className={`text-sm font-medium ${step.done ? "" : "text-muted-foreground"}`}>{step.label}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">{step.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
