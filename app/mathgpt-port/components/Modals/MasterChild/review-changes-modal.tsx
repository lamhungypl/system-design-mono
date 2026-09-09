import { useCallback, useMemo, useState } from "react"

import { Alert } from "~/components/ui/alert"
import { Spin } from "~/components/ui/spin"
import ChangeDiffTable from "~/mathgpt-port/components/Common/ChangeDiffTable/change-diff-table"
import Modal, { FooterType } from "~/mathgpt-port/components/Common/modals"
import PublishOutcomeList from "~/mathgpt-port/components/Common/PublishOutcomeList/publish-outcome-list"
import SectionIdentityCard from "~/mathgpt-port/components/Common/SectionIdentityCard/section-identity-card"
import {
  REVIEW_CHANGES_LOAD_FAILED,
  REVIEW_CHANGES_PUBLISH_FAILED,
  REVIEW_CHANGES_TITLE,
  reviewChangesBreakdownIntro,
  reviewChangesIntro,
  reviewChangesNotLandingWarning,
} from "~/mathgpt-port/constants/master-child"
import {
  cleanPublishPreviewResponse,
  emptyPublishPreviewResponse,
  getPublishPreviewResponse,
} from "~/mathgpt-port/mocks/data/master-child"
import {
  isDiffValueUnchanged,
  PublishOutcome,
  type PublishValuePreview,
} from "~/mathgpt-port/types/master-child"

/**
 * PORT: `mathgpt_app/src/components/Modals/MasterChild/ReviewChangesModal.tsx`.
 *
 * Structure, copy and control flow follow the original: the staged-count sentence, the
 * not-everything-landed warning with its "View details" breakdown, and the Cancel / Publish now
 * footer. What differs is deliberate and demo-only:
 *
 *  - `bodyVariant` swaps the body between what ships (`PublishOutcomeList`) and what Figma frame
 *    45938:34995 specifies (`ChangeDiffTable`). Everything around the body is identical, so the two
 *    can be compared honestly.
 *  - `demoState` stands in for the network the original talks to (plan Decision 3).
 */

/** Which body to render. `list` is what production does today; `diff-table` is what the frame draws. */
export type ReviewChangesBodyVariant = "list" | "diff-table"

/** Stands in for the async states the real dialog reaches through `getPublishPreview` / `publish`. */
export type ReviewChangesDemoState =
  | "partial"
  | "clean"
  | "loading"
  | "load-failed"
  | "empty"
  | "publishing"
  | "publish-error"

const PREVIEW_BY_STATE: Record<ReviewChangesDemoState, PublishValuePreview> = {
  partial: getPublishPreviewResponse,
  clean: cleanPublishPreviewResponse,
  loading: getPublishPreviewResponse,
  "load-failed": getPublishPreviewResponse,
  empty: emptyPublishPreviewResponse,
  publishing: getPublishPreviewResponse,
  "publish-error": getPublishPreviewResponse,
}

export interface ReviewChangesModalProps {
  onModalClose: () => void
  courseId: number
  /** Demo-only. */
  bodyVariant?: ReviewChangesBodyVariant
  /** Demo-only. */
  demoState?: ReviewChangesDemoState
}

