import { NumberField } from "@base-ui/react/number-field"
import { cn } from "~/lib/utils"

type InputNumberSize = "small" | "default" | "large"

interface InputNumberProps {
  value?: number
  defaultValue?: number
  onChange?: (value: number | null) => void
  min?: number
  max?: number
  step?: number
  precision?: number
  disabled?: boolean
  readOnly?: boolean
  prefix?: React.ReactNode
  suffix?: React.ReactNode
  controls?: boolean
  size?: InputNumberSize
  status?: "error" | "warning"
  placeholder?: string
  className?: string
}

const sizeStyles: Record<InputNumberSize, string> = {
  small: "h-7 text-xs",
  default: "h-9 text-sm",
  large: "h-10 text-base",
}

function InputNumber({
  value,
  defaultValue,
  onChange,
  min,
  max,
  step = 1,
  disabled,
  readOnly,
  prefix,
  suffix,
  controls = true,
  size = "default",
  status,
  placeholder,
  className,
}: InputNumberProps) {
  return (
    <NumberField.Root
      value={value}
      defaultValue={defaultValue}
      onValueChange={onChange}
      min={min}
      max={max}
      step={step}
      disabled={disabled}
      readOnly={readOnly}
      className={cn("inline-flex items-center", className)}
    >
      <NumberField.Group
        className={cn(
          "inline-flex items-center rounded-lg border border-input bg-background shadow-xs transition-colors",
          "focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/50",
          status === "error" && "border-destructive focus-within:ring-destructive/20",
          status === "warning" && "border-amber-400 focus-within:ring-amber-400/20",
          "disabled:cursor-not-allowed disabled:opacity-50",
          sizeStyles[size],
        )}
      >
        {controls && (
          <NumberField.Decrement
            className={cn(
              "flex items-center justify-center border-r border-input px-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50",
              size === "small" ? "h-full text-xs" : "h-full",
            )}
          >
            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="size-3">
              <path d="M3 8h10" />
            </svg>
          </NumberField.Decrement>
        )}
        {prefix && <span className="pl-3 shrink-0 text-muted-foreground text-sm">{prefix}</span>}
        <NumberField.Input
          placeholder={placeholder}
          className={cn(
            "w-24 bg-transparent px-3 text-center tabular-nums outline-none placeholder:text-muted-foreground",
            "disabled:cursor-not-allowed",
            !controls && "px-3",
          )}
        />
        {suffix && <span className="pr-3 shrink-0 text-muted-foreground text-sm">{suffix}</span>}
        {controls && (
          <NumberField.Increment
            className={cn(
              "flex items-center justify-center border-l border-input px-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50",
              size === "small" ? "h-full text-xs" : "h-full",
            )}
          >
            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="size-3">
              <path d="M8 3v10M3 8h10" />
            </svg>
          </NumberField.Increment>
        )}
      </NumberField.Group>
    </NumberField.Root>
  )
}

export { InputNumber }
export type { InputNumberProps, InputNumberSize }
