"use client"

import { useState } from "react"

import { Card } from "~/components/ui/card"
import {
  SegmentedControl,
  SegmentedControlItem,
} from "~/components/ui/segmented-control"
import StagedChangesCallout from "~/mathgpt-port/components/Authenticated/CourseDetails/MasterChild/staged-changes-callout"
import SyncStateBadge from "~/mathgpt-port/components/Common/SyncStateBadge/sync-state-badge"
import ReviewChangesModal, {
  type ReviewChangesBodyVariant,
  type ReviewChangesDemoState,
} from "~/mathgpt-port/components/Modals/MasterChild/review-changes-modal"
import {
  MASTER_PAGE_HEADING,
  SECTION_NOUN_PLURAL,
} from "~/mathgpt-port/constants/master-child"
import {
  getSectionsResponse,
  stagedChangeCount,
} from "~/mathgpt-port/mocks/data/master-child"
import { deriveSectionSyncStatus } from "~/mathgpt-port/types/master-child"

/**
 * Master-child "View changes" — the Review changes dialog rendered two ways off one fixture.
 *
 * Variant A is what `mathgpt_app` ships today (`PublishOutcomeList`, a flat list of prose labels).
 * Variant B is what Figma frame 45938:34995 specifies (an `ITEM | CURRENT | NEW` diff table). The
 * design and the implementation disagree, and the API payload can only feed one of them — which is
 * the point of putting them side by side.
 *
 * See tasks/2026-09-09-ui-ux-playground-master-child-review-changes-plan.md.
 */

const DEMO_STATES: { value: ReviewChangesDemoState; label: string; hint: string }[] =
  [
    {
      value: "partial",
      label: "Partial",
      hint: "Some rows will not land — warning + View details breakdown.",
    },
    {
      value: "clean",
      label: "All landing",
      hint: "Every edit applies to every section; no warning.",
    },
    { value: "loading", label: "Loading", hint: "Preview still being fetched." },
    {
      value: "load-failed",
      label: "Load failed",
      hint: "The preview request failed.",
    },
    {
      value: "empty",
      label: "Nothing staged",
      hint: "No changes since the last publish; Publish now is disabled.",
    },
    {
      value: "publishing",
      label: "Publishing",
      hint: "Publish in flight — the dialog cannot be dismissed.",
    },
    {
      value: "publish-error",
      label: "Publish failed",
      hint: "The publish call came back unsuccessful.",
    },
  ]

const STAGED_COUNT = stagedChangeCount()
const MASTER_COURSE_ID = 1

