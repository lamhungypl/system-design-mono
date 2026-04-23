"use client"

import { useState } from "react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  Legend,
} from "recharts"
import { TrendingUp, TrendingDown, ArrowUpRight } from "lucide-react"
import { cn } from "~/lib/utils"

const salesData = [
  { month: "Jan", value: 820 },
  { month: "Feb", value: 932 },
  { month: "Mar", value: 901 },
  { month: "Apr", value: 934 },
  { month: "May", value: 1290 },
  { month: "Jun", value: 1330 },
  { month: "Jul", value: 1320 },
  { month: "Aug", value: 900 },
  { month: "Sep", value: 870 },
  { month: "Oct", value: 1100 },
  { month: "Nov", value: 980 },
  { month: "Dec", value: 1150 },
]

const visitData = [
  { date: "Jan 1", users: 320 },
  { date: "Feb 1", users: 450 },
  { date: "Mar 1", users: 280 },
  { date: "Apr 1", users: 590 },
  { date: "May 1", users: 430 },
  { date: "Jun 1", users: 680 },
  { date: "Jul 1", users: 720 },
  { date: "Aug 1", users: 550 },
]

const categoryData = [
  { name: "Online", value: 48, color: "#1677ff" },
  { name: "Store", value: 31, color: "#00b96b" },
  { name: "Other", value: 21, color: "#faad14" },
]

const storeData = [
  { date: "Jan", store0: 120, store1: 85, store2: 160, store3: 90, store4: 140 },
  { date: "Feb", store0: 145, store1: 100, store2: 140, store3: 115, store4: 110 },
  { date: "Mar", store0: 100, store1: 130, store2: 175, store3: 80, store4: 160 },
  { date: "Apr", store0: 160, store1: 95, store2: 120, store3: 140, store4: 130 },
  { date: "May", store0: 130, store1: 150, store2: 100, store3: 160, store4: 90 },
  { date: "Jun", store0: 170, store1: 110, store2: 145, store3: 120, store4: 175 },
]

const searchTerms = [
  { rank: 1, term: "Pro Design System", users: 12321, pct: 83 },
  { rank: 2, term: "Ant Design", users: 10321, pct: 78 },
  { rank: 3, term: "UI Component Library", users: 9321, pct: 65 },
  { rank: 4, term: "Dashboard Template", users: 7521, pct: 58 },
  { rank: 5, term: "React Charts", users: 5621, pct: 47 },
]

const STORE_COLORS = ["#1677ff", "#00b96b", "#faad14", "#ff4d4f", "#722ed1"]

function StatCard({
  title,
  value,
  trend,
  trendLabel,
  sub,
  chart,
}: {
  title: string
  value: string
  trend: number
  trendLabel: string
  sub?: string
  chart?: React.ReactNode
}) {
  const up = trend >= 0
  return (
    <div className="rounded-xl border bg-card p-6">
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm text-muted-foreground">{title}</span>
      </div>
      <div className="text-3xl font-semibold mb-2">{value}</div>
      {chart && <div className="h-12 mb-3">{chart}</div>}
      <div className="flex items-center gap-4 text-xs text-muted-foreground border-t pt-3 mt-3">
        <span className="flex items-center gap-1">
          {trendLabel}:
          <span className={cn("flex items-center font-medium", up ? "text-green-600" : "text-red-500")}>
            {up ? <TrendingUp className="size-3" /> : <TrendingDown className="size-3" />}
            {Math.abs(trend)}%
          </span>
        </span>
        {sub && <span>{sub}</span>}
      </div>
    </div>
  )
}

const sparkSales = [40, 60, 50, 80, 55, 90, 70, 100, 85]
const sparkVisits = [30, 45, 60, 40, 70, 55, 80]

function Sparkline({ data, color }: { data: number[]; color: string }) {
  const max = Math.max(...data)
  const min = Math.min(...data)
  const range = max - min || 1
  const w = 80
  const h = 40
  const pts = data
    .map((v, i) => {
      const x = (i / (data.length - 1)) * w
      const y = h - ((v - min) / range) * h
      return `${x},${y}`
    })
    .join(" ")
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
      <polyline points={pts} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function MiniBarChart({ data, color }: { data: number[]; color: string }) {
  const max = Math.max(...data)
  const h = 40
  const barW = 8
  const gap = 4
  return (
    <svg width={(barW + gap) * data.length} height={h}>
      {data.map((v, i) => {
        const barH = (v / max) * h
        return (
          <rect
            key={i}
            x={i * (barW + gap)}
            y={h - barH}
            width={barW}
            height={barH}
            rx="2"
            fill={color}
            opacity="0.8"
          />
        )
      })}
    </svg>
  )
}

function MiniProgress({ value, color }: { value: number; color: string }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
        <div className="h-full rounded-full" style={{ width: `${value}%`, backgroundColor: color }} />
      </div>
      <span className="text-xs text-muted-foreground">{value}%</span>
    </div>
  )
}

