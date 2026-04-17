import { Empty } from "~/components/ui/empty"
import { Button } from "~/components/ui/button"
import { DemoItem } from "~/components/ui/demo-block"

export default function EmptyBasicDemo() {
  return (
    <div className="flex flex-wrap gap-12 justify-center">
      <DemoItem label="Default" className="items-center">
        <Empty />
      </DemoItem>
      <DemoItem label="Custom description" className="items-center">
        <Empty description="No results matched your search." />
      </DemoItem>
      <DemoItem label="No image + action" className="items-center">
        <Empty image={null} description="Customize the empty state.">
          <Button size="sm">Create now</Button>
        </Empty>
      </DemoItem>
    </div>
  )
}
