"use client"

import { useState } from "react"
import { Pagination } from "~/components/ui/pagination"
import { DemoSection } from "~/components/ui/demo-block"

export default function PaginationBasicDemo() {
  const [page, setPage] = useState(1)

  return (
    <div className="flex flex-col gap-6">
      <DemoSection label="Default">
        <Pagination total={500} current={page} onChange={(p) => setPage(p)} />
      </DemoSection>

      <DemoSection label="With total, size changer & quick jumper">
        <Pagination
          total={200}
          showTotal={(total, [start, end]) => `${start}–${end} of ${total}`}
          showSizeChanger
          showQuickJumper
          defaultCurrent={3}
        />
      </DemoSection>

      <DemoSection label="Simple">
        <Pagination total={500} simple />
      </DemoSection>

      <DemoSection label="Small">
        <Pagination total={100} size="small" />
      </DemoSection>

      <DemoSection label="Disabled">
        <Pagination total={500} disabled />
      </DemoSection>
    </div>
  )
}
