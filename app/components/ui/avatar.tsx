import { cn } from "~/lib/utils"

type AvatarSize = "small" | "default" | "large" | number
type AvatarShape = "circle" | "square"

interface AvatarProps {
  src?: string
  alt?: string
  size?: AvatarSize
  shape?: AvatarShape
  icon?: React.ReactNode
  className?: string
  style?: React.CSSProperties
  children?: React.ReactNode
}

interface AvatarGroupProps {
  max?: number
  size?: AvatarSize
  className?: string
  children: React.ReactNode
}

const sizeStyles: Record<Exclude<AvatarSize, number>, string> = {
  small: "size-6 text-xs",
  default: "size-8 text-sm",
  large: "size-10 text-base",
}

function getShapeClass(shape: AvatarShape) {
  return shape === "circle" ? "rounded-full" : "rounded-md"
}

function Avatar({ src, alt = "", size = "default", shape = "circle", icon, className, style, children }: AvatarProps) {
  const isNumeric = typeof size === "number"
  const sizeClass = isNumeric ? "" : sizeStyles[size]
  const numericStyle = isNumeric ? { width: size, height: size, fontSize: size * 0.4 } : {}

  return (
    <span
      data-slot="avatar"
      className={cn(
        "relative inline-flex shrink-0 items-center justify-center overflow-hidden bg-muted font-medium text-muted-foreground select-none",
        getShapeClass(shape),
        sizeClass,
        className,
      )}
      style={{ ...numericStyle, ...style }}
    >
      {src ? (
        <img src={src} alt={alt} className="h-full w-full object-cover" />
      ) : icon ? (
        <span className="[&_svg]:size-[45%]">{icon}</span>
      ) : (
        children
      )}
    </span>
  )
}

function AvatarGroup({ max = 5, size, className, children }: AvatarGroupProps) {
  const kids = Array.isArray(children) ? children : [children]
  const shown = kids.slice(0, max)
  const extra = kids.length - max

  return (
    <div className={cn("flex items-center -space-x-2", className)}>
      {shown.map((child, i) => (
        <span key={i} className="ring-2 ring-background rounded-full">
          {size ? (child as React.ReactElement) : child}
        </span>
      ))}
      {extra > 0 && (
        <span
          className={cn(
            "relative inline-flex shrink-0 items-center justify-center overflow-hidden bg-muted font-medium text-muted-foreground text-xs ring-2 ring-background rounded-full",
            size && typeof size !== "number" ? sizeStyles[size] : "size-8",
          )}
        >
          +{extra}
        </span>
      )}
    </div>
  )
}

export { Avatar, AvatarGroup }
export type { AvatarProps, AvatarGroupProps, AvatarSize, AvatarShape }
