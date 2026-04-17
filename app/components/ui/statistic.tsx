import { cn } from "~/lib/utils"

interface StatisticProps {
  title?: React.ReactNode
  value?: string | number
  prefix?: React.ReactNode
  suffix?: React.ReactNode
  precision?: number
  loading?: boolean
  valueStyle?: React.CSSProperties
  className?: string
}

function formatValue(value: string | number | undefined, precision?: number): string {
  if (value === undefined) return "-"
  if (typeof value === "string") return value
  if (precision !== undefined) return value.toFixed(precision)
  return value.toLocaleString()
}

function Statistic({ title, value, prefix, suffix, precision, loading, valueStyle, className }: StatisticProps) {
  return (
    <div className={cn("flex flex-col gap-1", className)}>
      {title && (
        <div className="text-sm text-muted-foreground">{title}</div>
      )}
      <div className="flex items-baseline gap-0.5 text-2xl font-semibold tabular-nums" style={valueStyle}>
        {loading ? (
          <div className="h-7 w-24 animate-pulse rounded-md bg-muted" />
        ) : (
          <>
            {prefix && <span className="text-base">{prefix}</span>}
            <span>{formatValue(value, precision)}</span>
            {suffix && <span className="text-base font-normal text-muted-foreground">{suffix}</span>}
          </>
        )}
      </div>
    </div>
  )
}

export { Statistic }
export type { StatisticProps }
