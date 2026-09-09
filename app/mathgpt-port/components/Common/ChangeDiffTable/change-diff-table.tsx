import { ArrowRight } from "lucide-react"

import { cn } from "~/lib/utils"
import { targetIconFor } from "~/mathgpt-port/components/Common/target-icons"
import { DIFF_TABLE_HEADERS } from "~/mathgpt-port/constants/master-child"
import {
  isDiffValueUnchanged,
  type PublishChangeValueRow,
} from "~/mathgpt-port/types/master-child"

import DiffValueCell from "./diff-value-cell"

/**
 * Variant B — the Review changes body as Figma frame 45938:34995 draws it: one scrolling
 * `ITEM | CURRENT | NEW` table, targets as group header rows.
 *
 * Deliberately NOT the HR compare modal's mechanics, which prompted this demo but which the frame
 * does not use (plan Decision 5): no tabs, no red/green panes, and no outcome badges — the shipping
 * code already passes `hideOutcomes` in this dialog, and the frame agrees.
 */

type ChangeDiffTableProps = {
  changes: PublishChangeValueRow[]
  className?: string
}

type Group = {
  label: string
  type: string
  rows: PublishChangeValueRow[]
}

/** Same grouping rule as `PublishOutcomeList`, so a target groups identically in both variants. */
function groupByTarget(changes: PublishChangeValueRow[]): Group[] {
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

export default function ChangeDiffTable({
  changes,
  className,
}: ChangeDiffTableProps) {
  // A row whose two sides render the same is not a change, whatever the API called it.
  const visible = changes.filter(
    (row) => !isDiffValueUnchanged(row.previousValue, row.nextValue)
  )
  // A group left with nothing to show draws no header.
  const groups = groupByTarget(visible).filter((group) => group.rows.length > 0)

  return (
    // The frame is 1392px wide. Below that the table scrolls inside this container so the page
    // itself never scrolls horizontally.
    //
    // This container — not the dialog body — is the table's scroll region in BOTH axes. `sticky`
    // resolves against the nearest scrolling ancestor, and `overflow-x: auto` already makes this one
    // (a computed `overflow-y: auto` comes with it), so without a height bound here the header would
    // have nothing to stick to and would scroll away with the rows.
    <div
      className={cn(
        "max-h-[60vh] overflow-auto rounded-md border border-border",
        className
      )}
    >
      <table className="w-full min-w-[860px] border-collapse text-left">
        <caption className="sr-only">
          Staged changes, showing each item&apos;s current value and the value it
          will have after publishing.
        </caption>
        <colgroup>
          <col className="w-60" />
          <col />
          <col className="w-6" />
          <col />
        </colgroup>
        {/* Sticky against the dialog body's scroll container, so CURRENT / NEW stay legible while
            a long list of changes scrolls past. */}
        <thead className="sticky top-0 z-10">
          <tr className="border-b border-border bg-muted [&>*]:bg-muted">
            <th
              scope="col"
              className="px-3 py-2.5 text-xs font-semibold tracking-wide text-foreground"
            >
              {DIFF_TABLE_HEADERS.item}
            </th>
            <th
              scope="col"
              className="border-l border-border px-3 py-2.5 text-xs font-semibold tracking-wide text-foreground"
            >
              {DIFF_TABLE_HEADERS.current}
            </th>
            <th scope="col" className="px-0 py-2.5">
              <span className="sr-only">becomes</span>
            </th>
            <th
              scope="col"
              className="px-3 py-2.5 text-xs font-semibold tracking-wide text-foreground"
            >
              {DIFF_TABLE_HEADERS.next}
            </th>
          </tr>
        </thead>

        {groups.map((group) => {
          const Icon = targetIconFor(group.type)
          return (
            <tbody key={group.label}>
              <tr className="border-b border-border bg-muted/60">
                <th
                  scope="colgroup"
                  colSpan={4}
                  className="px-3 py-2 text-left"
                >
                  <span className="flex items-center gap-1.5">
                    <Icon className="size-4 shrink-0 text-muted-foreground" />
                    <span className="text-xs font-semibold text-foreground">
                      {group.label}
                    </span>
                  </span>
                </th>
              </tr>

              {group.rows.map((row) => (
                <tr
                  key={`${row.targetKind}-${row.targetId}-${row.settingKey}`}
                  className="border-b border-border last:border-b-0"
                >
                  {/* Top-aligned throughout: a tall question cell must not centre its scalar sibling. */}
                  <th
                    scope="row"
                    className="px-3 py-3.5 align-top text-sm font-normal text-muted-foreground"
                  >
                    {row.changeLabel}
                  </th>
                  <td className="border-l border-border px-3 py-3.5 align-top">
                    <DiffValueCell
                      value={row.previousValue}
                      sideLabel="current value"
                    />
                  </td>
                  <td className="px-0 py-3.5 align-top">
                    <ArrowRight
                      aria-hidden
                      className="size-4 text-muted-foreground"
                    />
                  </td>
                  <td className="px-3 py-3.5 align-top">
                    <DiffValueCell
                      value={row.nextValue}
                      sideLabel="new value"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          )
        })}
      </table>
    </div>
  )
}
