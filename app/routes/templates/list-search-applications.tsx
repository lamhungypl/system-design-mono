"use client"

import { useState } from "react"
import { Link } from "react-router"
import { Download, Star, Users } from "lucide-react"
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { Tabs } from "~/components/ui/tabs"
import { Tag } from "~/components/ui/tag"

const apps = [
  { id: 1, name: "Ant Design Pro", category: "Admin Template", icon: "⚡", iconBg: "bg-blue-100", rating: 4.8, downloads: 128340, users: 45200, desc: "Out-of-the-box enterprise admin solution built with Ant Design.", status: "stable" },
  { id: 2, name: "Umi Admin", category: "Admin Template", icon: "🦄", iconBg: "bg-pink-100", rating: 4.6, downloads: 89230, users: 32100, desc: "A powerful admin starter based on Umi.js and Ant Design.", status: "stable" },
  { id: 3, name: "Material Pro", category: "Dashboard", icon: "💎", iconBg: "bg-purple-100", rating: 4.4, downloads: 67890, users: 24500, desc: "Material design based dashboard with dark mode support.", status: "beta" },
  { id: 4, name: "Vue Admin", category: "Admin Template", icon: "🟢", iconBg: "bg-green-100", rating: 4.5, downloads: 112000, users: 41000, desc: "Enterprise admin template powered by Vue 3 and Ant Design Vue.", status: "stable" },
  { id: 5, name: "Next Dashboard", category: "Dashboard", icon: "▲", iconBg: "bg-gray-100", rating: 4.3, downloads: 45600, users: 18900, desc: "Full-stack dashboard built with Next.js App Router.", status: "beta" },
  { id: 6, name: "Remix Admin", category: "Full-Stack", icon: "💿", iconBg: "bg-indigo-100", rating: 4.2, downloads: 23400, users: 9800, desc: "Modern full-stack admin using Remix and Radix UI.", status: "experimental" },
]

const statusColor: Record<string, "success" | "warning" | "default"> = {
  stable: "success",
  beta: "warning",
  experimental: "default",
}

const searchTabs = [
  { key: "articles", label: <Link to="/templates/list/search/articles">Articles</Link> },
  { key: "projects", label: <Link to="/templates/list/search/projects">Projects</Link> },
  { key: "applications", label: "Applications" },
]

export default function ListSearchApplications() {
  const [activeCategory, setActiveCategory] = useState("All")

  const categories = ["All", ...Array.from(new Set(apps.map((a) => a.category)))]
  const filtered = activeCategory === "All" ? apps : apps.filter((a) => a.category === activeCategory)

  return (
    <div className="p-6 space-y-4">
      <div className="rounded-xl border bg-card p-4">
        <div className="flex gap-2 mb-4">
          <Input placeholder="Search applications..." className="flex-1" allowClear prefix={
            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="size-4"><circle cx="6.5" cy="6.5" r="4.5" /><path d="M10 10l3.5 3.5" /></svg>
          } />
          <Button>Search</Button>
        </div>

        <Tabs items={searchTabs} activeKey="applications" type="line" className="mb-3" />

        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Category:</span>
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setActiveCategory(c)}
              className={`text-xs px-2 py-0.5 rounded transition-colors ${activeCategory === c ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground"}`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {filtered.map((app) => (
          <div key={app.id} className="rounded-xl border bg-card p-4 hover:shadow-sm transition-shadow">
            <div className="flex gap-3">
              <div className={`size-12 rounded-xl ${app.iconBg} flex items-center justify-center text-2xl shrink-0`}>
                {app.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-semibold text-sm">{app.name}</span>
                  <Tag color={statusColor[app.status]}>{app.status}</Tag>
                </div>
                <div className="text-xs text-muted-foreground">{app.category}</div>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-3 leading-relaxed line-clamp-2">{app.desc}</p>
            <div className="flex items-center gap-4 mt-3 pt-3 border-t text-xs text-muted-foreground">
              <span className="flex items-center gap-1"><Star className="size-3 fill-yellow-400 text-yellow-400" />{app.rating}</span>
              <span className="flex items-center gap-1"><Download className="size-3" />{(app.downloads / 1000).toFixed(0)}k</span>
              <span className="flex items-center gap-1"><Users className="size-3" />{(app.users / 1000).toFixed(0)}k users</span>
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-center gap-1 pt-2">
        {[1, 2, 3].map((p) => (
          <Button key={p} variant={p === 1 ? "default" : "ghost"} size="icon-sm">{p}</Button>
        ))}
      </div>
    </div>
  )
}