export default function DashboardAnalysis() {
  const [activeTab, setActiveTab] = useState<"sales" | "visits">("sales")

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-xl font-semibold">Analysis</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Dashboard overview of key business metrics</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-4 gap-4">
        <StatCard
          title="Total Sales"
          value="¥126,560"
          trend={12}
          trendLabel="Week-over-week"
          sub="Daily: ¥12,423"
          chart={<Sparkline data={sparkSales} color="#1677ff" />}
        />
        <StatCard
          title="Visits"
          value="8,846"
          trend={8}
          trendLabel="Week-over-week"
          chart={<MiniBarChart data={[30, 45, 60, 50, 80, 65, 90]} color="#1677ff" />}
        />
        <StatCard
          title="Payments"
          value="6,560"
          trend={-3}
          trendLabel="Week-over-week"
          chart={<Sparkline data={sparkVisits} color="#00b96b" />}
        />
        <StatCard
          title="Campaign Effectiveness"
          value="78%"
          trend={5}
          trendLabel="Week-over-week"
          chart={<MiniProgress value={78} color="#faad14" />}
        />
      </div>

      {/* Sales Bar Chart */}
      <div className="rounded-xl border bg-card p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold">Store Sales Ranking</h2>
          <div className="flex gap-1">
            {(["sales", "visits"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setActiveTab(t)}
                className={cn(
                  "px-3 py-1 text-xs rounded-md transition-colors",
                  activeTab === t ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted",
                )}
              >
                {t === "sales" ? "Sales Amount" : "Visits"}
              </button>
            ))}
          </div>
        </div>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={salesData} margin={{ top: 4, right: 12, bottom: 0, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="month" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip />
            <Bar dataKey="value" fill="#1677ff" radius={[3, 3, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Three-column lower section */}
      <div className="grid grid-cols-3 gap-4">
        {/* Search Rankings Table */}
        <div className="rounded-xl border bg-card p-6">
          <h2 className="font-semibold mb-4">Top Online Searches</h2>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs text-muted-foreground">
                <th className="text-left pb-2">#</th>
                <th className="text-left pb-2">Search Term</th>
                <th className="text-right pb-2">Users</th>
                <th className="text-right pb-2">Rate</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {searchTerms.map((row) => (
                <tr key={row.rank}>
                  <td className="py-2 text-muted-foreground">{row.rank}</td>
                  <td className="py-2 font-medium truncate max-w-[100px]">{row.term}</td>
                  <td className="py-2 text-right">{row.users.toLocaleString()}</td>
                  <td className="py-2 text-right flex items-center justify-end gap-1">
                    <ArrowUpRight className="size-3 text-green-500" />
                    {row.pct}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* User visits line chart */}
        <div className="rounded-xl border bg-card p-6">
          <h2 className="font-semibold mb-4">User Visits</h2>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={visitData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Line type="monotone" dataKey="users" stroke="#1677ff" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Sales category donut */}
        <div className="rounded-xl border bg-card p-6">
          <h2 className="font-semibold mb-4">Sales by Category</h2>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={75}
                paddingAngle={2}
                dataKey="value"
              >
                {categoryData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-2 space-y-1">
            {categoryData.map((d) => (
              <div key={d.name} className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5">
                  <span className="size-2 rounded-full inline-block" style={{ backgroundColor: d.color }} />
                  {d.name}
                </span>
                <span className="text-muted-foreground">{d.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Multi-store area chart */}
      <div className="rounded-xl border bg-card p-6">
        <h2 className="font-semibold mb-4">Store Performance</h2>
        <ResponsiveContainer width="100%" height={260}>
          <AreaChart data={storeData}>
            <defs>
              {[0, 1, 2, 3, 4].map((i) => (
                <linearGradient key={i} id={`grad${i}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={STORE_COLORS[i]} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={STORE_COLORS[i]} stopOpacity={0} />
                </linearGradient>
              ))}
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="date" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip />
            <Legend />
            {[0, 1, 2, 3, 4].map((i) => (
              <Area
                key={i}
                type="monotone"
                dataKey={`store${i}`}
                name={`Store ${i}`}
                stroke={STORE_COLORS[i]}
                fill={`url(#grad${i})`}
                strokeWidth={2}
              />
            ))}
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
