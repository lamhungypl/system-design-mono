"use client"

import { useState } from "react"
import { Tag } from "~/components/ui/tag"

const INITIAL_TAGS = ["React", "TypeScript", "Tailwind", "Vite", "base-ui"]

export default function TagClosableDemo() {
  const [tags, setTags] = useState(INITIAL_TAGS)

  return (
    <div className="flex flex-wrap gap-2">
      {tags.map((tag) => (
        <Tag key={tag} closable onClose={() => setTags((t) => t.filter((v) => v !== tag))}>
          {tag}
        </Tag>
      ))}
    </div>
  )
}
