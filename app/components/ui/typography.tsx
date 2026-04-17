import { cn } from "~/lib/utils"

type TextType = "secondary" | "success" | "warning" | "danger"

const typeStyles: Record<TextType, string> = {
  secondary: "text-muted-foreground",
  success: "text-green-600 dark:text-green-400",
  warning: "text-amber-600 dark:text-amber-400",
  danger: "text-destructive",
}

interface TypographyTextProps {
  type?: TextType
  strong?: boolean
  italic?: boolean
  underline?: boolean
  delete?: boolean
  code?: boolean
  mark?: boolean
  keyboard?: boolean
  disabled?: boolean
  ellipsis?: boolean
  copyable?: boolean
  className?: string
  children?: React.ReactNode
  style?: React.CSSProperties
}

function Text({
  type,
  strong,
  italic,
  underline,
  delete: del,
  code,
  mark,
  keyboard,
  disabled,
  ellipsis,
  className,
  children,
  style,
}: TypographyTextProps) {
  let content = children
  if (code) content = <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-[0.875em]">{content}</code>
  if (mark) content = <mark className="rounded-sm bg-amber-200/80 px-0.5 dark:bg-amber-400/30">{content}</mark>
  if (keyboard) content = <kbd className="rounded border border-border bg-muted px-1.5 py-0.5 font-mono text-[0.875em] shadow-sm">{content}</kbd>
  if (del) content = <del>{content}</del>
  if (underline) content = <u>{content}</u>

  return (
    <span
      className={cn(
        type && typeStyles[type],
        strong && "font-semibold",
        italic && "italic",
        disabled && "opacity-50 cursor-not-allowed select-none",
        ellipsis && "truncate block",
        className,
      )}
      style={style}
    >
      {content}
    </span>
  )
}

interface TitleProps {
  level?: 1 | 2 | 3 | 4 | 5
  type?: TextType
  className?: string
  children?: React.ReactNode
  style?: React.CSSProperties
}

const titleStyles: Record<NonNullable<TitleProps["level"]>, string> = {
  1: "text-4xl font-bold tracking-tight",
  2: "text-3xl font-semibold tracking-tight",
  3: "text-2xl font-semibold",
  4: "text-xl font-semibold",
  5: "text-base font-semibold",
}

function Title({ level = 1, type, className, children, style }: TitleProps) {
  const Tag = `h${level}` as "h1" | "h2" | "h3" | "h4" | "h5"
  return (
    <Tag
      className={cn("leading-tight", titleStyles[level], type && typeStyles[type], className)}
      style={style}
    >
      {children}
    </Tag>
  )
}

interface ParagraphProps {
  type?: TextType
  strong?: boolean
  ellipsis?: boolean | { rows?: number }
  className?: string
  children?: React.ReactNode
  style?: React.CSSProperties
}

function Paragraph({ type, strong, ellipsis, className, children, style }: ParagraphProps) {
  const rows = typeof ellipsis === "object" ? ellipsis.rows : undefined

  return (
    <p
      className={cn(
        "leading-relaxed",
        type && typeStyles[type],
        strong && "font-semibold",
        ellipsis === true && "truncate",
        className,
      )}
      style={{
        ...(rows ? { overflow: "hidden", display: "-webkit-box", WebkitLineClamp: rows, WebkitBoxOrient: "vertical" } : {}),
        ...style,
      }}
    >
      {children}
    </p>
  )
}

interface LinkProps extends React.ComponentProps<"a"> {
  type?: TextType
  disabled?: boolean
}

function Link({ type, disabled, className, children, ...props }: LinkProps) {
  return (
    <a
      className={cn(
        "text-primary underline-offset-4 hover:underline",
        type && typeStyles[type],
        disabled && "pointer-events-none opacity-50",
        className,
      )}
      aria-disabled={disabled}
      {...props}
    >
      {children}
    </a>
  )
}

export { Text, Title, Paragraph, Link }
export type { TypographyTextProps, TitleProps, ParagraphProps, LinkProps, TextType }
