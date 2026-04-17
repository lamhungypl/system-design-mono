import { subDays } from "date-fns"
import { DatePicker } from "~/components/date-picker/DatePicker"

export default function MinMaxDemo() {
  return (
    <DatePicker
      minDate={subDays(new Date(), 30)}
      maxDate={new Date()}
      placeholder="Last 30 days only"
    />
  )
}
