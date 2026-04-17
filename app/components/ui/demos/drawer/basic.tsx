"use client"

import { useState } from "react"
import { Drawer } from "~/components/ui/drawer"
import { Button } from "~/components/ui/button"

export default function DrawerBasicDemo() {
  const [open, setOpen] = useState(false)
  const [placement, setPlacement] = useState<"right" | "left" | "top" | "bottom">("right")

  function show(p: typeof placement) {
    setPlacement(p)
    setOpen(true)
  }

  return (
    <>
      <div className="flex flex-wrap gap-2">
        <Button onClick={() => show("right")}>Open Right</Button>
        <Button variant="outline" onClick={() => show("left")}>Open Left</Button>
        <Button variant="outline" onClick={() => show("top")}>Open Top</Button>
        <Button variant="outline" onClick={() => show("bottom")}>Open Bottom</Button>
      </div>

      <Drawer
        open={open}
        onClose={() => setOpen(false)}
        title={`Drawer — ${placement}`}
        placement={placement}
        footer={
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={() => setOpen(false)}>Submit</Button>
          </div>
        }
      >
        <p className="text-sm text-muted-foreground">
          Drawer slides in from the {placement}. Use it for editing, detail views, or secondary navigation.
        </p>
      </Drawer>
    </>
  )
}
