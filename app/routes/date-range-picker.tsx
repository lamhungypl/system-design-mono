import { useState } from "react"
import { DateRangePicker } from "~/components/date-range-picker/DateRangePicker"
import { DateRangeSelect } from "~/components/date-range-select/DateRangeSelect"
import type { DateRange } from "~/lib/dateUtils"

export default function DateRangePickerPage() {
  const [controlled, setControlled] = useState<DateRange>({
    start: null,
    end: null,
  })

  return (
    <div className="flex min-h-svh flex-col items-center gap-10 p-8">
      <div className="w-full max-w-2xl space-y-2">
        <h2 className="text-base font-semibold">Uncontrolled (default)</h2>
        <p className="text-sm text-muted-foreground">
          No props — internal state only.
        </p>
        <DateRangePicker />
      </div>

      <div className="w-full max-w-2xl space-y-2">
        <h2 className="text-base font-semibold">Controlled</h2>
        <p className="text-sm text-muted-foreground">
          Value:{" "}
          {controlled.start
            ? `${controlled.start.toDateString()} → ${controlled.end?.toDateString() ?? "..."}`
            : "none"}
        </p>
        <DateRangePicker value={controlled} onChange={setControlled} />
      </div>

      <div className="w-full max-w-2xl space-y-2">
        <h2 className="text-base font-semibold">
          No presets + maxDate (today)
        </h2>
        <p className="text-sm text-muted-foreground">
          Preset panel hidden, future dates disabled.
        </p>
        <DateRangePicker
          slotProps={{
            presets: { hidden: true },
            calendar: { maxDate: new Date() },
          }}
        />
      </div>

      <div className="w-full max-w-2xl space-y-2">
        <h2 className="text-base font-semibold">Custom presets</h2>
        <p className="text-sm text-muted-foreground">
          Override preset list with domain-specific options.
        </p>
        <DateRangePicker
          slotProps={{
            presets: {
              presets: [
                {
                  id: "last-week",
                  label: "Last week",
                  getRange: () => {
                    const end = new Date()
                    const start = new Date()
                    start.setDate(end.getDate() - 6)
                    return { start, end }
                  },
                },
                {
                  id: "last-month",
                  label: "Last month",
                  getRange: () => {
                    const end = new Date()
                    const start = new Date()
                    start.setDate(end.getDate() - 29)
                    return { start, end }
                  },
                },
                { id: "custom", label: "Custom" },
              ],
            },
          }}
        />
      </div>

      <div className="w-full max-w-2xl space-y-2">
        <h2 className="text-base font-semibold">Disabled</h2>
        <DateRangePicker
          disabled
          defaultValue={{
            start: new Date(2026, 2, 1),
            end: new Date(2026, 2, 15),
          }}
        />
      </div>

      <div className="w-full max-w-2xl space-y-2">
        <h2 className="text-base font-semibold">Compound composition</h2>
        <p className="text-sm text-muted-foreground">
          Caller controls the child tree — render only what you need.
        </p>
        <DateRangePicker>
          <DateRangePicker.Calendar />
        </DateRangePicker>
      </div>

      <div className="w-full max-w-2xl space-y-2">
        <h2 className="text-base font-semibold">DateRangeSelect</h2>
        <p className="text-sm text-muted-foreground">
          Compact select-style trigger. Custom range opens a calendar panel.
        </p>
        <DateRangeSelect />
      </div>
    </div>
  )
}
