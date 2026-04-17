import { Input, Textarea, PasswordInput } from "~/components/ui/input"
import { DemoSection } from "~/components/ui/demo-block"

function SearchIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="7" cy="7" r="4.5" />
      <path d="M10.5 10.5l3 3" />
    </svg>
  )
}

export default function InputBasicDemo() {
  return (
    <div className="flex flex-col gap-5 max-w-sm">
      <DemoSection label="Sizes">
        <div className="flex flex-col gap-2">
          <Input size="small" placeholder="Small" />
          <Input placeholder="Default" />
          <Input size="large" placeholder="Large" />
        </div>
      </DemoSection>
      <DemoSection label="Decorators">
        <div className="flex flex-col gap-2">
          <Input prefix={<SearchIcon />} placeholder="With prefix icon" />
          <Input suffix="USD" placeholder="Amount" />
          <Input addonBefore="https://" addonAfter=".com" placeholder="domain" />
          <Input allowClear placeholder="Clearable input" />
        </div>
      </DemoSection>
      <DemoSection label="States">
        <div className="flex flex-col gap-2">
          <Input status="error" placeholder="Error state" />
          <Input status="warning" placeholder="Warning state" />
          <Input disabled placeholder="Disabled" />
        </div>
      </DemoSection>
      <DemoSection label="Password">
        <PasswordInput placeholder="Password" />
      </DemoSection>
      <DemoSection label="Textarea">
        <Textarea rows={3} placeholder="Multi-line textarea…" />
      </DemoSection>
    </div>
  )
}
