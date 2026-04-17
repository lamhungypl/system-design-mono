import { Radio as RadioPrimitive } from "@base-ui/react/radio"
import { RadioGroup as RadioGroupPrimitive } from "@base-ui/react/radio-group"
import { cn } from "~/lib/utils"

interface RadioProps extends RadioPrimitive.Root.Props {
  children?: React.ReactNode
  className?: string
}

function Radio({ children, className, ...props }: RadioProps) {
  return (
    <label className={cn("inline-flex cursor-pointer items-center gap-2 select-none", props.disabled && "cursor-not-allowed opacity-50", className)}>
      <RadioPrimitive.Root
        data-slot="radio"
        className={cn(
          "relative size-4 shrink-0 rounded-full border border-input bg-background shadow-xs transition-all outline-none",
          "hover:border-ring",
          "focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50",
          "data-[checked]:border-primary",
          "disabled:cursor-not-allowed disabled:opacity-50",
        )}
        {...props}
      >
        <RadioPrimitive.Indicator className="absolute inset-0 flex items-center justify-center">
          <span className="size-2 rounded-full bg-primary" />
        </RadioPrimitive.Indicator>
      </RadioPrimitive.Root>
      {children && <span className="text-sm leading-none">{children}</span>}
    </label>
  )
}

type RadioOption = { label: React.ReactNode; value: string; disabled?: boolean }

interface RadioGroupProps extends Omit<RadioGroupPrimitive.Props, "onChange"> {
  options?: RadioOption[]
  optionType?: "default" | "button"
  buttonStyle?: "outline" | "solid"
  disabled?: boolean
  direction?: "horizontal" | "vertical"
  onChange?: (value: string) => void
  className?: string
  children?: React.ReactNode
}

function RadioGroup({
  options,
  optionType = "default",
  buttonStyle = "outline",
  disabled,
  direction = "horizontal",
  onChange,
  className,
  children,
  ...props
}: RadioGroupProps) {
  function handleValueChange(value: string) {
    onChange?.(value)
  }

  if (optionType === "button" && options) {
    return (
      <RadioGroupPrimitive
        data-slot="radio-group"
        onValueChange={handleValueChange}
        className={cn(
          "inline-flex rounded-lg border border-border overflow-hidden",
          disabled && "opacity-50 pointer-events-none",
          className,
        )}
        {...props}
      >
        {options.map((opt) => (
          <RadioPrimitive.Root
            key={opt.value}
            value={opt.value}
            disabled={disabled || opt.disabled}
            className={cn(
              "relative cursor-pointer border-r border-border px-4 py-1.5 text-sm font-medium last:border-r-0 transition-colors",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset",
              "hover:bg-muted",
              buttonStyle === "solid"
                ? "data-[checked]:bg-primary data-[checked]:text-primary-foreground data-[checked]:border-primary"
                : "data-[checked]:bg-background data-[checked]:text-primary data-[checked]:shadow-sm",
              "disabled:cursor-not-allowed disabled:opacity-50",
            )}
          >
            {opt.label}
          </RadioPrimitive.Root>
        ))}
      </RadioGroupPrimitive>
    )
  }

  return (
    <RadioGroupPrimitive
      data-slot="radio-group"
      onValueChange={handleValueChange}
      className={cn(
        "flex gap-3",
        direction === "horizontal" ? "flex-row flex-wrap" : "flex-col",
        disabled && "opacity-50 pointer-events-none",
        className,
      )}
      {...props}
    >
      {options
        ? options.map((opt) => (
            <Radio key={opt.value} value={opt.value} disabled={disabled || opt.disabled}>
              {opt.label}
            </Radio>
          ))
        : children}
    </RadioGroupPrimitive>
  )
}

export { Radio, RadioGroup }
export type { RadioProps, RadioGroupProps, RadioOption }
