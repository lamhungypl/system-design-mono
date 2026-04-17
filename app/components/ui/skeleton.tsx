import { cn } from "~/lib/utils"

interface SkeletonProps {
  className?: string
  active?: boolean
  children?: React.ReactNode
}

function SkeletonBase({ className, active = true }: { className?: string; active?: boolean }) {
  return (
    <div
      className={cn(
        "rounded-md bg-muted",
        active && "animate-pulse",
        className,
      )}
    />
  )
}

interface SkeletonAvatarProps {
  size?: "small" | "default" | "large"
  shape?: "circle" | "square"
  active?: boolean
  className?: string
}

function SkeletonAvatar({ size = "default", shape = "circle", active, className }: SkeletonAvatarProps) {
  const sizeMap = { small: "size-6", default: "size-8", large: "size-10" }
  return (
    <SkeletonBase
      active={active}
      className={cn(sizeMap[size], shape === "circle" ? "rounded-full" : "rounded-md", className)}
    />
  )
}

interface SkeletonInputProps {
  size?: "small" | "default" | "large"
  active?: boolean
  className?: string
}

function SkeletonInput({ size = "default", active, className }: SkeletonInputProps) {
  const sizeMap = { small: "h-7 w-40", default: "h-9 w-56", large: "h-10 w-64" }
  return <SkeletonBase active={active} className={cn(sizeMap[size], className)} />
}

interface SkeletonButtonProps {
  size?: "small" | "default" | "large"
  shape?: "default" | "circle" | "round"
  active?: boolean
  className?: string
}

function SkeletonButton({ size = "default", shape = "default", active, className }: SkeletonButtonProps) {
  const sizeMap = { small: "h-7 w-16", default: "h-9 w-20", large: "h-10 w-24" }
  const shapeMap = { default: "rounded-md", circle: "rounded-full aspect-square !w-auto", round: "rounded-full" }
  return <SkeletonBase active={active} className={cn(sizeMap[size], shapeMap[shape], className)} />
}

interface SkeletonParagraphProps {
  rows?: number
  active?: boolean
  className?: string
}

function SkeletonParagraph({ rows = 3, active, className }: SkeletonParagraphProps) {
  return (
    <div className={cn("flex flex-col gap-2.5", className)}>
      {Array.from({ length: rows }).map((_, i) => (
        <SkeletonBase
          key={i}
          active={active}
          className={cn("h-4", i === rows - 1 ? "w-3/4" : "w-full")}
        />
      ))}
    </div>
  )
}

interface SkeletonFullProps {
  avatar?: boolean | SkeletonAvatarProps
  paragraph?: boolean | { rows?: number }
  title?: boolean
  active?: boolean
  className?: string
}

function Skeleton({ avatar, paragraph = true, title = true, active = true, className }: SkeletonFullProps) {
  const avatarProps = typeof avatar === "object" ? avatar : {}
  const paragraphRows = typeof paragraph === "object" ? (paragraph.rows ?? 3) : 3

  return (
    <div className={cn("flex gap-4", className)}>
      {avatar && <SkeletonAvatar {...avatarProps} active={active} />}
      <div className="flex-1 space-y-3">
        {title && <SkeletonBase active={active} className="h-4 w-2/5" />}
        {paragraph && <SkeletonParagraph rows={paragraphRows} active={active} />}
      </div>
    </div>
  )
}

Skeleton.Avatar = SkeletonAvatar
Skeleton.Input = SkeletonInput
Skeleton.Button = SkeletonButton
Skeleton.Paragraph = SkeletonParagraph

export { Skeleton, SkeletonAvatar, SkeletonInput, SkeletonButton, SkeletonParagraph }
