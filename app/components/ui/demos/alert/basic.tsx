import { Alert } from "~/components/ui/alert"
import { DemoItem } from "~/components/ui/demo-block"

export default function AlertBasicDemo() {
  return (
    <div className="flex flex-col gap-3 max-w-lg">
      <DemoItem label="Info">
        <Alert type="info" message="Informational message." />
      </DemoItem>
      <DemoItem label="Success">
        <Alert type="success" message="Operation completed successfully." />
      </DemoItem>
      <DemoItem label="Warning">
        <Alert type="warning" message="This action may have consequences." />
      </DemoItem>
      <DemoItem label="Error">
        <Alert type="error" message="An error occurred. Please try again." />
      </DemoItem>
    </div>
  )
}
