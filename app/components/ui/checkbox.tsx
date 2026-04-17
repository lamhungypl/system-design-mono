import { Checkbox as CheckboxPrimitive } from "@base-ui/react/checkbox"
import { cn } from "~/lib/utils"

interface CheckboxProps extends CheckboxPrimitive.Root.Props {
  children?: React.ReactNode
  className?: string
  indeterminate?: boolean
}

function Checkbox({ children, className, indeterminate, ...props }: CheckboxProps) {
  return (
    <label className={cn("inline-flex cursor-pointer items-center gap-2 select-none", props.disabled && "cursor-not-allowed opacity-50", className)}>
      <CheckboxPrimitive.Root
        data-slot="checkbox"
        className={cn(
          "peer relative size-4 shrink-0 rounded-sm border border-input bg-background shadow-xs transition-all outline-none",
          "hover:border-ring",
          "focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50",
          "data-[checked]:border-primary data-[checked]:bg-primary data-[checked]:text-primary-foreground",
          "data-[indeterminate]:border-primary data-[indeterminate]:bg-primary data-[indeterminate]:text-primary-foreground",
          "disabled:cursor-not-allowed disabled:opacity-50",
        )}
        indeterminate={indeterminate}
        {...props}
      >
        <CheckboxPrimitive.Indicator className="flex items-center justify-center">
          {indeterminate ? (
            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="size-3">
              <path d="M3 8h10" />
            </svg>
          ) : (
            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-3">
              <path d="M3 8.5L6.5 12 13 5" />
            </svg>
          )}
        </CheckboxPrimitive.Indicator>
      </CheckboxPrimitive.Root>
      {children && <span className="text-sm leading-none">{children}</span>}
    </label>
  )
}

type CheckboxOption = { label: React.ReactNode; value: string; disabled?: boolean }

interface CheckboxGroupProps {
  options: CheckboxOption[]
  value?: string[]
  defaultValue?: string[]
  onChange?: (values: string[]) => void
  disabled?: boolean
  className?: string
  direction?: "horizontal" | "vertical"
}

function CheckboxGroup({ options, value, defaultValue, onChange, disabled, className, direction = "vertical" }: CheckboxGroupProps) {
  return (
    <div className={cn("flex gap-3", direction === "horizontal" ? "flex-row flex-wrap" : "flex-col", className)}>
      {options.map((opt) => (
        <Checkbox
          key={opt.value}
          checked={value?.includes(opt.value)}
          defaultChecked={defaultValue?.includes(opt.value)}
          disabled={disabled || opt.disabled}
          onCheckedChange={(checked) => {
            if (!onChange || !value) return
            onChange(checked ? [...value, opt.value] : value.filter((v) => v !== opt.value))
          }}
        >
          {opt.label}
        </Checkbox>
      ))}
    </div>
  )
}

export { Checkbox, CheckboxGroup }
export type { CheckboxProps, CheckboxGroupProps, CheckboxOption }
