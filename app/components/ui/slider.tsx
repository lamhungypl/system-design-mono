import { Slider as SliderPrimitive } from "@base-ui/react/slider"
import { cn } from "~/lib/utils"

interface SliderMark {
  value: number
  label?: React.ReactNode
}

interface SliderProps {
  value?: number | number[]
  defaultValue?: number | number[]
  onChange?: (value: number | number[]) => void
  min?: number
  max?: number
  step?: number
  disabled?: boolean
  marks?: boolean | SliderMark[]
  range?: boolean
  vertical?: boolean
  reverse?: boolean
  tooltip?: boolean | { formatter?: (value: number) => React.ReactNode }
  className?: string
}

function Slider({
  value,
  defaultValue,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  disabled,
  marks,
  range,
  vertical,
  tooltip = true,
  className,
}: SliderProps) {
  const values = value !== undefined ? (Array.isArray(value) ? value : [value]) : undefined
  const defaults = defaultValue !== undefined ? (Array.isArray(defaultValue) ? defaultValue : [defaultValue]) : range ? [0, 50] : [0]

  const thumbCount = range ? 2 : 1

  return (
    <SliderPrimitive.Root
      value={values}
      defaultValue={defaults}
      onValueChange={(vals) => onChange?.(range ? vals : vals[0])}
      min={min}
      max={max}
      step={step}
      disabled={disabled}
      orientation={vertical ? "vertical" : "horizontal"}
      className={cn(
        "relative flex touch-none select-none items-center",
        vertical ? "h-48 flex-col w-4" : "h-4 w-full",
        disabled && "opacity-50",
        className,
      )}
    >
      <SliderPrimitive.Control className={cn("relative flex items-center", vertical ? "h-full w-4 flex-col" : "h-4 w-full")}>
        <SliderPrimitive.Track className={cn("relative overflow-hidden rounded-full bg-muted", vertical ? "w-1.5 h-full" : "h-1.5 w-full")}>
          <SliderPrimitive.Indicator className="absolute rounded-full bg-primary data-[orientation=horizontal]:h-full data-[orientation=vertical]:w-full" />
        </SliderPrimitive.Track>
        {Array.from({ length: thumbCount }).map((_, i) => (
          <SliderPrimitive.Thumb
            key={i}
            className={cn(
              "block size-4 rounded-full border-2 border-primary bg-background shadow-sm transition-shadow outline-none",
              "hover:shadow-md",
              "focus-visible:ring-3 focus-visible:ring-ring/50",
              "disabled:cursor-not-allowed disabled:opacity-50",
            )}
          />
        ))}
      </SliderPrimitive.Control>

      {marks && (
        <div className={cn("absolute pointer-events-none", vertical ? "inset-y-0 left-4 flex flex-col justify-between" : "inset-x-0 top-4 flex justify-between")}>
          {Array.isArray(marks)
            ? marks.map((mark) => (
                <span
                  key={mark.value}
                  className="text-xs text-muted-foreground"
                  style={vertical ? {} : { left: `${((mark.value - min) / (max - min)) * 100}%`, position: "absolute", transform: "translateX(-50%)" }}
                >
                  {mark.label ?? mark.value}
                </span>
              ))
            : [min, max].map((v) => (
                <span key={v} className="text-xs text-muted-foreground">{v}</span>
              ))}
        </div>
      )}
    </SliderPrimitive.Root>
  )
}

export { Slider }
export type { SliderProps, SliderMark }
