import { useState } from "react"
import { DatePicker } from "~/components/date-picker/DatePicker"

export default function BasicDemo() {
  const [date, setDate] = useState<Date | null>(null)
  return <DatePicker value={date} onChange={setDate} />
}
