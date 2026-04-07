import { DateRangePicker } from "~/components/date-range-picker/DateRangePicker"

export default function DateRangePickerPage() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 p-6">
      <div className="w-full max-w-2xl">
        <h1 className="mb-1 text-lg font-semibold">Date Range Picker</h1>
        <p className="mb-6 text-sm text-muted-foreground">
          Pick a custom range or choose a preset.
        </p>
        <DateRangePicker />
      </div>
    </div>
  )
}
