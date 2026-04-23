"use client"

import {
  RadialBarChart,
  RadialBar,
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts"
import { Activity, Cpu, HardDrive, Wifi, CheckCircle, AlertCircle, XCircle } from "lucide-react"
import { cn } from "~/lib/utils"

const gauges = [
  { name: "CPU Usage", value: 72, color: "#1677ff", icon: <Cpu className="size-4" /> },
  { name: "Memory", value: 58, color: "#00b96b", icon: <HardDrive className="size-4" /> },
  { name: "Network I/O", value: 41, color: "#faad14", icon: <Wifi className="size-4" /> },
  { name: "Throughput", value: 89, color: "#ff4d4f", icon: <Activity className="size-4" /> },
]

const trafficData = [
  { time: "00:00", inbound: 120, outbound: 85 },
  { time: "03:00", inbound: 80, outbound: 60 },
  { time: "06:00", inbound: 200, outbound: 150 },
  { time: "09:00", inbound: 450, outbound: 300 },
  { time: "12:00", inbound: 600, outbound: 420 },
  { time: "15:00", inbound: 520, outbound: 380 },
  { time: "18:00", inbound: 480, outbound: 350 },
  { time: "21:00", inbound: 320, outbound: 240 },
]

const servers = [
  { host: "106.14.98.143", cpu: "12%", mem: "32%", status: "online", region: "Shanghai" },
  { host: "112.96.0.143", cpu: "78%", mem: "66%", status: "warning", region: "Guangzhou" },
  { host: "39.130.115.163", cpu: "43%", mem: "51%", status: "online", region: "Beijing" },
  { host: "104.28.199.34", cpu: "5%", mem: "18%", status: "online", region: "Shenzhen" },
  { host: "172.16.44.26", cpu: "91%", mem: "88%", status: "error", region: "Hangzhou" },
]

const alerts = [
  { level: "error", msg: "High CPU usage on 172.16.44.26", time: "2m ago" },
  { level: "warning", msg: "Memory above 60% on 112.96.0.143", time: "8m ago" },
  { level: "info", msg: "Deployment completed on prod-01", time: "15m ago" },
  { level: "info", msg: "SSL certificate renewed", time: "1h ago" },
]

function StatusIcon({ status }: { status: string }) {
  if (status === "online") return <CheckCircle className="size-4 text-green-500" />
  if (status === "warning") return <AlertCircle className="size-4 text-yellow-500" />
  return <XCircle className="size-4 text-red-500" />
}

function GaugeCard({ gauge }: { gauge: (typeof gauges)[0] }) {
  const data = [{ value: gauge.value, fill: gauge.color }, { value: 100 - gauge.value, fill: "#f5f5f5" }]
  return (
    <div className="rounded-xl border bg-card p-5 text-center">
      <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground mb-1">
        <span className="text-foreground">{gauge.icon}</span>
        {gauge.name}
      </div>
      <div style={{ height: 120 }}>
        <ResponsiveContainer width="100%" height="100%">
          <RadialBarChart cx="50%" cy="70%" innerRadius="60%" outerRadius="90%" startAngle={180} endAngle={0} data={data}>
            <RadialBar dataKey="value" cornerRadius={4} />
          </RadialBarChart>
        </ResponsiveContainer>
      </div>
      <div className="text-3xl font-bold -mt-6" style={{ color: gauge.color }}>
        {gauge.value}%
      </div>
    </div>
  )
}

export default function DashboardMonitor() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-xl font-semibold">Monitor</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Real-time system health and infrastructure metrics</p>
      </div>

      {/* Top metrics */}
      <div className="grid grid-cols-4 gap-4">
        <div className="rounded-xl border bg-card p-5">
          <div className="text-sm text-muted-foreground mb-1">Total Requests / Day</div>
          <div className="text-3xl font-semibold">1.2M</div>
          <div className="mt-2 flex items-center gap-1 text-xs text-green-600">
            <CheckCircle className="size-3" /> All systems operational
          </div>
        </div>
        <div className="rounded-xl border bg-card p-5">
          <div className="text-sm text-muted-foreground mb-1">Avg Response Time</div>
          <div className="text-3xl font-semibold">84ms</div>
          <div className="mt-2 text-xs text-muted-foreground">P99: 320ms</div>
        </div>
        <div className="rounded-xl border bg-card p-5">
          <div className="text-sm text-muted-foreground mb-1">Error Rate</div>
          <div className="text-3xl font-semibold text-red-500">0.32%</div>
          <div className="mt-2 text-xs text-muted-foreground">24h errors: 3,840</div>
        </div>
        <div className="rounded-xl border bg-card p-5">
          <div className="text-sm text-muted-foreground mb-1">Uptime</div>
          <div className="text-3xl font-semibold text-green-600">99.98%</div>
          <div className="mt-2 text-xs text-muted-foreground">Last incident: 12d ago</div>
        </div>
      </div>

      {/* Gauges */}
      <div className="grid grid-cols-4 gap-4">
        {gauges.map((g) => (
          <GaugeCard key={g.name} gauge={g} />
        ))}
      </div>

      {/* Traffic Area Chart */}
      <div className="rounded-xl border bg-card p-6">
        <h2 className="font-semibold mb-4">Network Traffic (24h)</h2>
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={trafficData}>
            <defs>
              <linearGradient id="gradIn" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#1677ff" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#1677ff" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="gradOut" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#00b96b" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#00b96b" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="time" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip />
            <Area type="monotone" dataKey="inbound" name="Inbound (MB/s)" stroke="#1677ff" fill="url(#gradIn)" strokeWidth={2} />
            <Area type="monotone" dataKey="outbound" name="Outbound (MB/s)" stroke="#00b96b" fill="url(#gradOut)" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {/* Server table */}
        <div className="col-span-2 rounded-xl border bg-card p-6">
          <h2 className="font-semibold mb-4">Server Status</h2>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs text-muted-foreground border-b">
                <th className="text-left pb-2">Host</th>
                <th className="text-left pb-2">Region</th>
                <th className="text-left pb-2">CPU</th>
                <th className="text-left pb-2">Memory</th>
                <th className="text-left pb-2">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {servers.map((s) => (
                <tr key={s.host}>
                  <td className="py-2.5 font-mono text-xs">{s.host}</td>
                  <td className="py-2.5 text-muted-foreground">{s.region}</td>
                  <td className="py-2.5">
                    <span className={cn("font-medium", parseFloat(s.cpu) > 80 ? "text-red-500" : parseFloat(s.cpu) > 60 ? "text-yellow-600" : "text-green-600")}>
                      {s.cpu}
                    </span>
                  </td>
                  <td className="py-2.5">
                    <span className={cn("font-medium", parseFloat(s.mem) > 80 ? "text-red-500" : parseFloat(s.mem) > 60 ? "text-yellow-600" : "text-green-600")}>
                      {s.mem}
                    </span>
                  </td>
                  <td className="py-2.5"><StatusIcon status={s.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Alerts */}
        <div className="rounded-xl border bg-card p-6">
          <h2 className="font-semibold mb-4">Recent Alerts</h2>
          <div className="space-y-3">
            {alerts.map((a, i) => (
              <div key={i} className="flex gap-3">
                <div className={cn("size-2 rounded-full mt-1.5 shrink-0", a.level === "error" ? "bg-red-500" : a.level === "warning" ? "bg-yellow-500" : "bg-blue-400")} />
                <div>
                  <p className="text-xs leading-relaxed">{a.msg}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{a.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
