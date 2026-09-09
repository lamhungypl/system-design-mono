import { Tag } from "~/components/ui/tag"
import type { TagColor } from "~/components/ui/tag"
import { cn } from "~/lib/utils"
import { targetIconFor } from "~/mathgpt-port/components/Common/target-icons"
import {
  PublishOutcome,
  type PublishChangeRow,
} from "~/mathgpt-port/types/master-child"

/**
 * PORT: `mathgpt_app/src/components/Common/PublishOutcomeList/PublishOutcomeList.tsx`.
 * Same name, same props, same grouping rule. This is variant A of the demo — what MathGPT renders
 * inside the Review changes dialog today.
 */

/** The one place the three API outcomes collapse into the two badges the design draws.
 *
 * `skipped` and `refused` are different facts — a choice the section made versus a limit that stopped
 * the write — but they read the same to the reader: it did not land. The reason sentence, which the
 * API supplies, is what tells them apart. No screen may branch on the outcome itself. */
const BADGE_BY_OUTCOME: Record<PublishOutcome, { color: TagColor; label: string }> = {
  [PublishOutcome.LANDED]: { color: "success", label: "Synced" },
  [PublishOutcome.SKIPPED]: { color: "default", label: "Skipped" },
  [PublishOutcome.REFUSED]: { color: "default", label: "Skipped" },
}

type PublishOutcomeListProps = {
  changes: PublishChangeRow[]
  /** Hide the badge and reason columns — the review dialog lists what *will* be published, where
   *  every row is still pending and an outcome would be a lie. */
  hideOutcomes?: boolean
  className?: string
}

type Group = {
  label: string
  type: string
  rows: PublishChangeRow[]
}

// Course settings first, then each item in the order the API returned it — the frames read top-down
// from the broadest scope to the narrowest.
function groupByTarget(changes: PublishChangeRow[]): Group[] {
  const groups: Group[] = []
  changes.forEach((row) => {
    const existing = groups.find((group) => group.label === row.targetLabel)
    if (existing) {
      existing.rows.push(row)
      return
    }
    groups.push({ label: row.targetLabel, type: row.targetType, rows: [row] })
  })
  return groups.sort(
    (a, b) => Number(b.type === "course") - Number(a.type === "course")
  )
}

export default function PublishOutcomeList({
  changes,
  hideOutcomes,
  className,
}: PublishOutcomeListProps) {
  return (
    <div className={className}>
      {groupByTarget(changes).map((group) => {
        const Icon = targetIconFor(group.type)
        return (
          <div key={group.label}>
            <div className="flex items-center gap-1.5 rounded-md bg-muted/60 px-3 py-2">
              <Icon className="size-4 shrink-0 text-muted-foreground" />
              <span className="text-xs font-semibold text-foreground">
                {group.label}
              </span>
            </div>
            <ul className="m-0 list-none p-0">
              {group.rows.map((row) => (
                <li
                  key={`${row.sectionCourseId}-${row.targetKind}-${row.targetId}-${row.settingKey}`}
                  className={cn(
                    "flex items-center gap-3 border-b border-border px-3 py-2 text-xs last:border-b-0"
                  )}
                >
                  <span className="flex-1 text-muted-foreground">
                    {row.changeLabel}
                  </span>
                  {hideOutcomes ? null : (
                    <>
                      <Tag color={BADGE_BY_OUTCOME[row.outcome].color}>
                        {BADGE_BY_OUTCOME[row.outcome].label}
                      </Tag>
                      <span className="min-w-[180px] text-muted-foreground">
                        {row.reasonShort}
                      </span>
                    </>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )
      })}
    </div>
  )
}
