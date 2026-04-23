"use client"

import { Clock, Star, MessageSquare, GitFork, ArrowRight } from "lucide-react"

const projects = [
  { name: "Alipay", desc: "Department · Ant Financial", logo: "🅰", color: "bg-blue-100" },
  { name: "Angular", desc: "Department · Technology", logo: "🔺", color: "bg-red-100" },
  { name: "Ant Design", desc: "Department · Ant Financial", logo: "🐜", color: "bg-orange-100" },
  { name: "Ant Design Pro", desc: "Department · Ant Financial", logo: "⚡", color: "bg-yellow-100" },
  { name: "Bootstrap", desc: "Department · GitHub", logo: "🅱", color: "bg-purple-100" },
  { name: "React", desc: "Department · Facebook", logo: "⚛", color: "bg-teal-100" },
]

const activities = [
  { user: "曲丽丽", action: "关联了", target: "曲丽丽", project: "骨干会议", time: "1 min ago", avatar: "Q" },
  { user: "付小小", action: "发布了", target: "2021 设计规范", project: "大盘动态", time: "1 hour ago", avatar: "F" },
  { user: "林东东", action: "在", target: "XX 版本", project: "发布了", time: "3 hours ago", avatar: "L" },
  { user: "周星星", action: "将", target: "XX 版本", project: "置顶了", time: "1 day ago", avatar: "Z" },
  { user: "吴加好", action: "更新了", target: "XX 版本", project: "的数据", time: "2 days ago", avatar: "W" },
]

const quickLinks = [
  { label: "操作一", desc: "Description 1" },
  { label: "操作二", desc: "Description 2" },
  { label: "操作三", desc: "Description 3" },
  { label: "操作四", desc: "Description 4" },
  { label: "操作五", desc: "Description 5" },
  { label: "操作六", desc: "Description 6" },
]

const teamMembers = [
  { name: "科学搬砖组", avatar: "K" },
  { name: "程序员日常", avatar: "C" },
  { name: "设计天团", avatar: "S" },
  { name: "中二少女团", avatar: "Z" },
  { name: "骗你来学习", avatar: "P" },
]

export default function DashboardWorkplace() {
  return (
    <div className="p-6 space-y-6">
      {/* Greeting Banner */}
      <div className="rounded-xl border bg-card p-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="size-16 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-2xl font-bold">
            U
          </div>
          <div>
            <p className="text-lg font-semibold">Good morning, User! Have a great day.</p>
            <p className="text-sm text-muted-foreground mt-0.5">Senior Engineer · Ant Design Team · Xi'an, Shaanxi</p>
          </div>
        </div>
        <div className="flex gap-8 text-center">
          <div>
            <div className="text-2xl font-semibold">56</div>
            <div className="text-xs text-muted-foreground mt-0.5">Projects</div>
          </div>
          <div>
            <div className="text-2xl font-semibold">8</div>
            <div className="text-xs text-muted-foreground mt-0.5">Teams</div>
          </div>
          <div>
            <div className="text-2xl font-semibold">2</div>
            <div className="text-xs text-muted-foreground mt-0.5">Messages</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Projects */}
        <div className="col-span-2 space-y-4">
          <div className="rounded-xl border bg-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold">In Progress Projects</h2>
              <button className="text-xs text-primary flex items-center gap-0.5 hover:underline">
                All <ArrowRight className="size-3" />
              </button>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {projects.map((p) => (
                <div key={p.name} className="rounded-lg border p-4 hover:shadow-sm transition-shadow">
                  <div className={`size-10 rounded-lg ${p.color} flex items-center justify-center text-xl mb-3`}>
                    {p.logo}
                  </div>
                  <div className="font-medium text-sm">{p.name}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">{p.desc}</div>
                  <div className="flex items-center gap-3 mt-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><Star className="size-3" /> 42</span>
                    <span className="flex items-center gap-1"><GitFork className="size-3" /> 18</span>
                    <span className="flex items-center gap-1"><MessageSquare className="size-3" /> 7</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="rounded-xl border bg-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold">Quick Start / Frequently Visited</h2>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {quickLinks.map((l) => (
                <button
                  key={l.label}
                  className="text-left rounded-lg border p-3 hover:bg-muted/50 transition-colors"
                >
                  <div className="text-sm font-medium">{l.label}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">{l.desc}</div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right sidebar panels */}
        <div className="space-y-4">
          {/* Activity Feed */}
          <div className="rounded-xl border bg-card p-6">
            <h2 className="font-semibold mb-4">Activity Feed</h2>
            <div className="space-y-4">
              {activities.map((a, i) => (
                <div key={i} className="flex gap-3">
                  <div className="size-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-semibold text-primary shrink-0">
                    {a.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs leading-relaxed">
                      <span className="font-medium">{a.user}</span>
                      {" "}{a.action}{" "}
                      <span className="text-primary">{a.target}</span>
                      {" "}{a.project}
                    </p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                      <Clock className="size-3" />
                      {a.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Team */}
          <div className="rounded-xl border bg-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold">Team</h2>
              <button className="text-xs text-primary hover:underline flex items-center gap-0.5">
                All <ArrowRight className="size-3" />
              </button>
            </div>
            <div className="space-y-3">
              {teamMembers.map((m) => (
                <div key={m.name} className="flex items-center gap-3">
                  <div className="size-8 rounded-full bg-gradient-to-br from-purple-400 to-blue-500 flex items-center justify-center text-xs font-semibold text-white">
                    {m.avatar}
                  </div>
                  <span className="text-sm">{m.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
