"use client"

import { Star, MessageSquare, Edit, Share2 } from "lucide-react"
import { Button } from "~/components/ui/button"
import { Avatar } from "~/components/ui/avatar"
import { Tag } from "~/components/ui/tag"

const items = [
  {
    id: 1,
    title: "Ant Design Title 1",
    desc: "Ant Design, a design language for background applications, is refined by Ant UED Team. Ant Design, a design language for background applications, is refined by Ant UED Team.",
    initials: "A",
    owner: "付小小",
    dept: "技术部",
    date: "2024-06-28 19:34",
    stars: 156,
    messages: 2,
    tags: ["很有想法的", "专注设计"],
  },
  {
    id: 2,
    title: "Ant Design Title 2",
    desc: "There are two parts: 1. description of the problem 2. specific plan to solve the problem. There are two parts: 1. description of the problem 2. specific plan.",
    initials: "B",
    owner: "曲丽丽",
    dept: "市场部",
    date: "2024-06-28 18:00",
    stars: 98,
    messages: 5,
    tags: ["吉星高照", "平步青云"],
  },
  {
    id: 3,
    title: "Ant Design Title 3",
    desc: "Hope is a good thing, maybe the best of things, and no good thing ever dies. Hope is a good thing, maybe the best of things, and no good thing ever dies.",
    initials: "C",
    owner: "林东东",
    dept: "设计部",
    date: "2024-06-25 09:00",
    stars: 213,
    messages: 11,
    tags: ["谁也不服", "这就我"],
  },
  {
    id: 4,
    title: "Ant Design Title 4",
    desc: "In the beginning God created the heavens and the earth. Now the earth was formless and empty.",
    initials: "D",
    owner: "周星星",
    dept: "人事部",
    date: "2024-06-22 11:30",
    stars: 77,
    messages: 3,
    tags: ["冥王星", "不明觉厉"],
  },
  {
    id: 5,
    title: "Ant Design Title 5",
    desc: "There is no royal road to learning. There is no royal road to learning. There is no royal road to learning.",
    initials: "E",
    owner: "吴加好",
    dept: "运营部",
    date: "2024-06-20 15:00",
    stars: 132,
    messages: 8,
    tags: ["虽然长的丑", "但胜在心灵美"],
  },
]

export default function ListBasic() {
  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Basic List</h1>
          <p className="text-sm text-muted-foreground mt-0.5">A simple, clean list layout with metadata and actions.</p>
        </div>
        <Button>Add Item</Button>
      </div>

      <div className="rounded-xl border bg-card divide-y overflow-hidden">
        {items.map((item) => (
          <div key={item.id} className="flex gap-4 p-4 hover:bg-muted/20 transition-colors">
            <Avatar size="large" shape="square">
              {item.initials}
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-semibold text-sm">{item.title}</h3>
                  <div className="flex gap-1.5 mt-1 flex-wrap">
                    {item.tags.map((tag) => (
                      <Tag key={tag}>{tag}</Tag>
                    ))}
                  </div>
                </div>
                <div className="flex gap-1 shrink-0">
                  <Button variant="ghost" size="icon-sm">
                    <Edit className="size-4" />
                  </Button>
                  <Button variant="ghost" size="icon-sm">
                    <Share2 className="size-4" />
                  </Button>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-2 line-clamp-2 leading-relaxed">{item.desc}</p>
              <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                <span>
                  <span className="font-medium text-foreground">{item.owner}</span>
                  {" · "}{item.dept}
                </span>
                <span>{item.date}</span>
                <span className="flex items-center gap-1">
                  <Star className="size-3" />{item.stars}
                </span>
                <span className="flex items-center gap-1">
                  <MessageSquare className="size-3" />{item.messages}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-center gap-1 pt-2">
        {[1, 2, 3, 4, 5].map((p) => (
          <Button
            key={p}
            variant={p === 1 ? "default" : "ghost"}
            size="icon-sm"
          >
            {p}
          </Button>
        ))}
      </div>
    </div>
  )
}
