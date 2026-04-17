import { cn } from "~/lib/utils"

interface EmptyProps {
  image?: React.ReactNode
  imageStyle?: React.CSSProperties
  description?: React.ReactNode
  children?: React.ReactNode
  className?: string
}

function DefaultEmptyImage({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" fill="none" className={cn("text-muted-foreground/40", className)}>
      <rect x="8" y="20" width="48" height="34" rx="3" stroke="currentColor" strokeWidth="2" />
      <path d="M8 30h48" stroke="currentColor" strokeWidth="2" />
      <path d="M24 10l-8 10M40 10l8 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M22 42h20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M28 38h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

function Empty({ image, imageStyle, description = "No data", children, className }: EmptyProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center gap-3 py-8 text-center", className)}>
      <div style={imageStyle}>
        {image === null ? null : image ?? <DefaultEmptyImage className="size-16" />}
      </div>
      {description !== null && description !== false && (
        <p className="text-sm text-muted-foreground">{description}</p>
      )}
      {children && <div className="mt-1">{children}</div>}
    </div>
  )
}

export { Empty }
export type { EmptyProps }
