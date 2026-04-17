import { useState } from "react"
import { startOfDay, subDays } from "date-fns"
import { DatePicker } from "~/components/date-picker/DatePicker"
import type { DatePreset } from "~/lib/dateUtils"

const PRESETS: DatePreset[] = [
  { label: "Today", value: () => startOfDay(new Date()) },
  { label: "Yesterday", value: () => startOfDay(subDays(new Date(), 1)) },
  { label: "A week ago", value: () => startOfDay(subDays(new Date(), 7)) },
  { label: "A month ago", value: () => startOfDay(subDays(new Date(), 30)) },
  { label: "Custom" },
]

export default function WithPresetsDemo() {
  const [date, setDate] = useState<Date | null>(null)
  return <DatePicker presets={PRESETS} value={date} onChange={setDate} />
}
