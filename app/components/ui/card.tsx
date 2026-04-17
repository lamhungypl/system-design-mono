import { cn } from "~/lib/utils"
import { Skeleton } from "~/components/ui/skeleton"

interface CardProps {
  title?: React.ReactNode
  extra?: React.ReactNode
  bordered?: boolean
  loading?: boolean
  size?: "default" | "small"
  className?: string
  bodyClassName?: string
  children?: React.ReactNode
  style?: React.CSSProperties
}

interface CardMetaProps {
  avatar?: React.ReactNode
  title?: React.ReactNode
  description?: React.ReactNode
  className?: string
}

function CardMeta({ avatar, title, description, className }: CardMetaProps) {
  return (
    <div className={cn("flex items-start gap-3", className)}>
      {avatar && <div className="shrink-0">{avatar}</div>}
      <div className="min-w-0 flex-1">
        {title && <div className="font-medium text-sm leading-snug">{title}</div>}
        {description && <div className="mt-0.5 text-sm text-muted-foreground leading-snug">{description}</div>}
      </div>
    </div>
  )
}

function Card({ title, extra, bordered = true, loading, size = "default", className, bodyClassName, children, style }: CardProps) {
  const padding = size === "small" ? "px-4 py-3" : "px-5 py-4"

  return (
    <div
      data-slot="card"
      className={cn(
        "rounded-xl bg-card text-card-foreground",
        bordered && "border border-border shadow-xs",
        className,
      )}
      style={style}
    >
      {(title || extra) && (
        <div className={cn("flex items-center justify-between gap-4 border-b border-border", padding)}>
          <div className="font-medium text-sm">{title}</div>
          {extra && <div className="shrink-0 text-sm text-muted-foreground">{extra}</div>}
        </div>
      )}
      <div className={cn(padding, bodyClassName)}>
        {loading ? <Skeleton paragraph={{ rows: 3 }} /> : children}
      </div>
    </div>
  )
}

Card.Meta = CardMeta

export { Card, CardMeta }
export type { CardProps, CardMetaProps }
