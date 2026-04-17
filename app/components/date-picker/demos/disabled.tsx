import { DatePicker } from "~/components/date-picker/DatePicker"

export default function DisabledDemo() {
  return <DatePicker disabled defaultValue={new Date()} />
}
