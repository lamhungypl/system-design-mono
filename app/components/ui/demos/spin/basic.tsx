"use client"

import { useState } from "react"
import { Spin } from "~/components/ui/spin"
import { Button } from "~/components/ui/button"
import { Card } from "~/components/ui/card"
import { DemoItem, DemoSection } from "~/components/ui/demo-block"

export default function SpinBasicDemo() {
  const [loading, setLoading] = useState(true)

  return (
    <div className="flex flex-col gap-6">
      <DemoSection label="Sizes">
        <div className="flex items-center gap-8">
          <DemoItem label="Small">
            <Spin size="small" />
          </DemoItem>
          <DemoItem label="Default">
            <Spin />
          </DemoItem>
          <DemoItem label="Large">
            <Spin size="large" />
          </DemoItem>
          <DemoItem label="With tip">
            <Spin tip="Loading…" />
          </DemoItem>
        </div>
      </DemoSection>
      <DemoSection label="Overlay">
        <div className="flex flex-col gap-2">
          <Button size="sm" variant="outline" onClick={() => setLoading((v) => !v)}>
            Toggle loading overlay
          </Button>
          <Spin spinning={loading}>
            <Card className="max-w-xs">
              <p className="text-sm text-muted-foreground">Content inside a Spin wrapper. Toggle the loading state above.</p>
            </Card>
          </Spin>
        </div>
      </DemoSection>
    </div>
  )
}
