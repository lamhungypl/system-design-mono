import { Select as SelectPrimitive } from "@base-ui/react/select"
import { cn } from "~/lib/utils"

type SelectSize = "small" | "default" | "large"

interface SelectOption {
  value: string
  label: React.ReactNode
  disabled?: boolean
}

interface SelectGroup {
  label: string
  options: SelectOption[]
}

interface SelectProps {
  options?: (SelectOption | SelectGroup)[]
  value?: string
  defaultValue?: string
  onChange?: (value: string) => void
  placeholder?: string
  disabled?: boolean
  size?: SelectSize
  status?: "error" | "warning"
  allowClear?: boolean
  className?: string
  children?: React.ReactNode
}

const sizeStyles: Record<SelectSize, string> = {
  small: "h-7 px-2 text-xs",
  default: "h-9 px-3 text-sm",
  large: "h-10 px-3 text-base",
}

function isGrouped(item: SelectOption | SelectGroup): item is SelectGroup {
  return "options" in item
}

function Select({ options, value, defaultValue, onChange, placeholder = "Select…", disabled, size = "default", status, allowClear, className, children }: SelectProps) {
  return (
    <SelectPrimitive.Root
      value={value}
      defaultValue={defaultValue}
      onValueChange={onChange}
      disabled={disabled}
    >
      <SelectPrimitive.Trigger
        className={cn(
          "inline-flex w-full cursor-pointer items-center justify-between gap-2 rounded-lg border border-input bg-background shadow-xs transition-colors",
          "hover:bg-muted/40",
          "focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none",
          "disabled:cursor-not-allowed disabled:opacity-50",
          "aria-expanded:border-ring aria-expanded:ring-3 aria-expanded:ring-ring/50",
          status === "error" && "border-destructive focus-visible:ring-destructive/20",
          status === "warning" && "border-amber-400 focus-visible:ring-amber-400/20",
          sizeStyles[size],
          className,
        )}
      >
        <SelectPrimitive.Value placeholder={<span className="text-muted-foreground">{placeholder}</span>} />
        <SelectPrimitive.Icon className="shrink-0 text-muted-foreground">
          <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="size-3.5">
            <path d="M4 6l4 4 4-4" />
          </svg>
        </SelectPrimitive.Icon>
      </SelectPrimitive.Trigger>

      <SelectPrimitive.Portal>
        <SelectPrimitive.Positioner side="bottom" sideOffset={4} align="start" alignItemWithTrigger={false} className="z-50 outline-none">
          <SelectPrimitive.Popup className="min-w-[var(--anchor-width)] min-w-32 overflow-hidden rounded-xl border border-border bg-card shadow-lg outline-none data-[ending-style]:animate-out data-[ending-style]:fade-out-0 data-[ending-style]:zoom-out-95 animate-in fade-in-0 zoom-in-95">
            <SelectPrimitive.List className="max-h-60 overflow-y-auto p-1">
              {options
                ? options.map((item, i) =>
                    isGrouped(item) ? (
                      <SelectPrimitive.Group key={i}>
                        <SelectPrimitive.GroupLabel className="px-3 py-1.5 text-xs font-semibold text-muted-foreground">
                          {item.label}
                        </SelectPrimitive.GroupLabel>
                        {item.options.map((opt) => (
                          <SelectItem key={opt.value} {...opt} />
                        ))}
                      </SelectPrimitive.Group>
                    ) : (
                      <SelectItem key={item.value} {...(item as SelectOption)} />
                    )
                  )
                : children}
            </SelectPrimitive.List>
          </SelectPrimitive.Popup>
        </SelectPrimitive.Positioner>
      </SelectPrimitive.Portal>
    </SelectPrimitive.Root>
  )
}

function SelectItem({ value, label, disabled }: SelectOption) {
  return (
    <SelectPrimitive.Item
      value={value}
      disabled={disabled}
      className={cn(
        "flex cursor-pointer items-center gap-2 rounded-md px-3 py-1.5 text-sm outline-none transition-colors select-none",
        "hover:bg-accent hover:text-accent-foreground",
        "focus:bg-accent focus:text-accent-foreground",
        "data-[selected]:bg-accent data-[selected]:text-accent-foreground",
        "disabled:cursor-not-allowed disabled:opacity-50",
      )}
    >
      <SelectPrimitive.ItemText>{label}</SelectPrimitive.ItemText>
      <SelectPrimitive.ItemIndicator className="ml-auto">
        <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-3.5">
          <path d="M3 8.5L6.5 12 13 5" />
        </svg>
      </SelectPrimitive.ItemIndicator>
    </SelectPrimitive.Item>
  )
}

export { Select, SelectItem }
export type { SelectProps, SelectOption, SelectGroup, SelectSize }
