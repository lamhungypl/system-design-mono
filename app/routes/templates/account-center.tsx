"use client"

import { MapPin, LinkIcon, Globe, Star, MessageSquare, ThumbsUp } from "lucide-react"
import { Avatar } from "~/components/ui/avatar"
import { Tag } from "~/components/ui/tag"
import { Tabs } from "~/components/ui/tabs"

const articles = [
  { title: "Ant Design 4.0 Release Notes", date: "2024-01-15", stars: 456, likes: 892, comments: 34 },
  { title: "Building Enterprise Apps with Pro", date: "2024-01-20", stars: 312, likes: 654, comments: 21 },
  { title: "Design Tokens & Theming in React", date: "2024-02-01", stars: 278, likes: 543, comments: 17 },
]

const applications = [
  { name: "Ant Design Pro", desc: "Enterprise admin boilerplate", icon: "⚡", stars: 89211 },
  { name: "Umi Admin", desc: "Umi-based admin starter", icon: "🦄", stars: 34521 },
]

const projects = [
  { name: "Ant Design", lang: "TypeScript", stars: 89211 },
  { name: "Ant Design Pro", lang: "TypeScript", stars: 34521 },
  { name: "Pro Components", lang: "TypeScript", stars: 12340 },
]

const teamMembers = [
  { name: "付小小", initials: "F" },
  { name: "曲丽丽", initials: "Q" },
  { name: "林东东", initials: "L" },
  { name: "周星星", initials: "Z" },
  { name: "吴加好", initials: "W" },
]

const profileTags = ["很有想法的", "专注设计", "勤劳的", "大长腿", "阿豪", "坏脾气"]

const tabItems = [
  {
    key: "articles",
    label: "Articles",
    children: (
      <div className="p-4 space-y-3">
        {articles.map((a, i) => (
          <div key={i} className="flex items-start justify-between p-4 rounded-lg border hover:bg-muted/20 transition-colors">
            <div>
              <h4 className="font-medium text-sm">{a.title}</h4>
              <div className="flex gap-4 mt-2 text-xs text-muted-foreground">
                <span>{a.date}</span>
                <span className="flex items-center gap-1"><Star className="size-3" />{a.stars}</span>
                <span className="flex items-center gap-1"><ThumbsUp className="size-3" />{a.likes}</span>
                <span className="flex items-center gap-1"><MessageSquare className="size-3" />{a.comments}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    ),
  },
  {
    key: "applications",
    label: "Applications",
    children: (
      <div className="p-4 space-y-3">
        {applications.map((a, i) => (
          <div key={i} className="flex gap-3 p-4 rounded-lg border hover:bg-muted/20 transition-colors">
            <div className="size-10 rounded-lg bg-blue-100 flex items-center justify-center text-xl shrink-0">{a.icon}</div>
            <div>
              <h4 className="font-medium text-sm">{a.name}</h4>
              <p className="text-xs text-muted-foreground mt-0.5">{a.desc}</p>
              <div className="flex gap-4 mt-2 text-xs text-muted-foreground">
                <span className="flex items-center gap-1"><Star className="size-3" />{a.stars.toLocaleString()}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    ),
  },
  {
    key: "projects",
    label: "Projects",
    children: (
      <div className="p-4 space-y-3">
        {projects.map((p, i) => (
          <div key={i} className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/20 transition-colors">
            <div>
              <h4 className="font-medium text-sm">{p.name}</h4>
              <Tag color="primary" className="mt-1">{p.lang}</Tag>
            </div>
            <div className="flex gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1"><Star className="size-3" />{p.stars.toLocaleString()}</span>
            </div>
          </div>
        ))}
      </div>
    ),
  },
]

export default function AccountCenter() {
  return (
    <div className="p-6">
      <div className="grid grid-cols-4 gap-6">
        {/* Left: Profile Card */}
        <div className="space-y-4">
          <div className="rounded-xl border bg-card p-5 text-center">
            <Avatar size={80} className="mx-auto mb-3">U</Avatar>
            <h2 className="font-semibold">Serati Ma</h2>
            <p className="text-xs text-muted-foreground mt-1">Front-end engineer at Ant Financial</p>

            <div className="mt-4 flex justify-center">
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <MapPin className="size-3" /> Hangzhou, China
              </span>
            </div>

            <div className="flex justify-center gap-3 mt-3 text-muted-foreground">
              <button className="p-1.5 hover:text-primary transition-colors"><Globe className="size-4" /></button>
              <button className="p-1.5 hover:text-primary transition-colors"><LinkIcon className="size-4" /></button>
            </div>

            <div className="flex justify-around mt-4 pt-4 border-t text-xs">
              <div><div className="font-semibold text-base">56</div><div className="text-muted-foreground">Projects</div></div>
              <div><div className="font-semibold text-base">8</div><div className="text-muted-foreground">Teams</div></div>
              <div><div className="font-semibold text-base">2</div><div className="text-muted-foreground">Followers</div></div>
            </div>
          </div>

          <div className="rounded-xl border bg-card p-5">
            <h3 className="font-semibold text-sm mb-3">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {profileTags.map((tag) => (
                <Tag key={tag}>{tag}</Tag>
              ))}
            </div>
          </div>

          <div className="rounded-xl border bg-card p-5">
            <h3 className="font-semibold text-sm mb-3">Team</h3>
            <div className="space-y-2.5">
              {teamMembers.map((m) => (
                <div key={m.name} className="flex items-center gap-2">
                  <Avatar size="small">{m.initials}</Avatar>
                  <span className="text-sm">{m.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Tabs */}
        <div className="col-span-3 rounded-xl border bg-card overflow-hidden">
          <Tabs items={tabItems} defaultActiveKey="articles" type="line" className="px-2" />
        </div>
      </div>
    </div>
  )
}