export default function ReviewChangesModal({
  onModalClose,
  courseId,
  bodyVariant = "list",
  demoState = "partial",
}: ReviewChangesModalProps) {
  const [showingBreakdown, setShowingBreakdown] = useState(false)

  const isLoading = demoState === "loading"
  const loadFailed = demoState === "load-failed"
  const isPublishing = demoState === "publishing"
  const publishError =
    demoState === "publish-error" ? REVIEW_CHANGES_PUBLISH_FAILED : null

  const preview = PREVIEW_BY_STATE[demoState]

  const notLanding = useMemo(
    () =>
      (preview?.changes || []).filter(
        (row) => row.outcome !== PublishOutcome.LANDED
      ),
    [preview]
  )

  // The API reports one row per section per change; the review list is about the master's edits, so
  // the same edit across four sections is one staged change, not four.
  const stagedChanges = useMemo(() => {
    const seen = new Set<string>()
    return (preview?.changes || []).filter((row) => {
      const key = `${row.targetKind}-${row.targetId}-${row.settingKey}`
      if (seen.has(key)) {
        return false
      }
      seen.add(key)
      return true
    })
  }, [preview])

  // A row whose two sides render the same is not a staged change, whatever the API called it. Both
  // bodies read this list, so the count in the sentence always equals the rows on screen.
  const changedStaged = useMemo(
    () =>
      stagedChanges.filter(
        (row) => !isDiffValueUnchanged(row.previousValue, row.nextValue)
      ),
    [stagedChanges]
  )

  const affectedSections = useMemo(
    () =>
      (preview?.sections || []).filter((section) =>
        notLanding.some((row) => row.sectionCourseId === section.sectionCourseId)
      ),
    [preview, notLanding]
  )
  const stagedCount = changedStaged.length

  const handlePublish = useCallback(() => {
    // The real dialog POSTs, toasts, emits a refetch and closes. Here the publish states are picked
    // from the page's state switch instead, so this only closes.
    onModalClose()
  }, [onModalClose])

  const renderBody = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center py-10">
          <Spin size="large" />
        </div>
      )
    }

    if (loadFailed || !preview) {
      return (
        <div className="text-sm text-muted-foreground">
          {REVIEW_CHANGES_LOAD_FAILED}
        </div>
      )
    }

    if (showingBreakdown) {
      return (
        <div className="flex flex-col gap-3">
          <div className="text-sm text-muted-foreground">
            {reviewChangesBreakdownIntro()}
          </div>
          {affectedSections.map((section) => (
            <div
              key={section.sectionCourseId}
              className="overflow-hidden rounded-md border border-border"
            >
              <SectionIdentityCard
                className="p-3"
                name={section.name}
                instructorName={section.instructorName}
                instructorEmail={section.instructorEmail}
                coverUrl={section.coverUrl}
              />
              <PublishOutcomeList
                changes={notLanding.filter(
                  (row) => row.sectionCourseId === section.sectionCourseId
                )}
              />
            </div>
          ))}
        </div>
      )
    }

    return (
      <div className="flex flex-col gap-3">
        <div className="text-sm text-muted-foreground">
          {reviewChangesIntro(stagedCount)}
        </div>
        {notLanding.length > 0 ? (
          <Alert
            type="warning"
            showIcon
            message={
              <>
                {reviewChangesNotLandingWarning()}{" "}
                <button
                  type="button"
                  // WCAG 2.2 SC 2.5.8 exempts targets inline in a sentence, but the extra padding
                  // costs nothing and clears the 24px bar outright.
                  className="inline-block cursor-pointer border-none bg-transparent px-0.5 py-1 align-baseline text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  onClick={() => setShowingBreakdown(true)}
                >
                  View details
                </button>
              </>
            }
          />
        ) : null}
        {publishError ? <Alert type="error" showIcon message={publishError} /> : null}

        {bodyVariant === "diff-table" ? (
          <ChangeDiffTable changes={changedStaged} />
        ) : (
          <div className="overflow-hidden rounded-md border border-border">
            <PublishOutcomeList changes={changedStaged} hideOutcomes />
          </div>
        )}
      </div>
    )
  }

  const footerProps = showingBreakdown
    ? {
        footerType: FooterType.SECONDARY_SINGLE_LEFT,
        secondaryButtonText: "← Back",
        onClickSecondaryButton: () => setShowingBreakdown(false),
      }
    : {
        footerType: FooterType.DOUBLE,
        secondaryButtonText: "Cancel",
        onClickSecondaryButton: onModalClose,
        primaryButtonText: "Publish now",
        onClickPrimaryButton: handlePublish,
        // US-I3 pt 4: a no-op publish can never be submitted.
        disablePrimaryButton: isPublishing || isLoading || !preview?.hasChanges,
        primaryButtonProps: {
          isLoading: isPublishing,
          loadingText: "Publishing...",
        },
      }

  return (
    <Modal
      id="modal-review-changes"
      data-testid="modal-review-changes"
      // The frame is drawn at 1392px, which only the diff table needs; the list body keeps the
      // `medium` the shipping dialog uses.
      size={bodyVariant === "diff-table" ? "extraLarge" : "medium"}
      closable={!isPublishing}
      onHide={onModalClose}
      headerText={REVIEW_CHANGES_TITLE}
      body={renderBody()}
      {...footerProps}
    />
  )
}

// `courseId` is part of the upstream signature and kept for parity; the demo reads fixtures instead.
export type { PublishValuePreview }
