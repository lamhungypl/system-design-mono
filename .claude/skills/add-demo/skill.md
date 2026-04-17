---
name: add-demo
description: Add a demo route for a system design component — creates the route file and individual snippet files following the Ant Design demo pattern. Use when asked to add demos for a new component or add variants to an existing one.
version: 1.1.0
---

# Add Component Demo

Scaffolds a demo route (`demo-<component>.tsx`) plus per-variant snippet files following the Ant Design pattern used in this repo.

## File Conventions

```
app/
  components/ui/demos/<component>/
    basic.tsx            ← minimal snippet, default export (simple UI components)
    …
  components/<component>/demos/
    basic.tsx            ← for complex standalone components (DatePicker, etc.)
    …
  routes/
    demo-<component>.tsx   ← the page: imports snippets + ?raw, renders DemoBlock
```

## Rules

- **Snippets are self-contained** — each `demos/*.tsx` is a complete React component (own `useState`, own imports). Users copy-paste just that file.
- **Absolute imports only** in demo files: `~/components/ui/<component>`, `~/components/<component>/ComponentName`, etc. Never relative.
- **`?raw` imports** load the snippet source for the code panel:
  ```ts
  import BasicDemo from "~/components/ui/demos/switch/basic"
  import basicCode from "~/components/ui/demos/switch/basic.tsx?raw"
  ```
- **`DemoBlock`** wraps each variant (the outer page card with title, description, code panel):
  ```tsx
  <DemoBlock title="Switch variants" description="…" code={basicCode}>
    <BasicDemo />
  </DemoBlock>
  ```
- **`DemoItem`** labels each individual variant inline (label shown below the component):
  ```tsx
  import { DemoItem } from "~/components/ui/demo-block"

  // Use for inline/compact components shown side by side
  <div className="flex flex-wrap items-start gap-6">
    <DemoItem label="Default"><Switch /></DemoItem>
    <DemoItem label="Small"><Switch size="small" /></DemoItem>
    <DemoItem label="Disabled"><Switch disabled /></DemoItem>
  </div>
  ```
- **`DemoSection`** labels a group of related variants (label shown above the group):
  ```tsx
  import { DemoSection } from "~/components/ui/demo-block"

  // Use for block/stacked components or logical groups
  <DemoSection label="Sizes">
    <div className="flex flex-col gap-2">
      <Input size="small" placeholder="Small" />
      <Input placeholder="Default" />
      <Input size="large" placeholder="Large" />
    </div>
  </DemoSection>
  ```
- **Label every variant** — every demo must use `DemoItem` or `DemoSection` so users can identify each example at a glance. Plain unlabeled component rows are not acceptable.
- Register the route in `app/routes.ts` under the `components` parent:
  ```ts
  route("<component>", "routes/demo-<component>.tsx"),
  ```
- Add a nav entry in `app/lib/nav.tsx` in the appropriate section group.
- Route page wrapper: `<div className="p-8 space-y-6">` — no `max-w-*` constraint on the outer div.

## When to use DemoItem vs DemoSection

| Situation | Use |
|---|---|
| Inline/compact elements shown side by side (Switch, Badge, Avatar, Spin) | `DemoItem` |
| Block/full-width elements stacked vertically (Input, Alert, Card) | `DemoSection` |
| Logical groups of related variants (Sizes, States, Styles) | `DemoSection` |
| Complex demos mixing both | Both — `DemoSection` for the group, `DemoItem` for individual items |

## Workflow

1. **Read the component** (`app/components/<component>/` or `app/components/ui/<component>.tsx`) to understand props and variants worth demonstrating.
2. **Create snippet files** — one per meaningful variant. Prefer minimal: show the thing, nothing else.
3. **Add labels** using `DemoItem` or `DemoSection` inside every snippet.
4. **Create/update the route file** — `app/routes/demo-<component>.tsx` — import all snippets + `?raw`, render with `DemoBlock`.
5. **Register route** in `app/routes.ts`.
6. **Add nav entry** in `app/lib/nav.tsx`.
7. **Verify** — run `pnpm typecheck` and navigate to `/components/<component>` in the browser.

## Snippet Template (inline component)

```tsx
// app/components/ui/demos/<component>/basic.tsx
"use client"

import { useState } from "react"
import { ComponentName } from "~/components/ui/<component>"
import { DemoItem } from "~/components/ui/demo-block"

export default function ComponentBasicDemo() {
  const [value, setValue] = useState(…)
  return (
    <div className="flex flex-wrap items-start gap-6">
      <DemoItem label="Default">
        <ComponentName value={value} onChange={setValue} />
      </DemoItem>
      <DemoItem label="Disabled">
        <ComponentName disabled />
      </DemoItem>
    </div>
  )
}
```

## Snippet Template (block component)

```tsx
// app/components/ui/demos/<component>/basic.tsx
import { ComponentName } from "~/components/ui/<component>"
import { DemoSection } from "~/components/ui/demo-block"

export default function ComponentBasicDemo() {
  return (
    <div className="flex flex-col gap-5 max-w-sm">
      <DemoSection label="Sizes">
        <div className="flex flex-col gap-2">
          <ComponentName size="small" />
          <ComponentName />
          <ComponentName size="large" />
        </div>
      </DemoSection>
      <DemoSection label="States">
        <div className="flex flex-col gap-2">
          <ComponentName status="error" />
          <ComponentName disabled />
        </div>
      </DemoSection>
    </div>
  )
}
```

## Route Template

```tsx
// app/routes/demo-<component>.tsx
"use client"

import { DemoBlock } from "~/components/ui/demo-block"

import BasicDemo from "~/components/ui/demos/<component>/basic"
import basicCode from "~/components/ui/demos/<component>/basic.tsx?raw"
// …repeat for each variant file

export default function ComponentDemo() {
  return (
    <div className="p-8 space-y-6">
      <header>
        <h1 className="text-xl font-semibold">ComponentName</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          One-line description of the component.
        </p>
      </header>

      <DemoBlock title="Variants" description="…" code={basicCode}>
        <BasicDemo />
      </DemoBlock>

      {/* …more DemoBlocks for other snippet files */}
    </div>
  )
}
```

## Reference Implementations

- Simple inline: `app/components/ui/demos/switch/basic.tsx` — uses `DemoItem`
- Block grouped: `app/components/ui/demos/input/basic.tsx` — uses `DemoSection`
- Mixed: `app/components/ui/demos/badge/basic.tsx` — `DemoItem` + `DemoSection`
- Complex standalone: `app/components/date-picker/demos/` — separate file per variant
