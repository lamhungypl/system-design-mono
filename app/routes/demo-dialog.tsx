"use client"

import { useState } from "react"
import { Button } from "~/components/ui/button"
import { Dialog, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "~/components/ui/dialog"

export default function DialogDemo() {
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [infoOpen, setInfoOpen] = useState(false)

  return (
    <div className="p-8">
      <h1 className="text-xl font-semibold">Dialog</h1>
      <p className="mt-1 mb-8 text-sm text-muted-foreground">
        Click a button to open a dialog.
      </p>

      <div className="flex flex-wrap gap-3">
        <Button onClick={() => setConfirmOpen(true)}>Open dialog</Button>
        <Button variant="outline" onClick={() => setInfoOpen(true)}>View details</Button>
      </div>

      {/* Confirm / destructive dialog */}
      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
        <DialogHeader onClose={() => setConfirmOpen(false)}>
          <DialogTitle>Confirm action</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          Are you sure you want to proceed? This action cannot be undone and will
          permanently delete your data from our servers.
        </DialogDescription>
        <DialogFooter>
          <Button variant="outline" onClick={() => setConfirmOpen(false)}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={() => setConfirmOpen(false)}>
            Delete
          </Button>
        </DialogFooter>
      </Dialog>

      {/* Info dialog */}
      <Dialog open={infoOpen} onClose={() => setInfoOpen(false)}>
        <DialogHeader onClose={() => setInfoOpen(false)}>
          <DialogTitle>Release notes — v2.4.0</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          This release includes performance improvements, bug fixes, and the
          following new features:
        </DialogDescription>
        <ul className="mt-3 space-y-1.5 text-sm text-muted-foreground list-disc list-inside">
          <li>Sidebar expand / collapse animation</li>
          <li>Inline form status messages</li>
          <li>Dark mode improvements</li>
        </ul>
        <DialogFooter>
          <Button onClick={() => setInfoOpen(false)}>Got it</Button>
        </DialogFooter>
      </Dialog>
    </div>
  )
}
