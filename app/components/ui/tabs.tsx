import { Tabs as TabsPrimitive } from "@base-ui/react/tabs"
import { cn } from "~/lib/utils"

type TabsType = "line" | "card" | "editable-card"

interface TabItem {
  key: string
  label: React.ReactNode
  children?: React.ReactNode
  disabled?: boolean
  icon?: React.ReactNode
}

interface TabsProps {
  items?: TabItem[]
  defaultActiveKey?: string
  activeKey?: string
  onChange?: (key: string) => void
  type?: TabsType
  size?: "small" | "default" | "large"
  centered?: boolean
  className?: string
  children?: React.ReactNode
}

const sizeStyles = {
  small: "text-xs h-8 px-3",
  default: "text-sm h-9 px-4",
  large: "text-base h-10 px-5",
}

function Tabs({
  items,
  defaultActiveKey,
  activeKey,
  onChange,
  type = "line",
  size = "default",
  centered,
  className,
  children,
}: TabsProps) {
  const tabClass = cn(
    "inline-flex items-center gap-1.5 font-medium whitespace-nowrap transition-colors outline-none cursor-pointer select-none",
    "focus-visible:ring-2 focus-visible:ring-ring rounded-sm",
    sizeStyles[size],
    type === "line" && [
      "relative text-muted-foreground",
      "hover:text-foreground",
      "data-[selected]:text-foreground",
      "data-[selected]:after:absolute data-[selected]:after:bottom-0 data-[selected]:after:inset-x-0 data-[selected]:after:h-0.5 data-[selected]:after:bg-primary data-[selected]:after:rounded-full",
      "disabled:cursor-not-allowed disabled:opacity-50",
    ],
    type === "card" && [
      "border border-b-0 rounded-t-lg text-muted-foreground bg-muted/50",
      "hover:text-foreground hover:bg-muted",
      "-mb-px",
      "data-[selected]:bg-background data-[selected]:text-foreground data-[selected]:border-border data-[selected]:border-b-background",
      "disabled:cursor-not-allowed disabled:opacity-50",
    ],
  )

  return (
    <TabsPrimitive.Root
      defaultValue={defaultActiveKey ?? items?.[0]?.key}
      value={activeKey}
      onValueChange={onChange}
      className={cn("flex flex-col", className)}
    >
      <TabsPrimitive.List
        className={cn(
          "flex",
          type === "line" && "border-b border-border gap-0",
          type === "card" && "gap-1 px-1 pt-1 bg-muted/30 border-b border-border",
          centered && "justify-center",
        )}
      >
        {(items ?? []).map((item) => (
          <TabsPrimitive.Tab
            key={item.key}
            value={item.key}
            disabled={item.disabled}
            className={tabClass}
          >
            {item.icon && <span className="[&_svg]:size-4">{item.icon}</span>}
            {item.label}
          </TabsPrimitive.Tab>
        ))}
        {children}
        {type === "line" && <TabsPrimitive.Indicator className="hidden" />}
      </TabsPrimitive.List>

      {(items ?? []).map((item) => (
        <TabsPrimitive.Panel
          key={item.key}
          value={item.key}
          className="mt-4 outline-none"
        >
          {item.children}
        </TabsPrimitive.Panel>
      ))}
    </TabsPrimitive.Root>
  )
}

export { Tabs }
export type { TabsProps, TabItem }
