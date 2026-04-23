"use client"

import { useState } from "react"
import { Link } from "react-router"
import { ArrowUpRight, Star, MessageSquare, ThumbsUp } from "lucide-react"
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { Tabs } from "~/components/ui/tabs"
import { Tag } from "~/components/ui/tag"

const articles = [
  { id: 1, title: "Ant Design 4.0 Release Notes and Migration Guide", author: "付小小", date: "2024-01-15", stars: 456, likes: 892, comments: 34, category: "Design", tags: ["Ant Design", "UI"] },
  { id: 2, title: "Building Enterprise Applications with Ant Design Pro", author: "曲丽丽", date: "2024-01-20", stars: 312, likes: 654, comments: 21, category: "Tutorial", tags: ["Pro", "React"] },
  { id: 3, title: "Design Tokens and Theming in Modern React Applications", author: "林东东", date: "2024-02-01", stars: 278, likes: 543, comments: 17, category: "Design", tags: ["Tokens", "CSS"] },
  { id: 4, title: "Performance Optimization Techniques for Large Data Tables", author: "周星星", date: "2024-02-10", stars: 198, likes: 421, comments: 29, category: "Performance", tags: ["Table", "React"] },
  { id: 5, title: "Micro Frontend Architecture with Qiankun and React", author: "吴加好", date: "2024-02-15", stars: 334, likes: 765, comments: 42, category: "Architecture", tags: ["MicroFE", "Qiankun"] },
]

const categories = ["All", "Design", "Tutorial", "Performance", "Architecture"]
const owners = ["All", "My", "Collab"]

const searchTabs = [
  { key: "articles", label: "Articles" },
  { key: "projects", label: <Link to="/templates/list/search/projects">Projects</Link> },
  { key: "applications", label: <Link to="/templates/list/search/applications">Applications</Link> },
]

export default function ListSearchArticles() {
  const [activeCategory, setActiveCategory] = useState("All")
  const [activeOwner, setActiveOwner] = useState("All")

  return (
    <div className="p-6 space-y-4">
      <div className="rounded-xl border bg-card p-4">
        <div className="flex gap-2 mb-4">
          <Input placeholder="Search articles..." className="flex-1" allowClear prefix={
            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="size-4"><circle cx="6.5" cy="6.5" r="4.5" /><path d="M10 10l3.5 3.5" /></svg>
          } />
          <Button>Search</Button>
        </div>

        <Tabs
          items={searchTabs}
          activeKey="articles"
          type="line"
          className="mb-3"
        />

        <div className="flex flex-wrap gap-6 text-sm">
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">Owner:</span>
            {owners.map((o) => (
              <button
                key={o}
                onClick={() => setActiveOwner(o)}
                className={`text-xs px-2 py-0.5 rounded transition-colors ${activeOwner === o ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground"}`}
              >
                {o}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">Category:</span>
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
      </div>

      <div className="space-y-3">
        {articles
          .filter((a) => activeCategory === "All" || a.category === activeCategory)
          .map((a) => (
            <div key={a.id} className="rounded-xl border bg-card p-5 hover:shadow-sm transition-shadow">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-semibold text-sm hover:text-primary cursor-pointer">{a.title}</h3>
                  <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                    {a.tags.map((tag) => (
                      <Tag key={tag} color="primary">{tag}</Tag>
                    ))}
                    <Tag>{a.category}</Tag>
                  </div>
                </div>
                <Button variant="ghost" size="xs" className="text-primary shrink-0">
                  Read <ArrowUpRight className="size-3" />
                </Button>
              </div>
              <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                <span className="font-medium text-foreground">{a.author}</span>
                <span>{a.date}</span>
                <span className="flex items-center gap-1"><Star className="size-3" />{a.stars}</span>
                <span className="flex items-center gap-1"><ThumbsUp className="size-3" />{a.likes}</span>
                <span className="flex items-center gap-1"><MessageSquare className="size-3" />{a.comments}</span>
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
