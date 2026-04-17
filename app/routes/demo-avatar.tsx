"use client"

import { DemoBlock } from "~/components/ui/demo-block"
import BasicDemo from "~/components/ui/demos/avatar/basic"
import basicCode from "~/components/ui/demos/avatar/basic.tsx?raw"

export default function AvatarDemo() {
  return (
    <div className="p-8 space-y-6">
      <header>
        <h1 className="text-xl font-semibold">Avatar</h1>
        <p className="mt-1 text-sm text-muted-foreground">Used to represent a user or entity. Supports images, initials, icons, and groups.</p>
      </header>
      <DemoBlock title="Sizes, shapes, and groups" description="Small, default, large, and custom numeric size. Circle and square shapes. AvatarGroup collapses extras into an overflow count." code={basicCode}>
        <BasicDemo />
      </DemoBlock>
    </div>
  )
}
