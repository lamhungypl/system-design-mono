"use client"

import { Link } from "react-router"
import { Star, GitFork, Eye } from "lucide-react"
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { Tabs } from "~/components/ui/tabs"
import { Tag } from "~/components/ui/tag"

const projects = [
  { id: 1, name: "Ant Design System", desc: "Enterprise-class UI design language and React component library.", lang: "TypeScript", stars: 89211, forks: 18230, views: 4921, owner: "Ant Design", updated: "2024-02-20", active: true },
  { id: 2, name: "Ant Design Pro", desc: "Out-of-box UI solution for enterprise applications as a React boilerplate.", lang: "TypeScript", stars: 34521, forks: 8920, views: 2310, owner: "Ant Design", updated: "2024-02-18", active: true },
  { id: 3, name: "Umi Framework", desc: "Pluggable enterprise-level react application framework.", lang: "TypeScript", stars: 14200, forks: 2800, views: 1100, owner: "Umi Team", updated: "2024-02-15", active: false },
  { id: 4, name: "Qiankun MicroFE", desc: "Implementing micro-frontends for production use cases.", lang: "JavaScript", stars: 15100, forks: 1790, views: 940, owner: "Ant Design", updated: "2024-02-10", active: true },
  { id: 5, name: "ahooks Library", desc: "A high-quality and reliable React Hooks library.", lang: "TypeScript", stars: 13900, forks: 1320, views: 780, owner: "Umi Team", updated: "2024-02-08", active: false },
]

const langColor: Record<string, "primary" | "success" | "warning"> = {
  TypeScript: "primary",
  JavaScript: "warning",
}

const searchTabs = [
  { key: "articles", label: <Link to="/templates/list/search/articles">Articles</Link> },
  { key: "projects", label: "Projects" },
  { key: "applications", label: <Link to="/templates/list/search/applications">Applications</Link> },
]

export default function ListSearchProjects() {
  return (
    <div className="p-6 space-y-4">
      <div className="rounded-xl border bg-card p-4">
        <div className="flex gap-2 mb-4">
          <Input placeholder="Search projects..." className="flex-1" allowClear prefix={
            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="size-4"><circle cx="6.5" cy="6.5" r="4.5" /><path d="M10 10l3.5 3.5" /></svg>
          } />
          <Button>Search</Button>
        </div>

        <Tabs items={searchTabs} activeKey="projects" type="line" className="mb-3" />

        <div className="flex gap-6 text-sm">
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">Owner:</span>
            {["All", "My", "Contributed"].map((o) => (
              <button key={o} className="text-xs px-2 py-0.5 rounded text-muted-foreground hover:text-foreground transition-colors">{o}</button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">Language:</span>
            {["All", "TypeScript", "JavaScript"].map((l) => (
              <button key={l} className="text-xs px-2 py-0.5 rounded text-muted-foreground hover:text-foreground transition-colors">{l}</button>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {projects.map((p) => (
          <div key={p.id} className="rounded-xl border bg-card p-5 hover:shadow-sm transition-shadow">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-semibold text-sm hover:text-primary cursor-pointer">{p.name}</h3>
                  <Tag color={langColor[p.lang] ?? "default"}>{p.lang}</Tag>
                  {p.active && <Tag color="success">Active</Tag>}
                </div>
                <p className="text-xs text-muted-foreground mt-1">{p.desc}</p>
              </div>
              <span className="text-xs text-muted-foreground shrink-0">{p.owner}</span>
            </div>
            <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
              <span>Updated {p.updated}</span>
              <span className="flex items-center gap-1"><Star className="size-3" />{p.stars.toLocaleString()}</span>
              <span className="flex items-center gap-1"><GitFork className="size-3" />{p.forks.toLocaleString()}</span>
              <span className="flex items-center gap-1"><Eye className="size-3" />{p.views.toLocaleString()}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-center gap-1 pt-2">
        {[1, 2, 3, 4, 5].map((p) => (
          <Button key={p} variant={p === 1 ? "default" : "ghost"} size="icon-sm">{p}</Button>
        ))}
      </div>
    </div>
  )
}
