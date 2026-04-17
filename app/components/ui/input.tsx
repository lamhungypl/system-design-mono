import { forwardRef, useState } from "react"
import { cn } from "~/lib/utils"

type InputSize = "small" | "default" | "large"

interface InputProps extends Omit<React.ComponentProps<"input">, "size"> {
  size?: InputSize
  prefix?: React.ReactNode
  suffix?: React.ReactNode
  addonBefore?: React.ReactNode
  addonAfter?: React.ReactNode
  status?: "error" | "warning"
  allowClear?: boolean
  onClear?: () => void
}

const sizeStyles: Record<InputSize, string> = {
  small: "h-7 px-2 text-xs",
  default: "h-9 px-3 text-sm",
  large: "h-10 px-3 text-base",
}

const baseInputClass =
  "flex w-full rounded-lg border border-input bg-background text-foreground shadow-xs transition-colors placeholder:text-muted-foreground focus:outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 aria-[invalid=true]:border-destructive aria-[invalid=true]:ring-destructive/20"

const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { size = "default", prefix, suffix, addonBefore, addonAfter, status, allowClear, onClear, className, value, onChange, ...props },
  ref
) {
  const [internalValue, setInternalValue] = useState(props.defaultValue ?? "")
  const controlled = value !== undefined
  const currentValue = controlled ? value : internalValue

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (!controlled) setInternalValue(e.target.value)
    onChange?.(e)
  }

  const statusClass = status === "error" ? "border-destructive focus-visible:ring-destructive/20" : status === "warning" ? "border-amber-400 focus-visible:ring-amber-400/20" : ""

  const input = (
    <input
      ref={ref}
      value={currentValue}
      onChange={handleChange}
      aria-invalid={status === "error" || undefined}
      className={cn(
        baseInputClass,
        sizeStyles[size],
        (prefix || suffix || allowClear) && "rounded-none border-0 shadow-none focus-visible:ring-0 px-0 flex-1 min-w-0 bg-transparent",
        statusClass,
        !prefix && !suffix && !addonBefore && !addonAfter && !allowClear && className,
      )}
      {...props}
    />
  )

  if (!prefix && !suffix && !addonBefore && !addonAfter && !allowClear) {
    return input
  }

  return (
    <span
      className={cn(
        "inline-flex items-center w-full rounded-lg border border-input bg-background shadow-xs transition-colors focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/50",
        sizeStyles[size],
        status === "error" && "border-destructive focus-within:ring-destructive/20",
        status === "warning" && "border-amber-400 focus-within:ring-amber-400/20",
        className,
      )}
    >
      {addonBefore && (
        <span className="flex shrink-0 items-center border-r border-input bg-muted px-3 text-muted-foreground -my-px -ml-px first:rounded-l-lg text-sm h-full">{addonBefore}</span>
      )}
      {prefix && <span className="pl-3 shrink-0 text-muted-foreground [&_svg]:size-4">{prefix}</span>}
      {input}
      {allowClear && currentValue && (
        <button type="button" tabIndex={-1} onClick={() => { if (!controlled) setInternalValue(""); onClear?.() }} className="pr-2 shrink-0 text-muted-foreground hover:text-foreground">
          <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="size-3.5">
            <circle cx="8" cy="8" r="6.5" /><path d="M5.5 5.5l5 5M10.5 5.5l-5 5" />
          </svg>
        </button>
      )}
      {suffix && <span className="pr-3 shrink-0 text-muted-foreground [&_svg]:size-4">{suffix}</span>}
      {addonAfter && (
        <span className="flex shrink-0 items-center border-l border-input bg-muted px-3 text-muted-foreground -my-px -mr-px last:rounded-r-lg text-sm h-full">{addonAfter}</span>
      )}
    </span>
  )
})

interface TextareaProps extends Omit<React.ComponentProps<"textarea">, "size"> {
  size?: InputSize
  status?: "error" | "warning"
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { size = "default", status, className, ...props },
  ref
) {
  const statusClass = status === "error" ? "border-destructive focus-visible:ring-destructive/20" : status === "warning" ? "border-amber-400 focus-visible:ring-amber-400/20" : ""
  return (
    <textarea
      ref={ref}
      className={cn(
        baseInputClass,
        "min-h-[80px] resize-y py-2",
        size === "small" ? "px-2 text-xs" : size === "large" ? "px-3 text-base" : "px-3 text-sm",
        statusClass,
        className,
      )}
      {...props}
    />
  )
})

interface PasswordInputProps extends Omit<InputProps, "type" | "suffix"> {}

const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(function PasswordInput(props, ref) {
  const [show, setShow] = useState(false)
  const eyeIcon = show ? (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="size-4">
      <path d="M1 8s2.5-5 7-5 7 5 7 5-2.5 5-7 5-7-5-7-5Z" />
      <circle cx="8" cy="8" r="2" />
      <path d="M2 2l12 12" />
    </svg>
  ) : (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="size-4">
      <path d="M1 8s2.5-5 7-5 7 5 7 5-2.5 5-7 5-7-5-7-5Z" />
      <circle cx="8" cy="8" r="2" />
    </svg>
  )
  return (
    <Input
      ref={ref}
      type={show ? "text" : "password"}
      suffix={
        <button type="button" tabIndex={-1} onClick={() => setShow((v) => !v)} className="text-muted-foreground hover:text-foreground">
          {eyeIcon}
        </button>
      }
      {...props}
    />
  )
})

Input.displayName = "Input"
Textarea.displayName = "Textarea"
PasswordInput.displayName = "PasswordInput"

export { Input, Textarea, PasswordInput }
export type { InputProps, TextareaProps, PasswordInputProps, InputSize }
