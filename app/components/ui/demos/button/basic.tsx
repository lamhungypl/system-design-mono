import { Button } from "~/components/ui/button"
import { DemoSection } from "~/components/ui/demo-block"

function LoadingIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="animate-spin">
      <circle cx="8" cy="8" r="5.5" strokeOpacity={0.2} />
      <path d="M8 2.5a5.5 5.5 0 015.5 5.5" />
    </svg>
  )
}

export default function ButtonBasicDemo() {
  return (
    <div className="flex flex-col gap-6">
      <DemoSection label="Variants">
        <div className="flex flex-wrap items-center gap-2">
          <Button>Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="destructive">Destructive</Button>
          <Button variant="link">Link</Button>
        </div>
      </DemoSection>
      <DemoSection label="Sizes">
        <div className="flex flex-wrap items-center gap-2">
          <Button size="xs">XSmall</Button>
          <Button size="sm">Small</Button>
          <Button>Default</Button>
          <Button size="lg">Large</Button>
        </div>
      </DemoSection>
      <DemoSection label="States">
        <div className="flex flex-wrap items-center gap-2">
          <Button disabled>Disabled</Button>
          <Button>
            <LoadingIcon />
            Loading
          </Button>
        </div>
      </DemoSection>
    </div>
  )
}
