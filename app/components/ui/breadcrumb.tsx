import { cn } from "~/lib/utils"

interface BreadcrumbItem {
  title: React.ReactNode
  href?: string
  onClick?: (e: React.MouseEvent) => void
  menu?: { items: { key: string; label: React.ReactNode }[] }
}

interface BreadcrumbProps {
  items: BreadcrumbItem[]
  separator?: React.ReactNode
  className?: string
}

function DefaultSeparator() {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="size-3.5 text-muted-foreground/60">
      <path d="M6 3l4 5-4 5" />
    </svg>
  )
}

function Breadcrumb({ items, separator, className }: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className={cn("flex items-center", className)}>
      <ol className="flex items-center gap-1.5 text-sm">
        {items.map((item, i) => {
          const isLast = i === items.length - 1
          return (
            <li key={i} className="flex items-center gap-1.5">
              {isLast ? (
                <span className="font-medium text-foreground" aria-current="page">{item.title}</span>
              ) : item.href ? (
                <a
                  href={item.href}
                  onClick={item.onClick}
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  {item.title}
                </a>
              ) : (
                <button
                  type="button"
                  onClick={item.onClick}
                  className="text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
                >
                  {item.title}
                </button>
              )}
              {!isLast && (separator ?? <DefaultSeparator />)}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}

export { Breadcrumb }
export type { BreadcrumbProps, BreadcrumbItem }
