import { Rocket } from "lucide-react"

import { Alert } from "~/components/ui/alert"
import { Button } from "~/components/ui/button"
import {
  STAGED_CHANGES_CALLOUT_DISMISSED,
  stagedChangesCalloutBody,
} from "~/mathgpt-port/constants/master-child"

/**
 * PORT: `mathgpt_app/src/components/Authenticated/CourseDetails/MasterChild/StagedChangesCallout.tsx`.
 *
 * This is the "View changes" button the demo hangs off — Figma node 45974:41480, "New Changes
 * Banner". The frame draws two buttons; the shipping component has a third, Dismiss, with a real
 * dismissed-state branch, so all three are kept and the frame is treated as the older draft.
 *
 * Upstream this dispatches `showModal(ModalKey.MASTER_REVIEW_CHANGES)` through the Redux modal
 * registry. There is no such registry here, so the page owns the open state and passes `onReview`.
 */
type StagedChangesCalloutProps = {
  courseId: number
  stagedCount: number
  dismissed: boolean
  onDismiss: () => void
  onReview: () => void
  className?: string
}

export default function StagedChangesCallout({
  stagedCount,
  dismissed,
  onDismiss,
  onReview,
  className,
}: StagedChangesCalloutProps) {
  if (dismissed) {
    return (
      <Alert
        type="info"
        showIcon
        message={STAGED_CHANGES_CALLOUT_DISMISSED}
        className={className}
      />
    )
  }

  return (
    <Alert
      type="info"
      showIcon
      className={className}
      message={
        <>
          <span className="font-semibold">Updates detected</span> —{" "}
          {stagedChangesCalloutBody(stagedCount)}
        </>
      }
      description={
        <div className="mt-1 flex flex-wrap gap-2">
          {/* Both routes go through the review dialog — publishing is never one click with no diff. */}
          <Button size="sm" onClick={onReview}>
            <Rocket />
            Publish now
          </Button>
          <Button size="sm" variant="outline" onClick={onReview}>
            View changes
          </Button>
          <Button size="sm" variant="ghost" onClick={onDismiss}>
            Dismiss
          </Button>
        </div>
      }
    />
  )
}
