import { Tag } from "~/components/ui/tag"
import type { TagColor } from "~/components/ui/tag"
import { SectionSyncStatus } from "~/mathgpt-port/types/master-child"

/**
 * PORT: `mathgpt_app/src/components/Common/SyncStateBadge/SyncStateBadge.tsx`.
 *
 * Same name, same props. Upstream renders AhaUI's `Badge`, which is a label chip; this repo's
 * `Badge` is an Ant-style count/status dot, so the label chip here is `Tag`.
 */
const BADGE_BY_STATUS: Record<SectionSyncStatus, { color: TagColor; label: string }> = {
  [SectionSyncStatus.SYNCED]: { color: "success", label: "Synced" },
  [SectionSyncStatus.DRIFTED]: { color: "warning", label: "Drifted" },
}

type SyncStateBadgeProps = {
  status: SectionSyncStatus
  className?: string
}

export default function SyncStateBadge({ status, className }: SyncStateBadgeProps) {
  const badge = BADGE_BY_STATUS[status]

  return (
    <Tag color={badge.color} className={className}>
      {badge.label}
    </Tag>
  )
}
