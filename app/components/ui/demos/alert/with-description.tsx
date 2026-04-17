import { Alert } from "~/components/ui/alert"
import { DemoItem } from "~/components/ui/demo-block"

export default function AlertDescriptionDemo() {
  return (
    <div className="flex flex-col gap-3 max-w-lg">
      <DemoItem label="Info with description">
        <Alert
          type="info"
          showIcon
          message="Heads up"
          description="You can update your billing information in the account settings page."
        />
      </DemoItem>
      <DemoItem label="Success with description">
        <Alert
          type="success"
          showIcon
          message="Payment received"
          description="Your subscription has been renewed for another year."
        />
      </DemoItem>
      <DemoItem label="Error — closable">
        <Alert
          type="error"
          showIcon
          closable
          message="Connection failed"
          description="Unable to reach the server. Check your network and try again."
        />
      </DemoItem>
    </div>
  )
}
