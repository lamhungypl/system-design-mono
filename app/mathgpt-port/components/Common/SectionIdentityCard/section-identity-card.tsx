import { cn } from "~/lib/utils"

/**
 * PORT: `mathgpt_app/src/components/Common/SectionIdentityCard/SectionIdentityCard.tsx`.
 * Same name, same props; AhaUI `u-*` utilities swapped for Tailwind.
 */
type SectionIdentityCardProps = {
  name: string
  instructorName: string | null
  instructorEmail: string | null
  coverUrl: string | null
  className?: string
}

/** The section header the publish dialogs repeat: thumbnail, name, and who teaches it. */
export default function SectionIdentityCard({
  name,
  instructorName,
  instructorEmail,
  coverUrl,
  className,
}: SectionIdentityCardProps) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      {coverUrl ? (
        <img
          src={coverUrl}
          alt=""
          className="h-[42px] w-14 rounded-md object-cover"
        />
      ) : (
        <div className="h-[42px] w-14 shrink-0 rounded-md bg-muted" />
      )}
      <div className="flex min-w-0 flex-col">
        <span className="truncate text-sm font-semibold text-foreground">
          {name}
        </span>
        {instructorName ? (
          <span className="truncate text-xs text-muted-foreground">
            Instructor: {instructorName}
            {instructorEmail ? ` (${instructorEmail})` : ""}
          </span>
        ) : null}
      </div>
    </div>
  )
}