export default function MasterChildReviewChangesPage() {
  const [variant, setVariant] = useState<ReviewChangesBodyVariant[]>(["list"])
  const [demoState, setDemoState] = useState<ReviewChangesDemoState>("partial")
  const [dismissed, setDismissed] = useState(false)
  const [open, setOpen] = useState(false)

  const bodyVariant = variant[0] ?? "list"
  const activeState = DEMO_STATES.find((state) => state.value === demoState)

  return (
    <div className="flex h-full flex-col gap-6 overflow-auto p-8">
      <header>
        <h1 className="text-xl font-semibold">
          Master–child: &ldquo;View changes&rdquo;
        </h1>
        <p className="mt-1 max-w-3xl text-sm text-muted-foreground">
          The <strong>Review changes</strong> dialog from MathGPT&apos;s
          master-child feature, rendered two ways off one fixture — the list body
          that ships today, and the side-by-side diff table Figma specifies.
        </p>
      </header>

      <Card
        title="What this card is arguing"
        size="small"
        className="max-w-3xl"
        bodyClassName="text-sm text-muted-foreground leading-relaxed flex flex-col gap-2"
      >
        <p className="m-0">
          <strong className="text-foreground">Today</strong>{" "}
          <code>ReviewChangesModal</code> renders each staged change as one line
          of composed prose — <em>&ldquo;Updated late submission penalty&rdquo;</em>{" "}
          — via <code>PublishOutcomeList</code>.
        </p>
        <p className="m-0">
          <strong className="text-foreground">The design</strong> (Figma frame{" "}
          <code>45938:34995</code>) draws an{" "}
          <code>ITEM&nbsp;|&nbsp;CURRENT&nbsp;|&nbsp;NEW</code> table: every change
          shows the value it is moving from and to, with question edits rendered
          as a full question card on each side.
        </p>
        <p className="m-0">
          <strong className="text-foreground">The gap</strong>{" "}
          <code>PublishChangeRow</code> carries <code>changeLabel</code> — the ITEM
          column — and nothing else. There is no current value, no new value and
          no question payload in the response, so two of the design&apos;s three
          columns have no data behind them. Rendering it would need the contract
          to grow a <code>previousValue</code> / <code>nextValue</code> pair; the
          question snapshot is much the larger ask, and{" "}
          <em>scalars now, question diffs later</em> is a real option. The values
          on this page are fixtures, not something the API returns.
        </p>
      </Card>

      <div className="flex flex-wrap items-end gap-6">
        <div className="flex flex-col gap-1.5">
          <span className="text-xs font-medium text-muted-foreground">
            Dialog body
          </span>
          <SegmentedControl
            size="sm"
            value={variant}
            onValueChange={(value) => {
              if (value.length) setVariant(value as ReviewChangesBodyVariant[])
            }}
          >
            <SegmentedControlItem value="list">
              As built (list)
            </SegmentedControlItem>
            <SegmentedControlItem value="diff-table">
              As designed (diff table)
            </SegmentedControlItem>
          </SegmentedControl>
        </div>

        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="demo-state"
            className="text-xs font-medium text-muted-foreground"
          >
            State
          </label>
          <select
            id="demo-state"
            value={demoState}
            onChange={(event) =>
              setDemoState(event.target.value as ReviewChangesDemoState)
            }
            className="h-9 rounded-md border border-border bg-background px-2.5 text-sm focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
          >
            {DEMO_STATES.map((state) => (
              <option key={state.value} value={state.value}>
                {state.label}
              </option>
            ))}
          </select>
        </div>

        {activeState && (
          <p className="mb-2 max-w-sm text-xs text-muted-foreground">
            {activeState.hint}
          </p>
        )}
      </div>

      <StagedChangesCallout
        className="max-w-3xl"
        courseId={MASTER_COURSE_ID}
        stagedCount={STAGED_COUNT}
        dismissed={dismissed}
        onDismiss={() => setDismissed(true)}
        onReview={() => setOpen(true)}
      />

      {dismissed && (
        <button
          type="button"
          onClick={() => setDismissed(false)}
          className="w-fit text-xs text-primary underline-offset-4 hover:underline"
        >
          Restore the callout
        </button>
      )}

      <Card
        title={`${MASTER_PAGE_HEADING} — ${SECTION_NOUN_PLURAL.toLowerCase()}`}
        size="small"
        className="max-w-3xl"
        bodyClassName="p-0"
      >
        <ul className="m-0 list-none p-0">
          {getSectionsResponse.sections.map((section) => (
            <li
              key={section.courseId}
              className="flex items-center justify-between gap-4 border-b border-border px-4 py-3 last:border-b-0"
            >
              <div className="flex min-w-0 flex-col">
                <span className="truncate text-sm font-medium">
                  {section.name}
                </span>
                <span className="truncate text-xs text-muted-foreground">
                  {section.instructorName} · {section.syncStatus}
                </span>
              </div>
              <SyncStateBadge
                status={deriveSectionSyncStatus(section.changedSettingCount)}
              />
            </li>
          ))}
        </ul>
      </Card>

      {open && (
        <ReviewChangesModal
          courseId={MASTER_COURSE_ID}
          bodyVariant={bodyVariant}
          demoState={demoState}
          onModalClose={() => setOpen(false)}
        />
      )}
    </div>
  )
}
