"use client"

import { Star, GitFork, Eye, Plus } from "lucide-react"
import { Button } from "~/components/ui/button"
import { Card } from "~/components/ui/card"

const cards = [
  { name: "Ant Design", desc: "A design system for enterprise-level products. Create an efficient and enjoyable work experience.", avatar: "🐜", color: "bg-orange-100", stars: 89211, forks: 18230, views: 4921, owner: "Ant Design Team" },
  { name: "Ant Design Pro", desc: "An out-of-box UI solution for enterprise applications as a React boilerplate.", avatar: "⚡", color: "bg-blue-100", stars: 34521, forks: 8920, views: 2310, owner: "Ant Design Team" },
  { name: "Pro Components", desc: "A component library for enterprise applications using Ant Design.", avatar: "🧩", color: "bg-purple-100", stars: 12340, forks: 2300, views: 890, owner: "Ant Design Team" },
  { name: "Umi", desc: "Pluggable enterprise-level react application framework.", avatar: "🦄", color: "bg-pink-100", stars: 14200, forks: 2800, views: 1100, owner: "Umi Team" },
  { name: "Qiankun", desc: "Implementing Micro Frontends for production.", avatar: "🏗", color: "bg-teal-100", stars: 15100, forks: 1790, views: 940, owner: "Ant Design Team" },
  { name: "ahooks", desc: "A high-quality & reliable React Hooks library.", avatar: "🪝", color: "bg-green-100", stars: 13900, forks: 1320, views: 780, owner: "Umi Team" },
  { name: "Dumi", desc: "Documentation tool for component development scenarios.", avatar: "📖", color: "bg-yellow-100", stars: 3400, forks: 420, views: 320, owner: "Umi Team" },
  { name: "Father", desc: "A package build tool based on rollup and babel.", avatar: "📦", color: "bg-red-100", stars: 4200, forks: 380, views: 290, owner: "Umi Team" },
  { name: "Ant Motion", desc: "Animation specification and components of Ant Design.", avatar: "🎬", color: "bg-indigo-100", stars: 4100, forks: 500, views: 440, owner: "Ant Design Team" },
]

export default function ListCard() {
  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Card List</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Browse projects in a card grid layout.</p>
        </div>
        <Button>
          <Plus className="size-4" /> New Project
        </Button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {cards.map((c) => (
          <Card key={c.name} bordered className="overflow-hidden hover:shadow-md transition-shadow p-0">
            <div className={`h-28 ${c.color} flex items-center justify-center text-5xl`}>
              {c.avatar}
            </div>
            <div className="p-4">
              <div className="font-semibold">{c.name}</div>
              <div className="text-xs text-muted-foreground mt-0.5 mb-2">{c.owner}</div>
              <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">{c.desc}</p>
              <div className="flex items-center gap-4 mt-3 pt-3 border-t text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Star className="size-3" />
                  {(c.stars / 1000).toFixed(1)}k
                </span>
                <span className="flex items-center gap-1">
                  <GitFork className="size-3" />
                  {(c.forks / 1000).toFixed(1)}k
                </span>
                <span className="flex items-center gap-1">
                  <Eye className="size-3" />
                  {c.views}
                </span>
              </div>
            </div>
          </Card>
        ))}

        {/* Add New Card */}
        <button className="rounded-xl border-2 border-dashed bg-muted/20 hover:bg-muted/40 transition-colors flex flex-col items-center justify-center gap-2 text-muted-foreground min-h-[220px]">
          <Plus className="size-8" />
          <span className="text-sm font-medium">New Project</span>
        </button>
      </div>
    </div>
  )
}
