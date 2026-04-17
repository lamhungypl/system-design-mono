import { Title, Text, Paragraph, Link } from "~/components/ui/typography"
import { DemoSection } from "~/components/ui/demo-block"

export default function TypographyBasicDemo() {
  return (
    <div className="flex flex-col gap-6 max-w-lg">
      <DemoSection label="Headings">
        <div className="flex flex-col gap-2">
          <Title level={1}>H1 — Page title</Title>
          <Title level={2}>H2 — Section heading</Title>
          <Title level={3}>H3 — Sub-section</Title>
          <Title level={4}>H4 — Card title</Title>
          <Title level={5}>H5 — Small heading</Title>
        </div>
      </DemoSection>

      <DemoSection label="Text variants">
        <div className="flex flex-wrap gap-3 items-baseline">
          <Text>Default</Text>
          <Text type="secondary">Secondary</Text>
          <Text type="success">Success</Text>
          <Text type="warning">Warning</Text>
          <Text type="danger">Danger</Text>
          <Text strong>Strong</Text>
          <Text italic>Italic</Text>
          <Text underline>Underline</Text>
          <Text delete>Deleted</Text>
          <Text code>const x = 1</Text>
          <Text keyboard>Ctrl + K</Text>
          <Text mark>Highlighted</Text>
        </div>
      </DemoSection>

      <DemoSection label="Paragraph">
        <div className="flex flex-col gap-3">
          <Paragraph>
            System design is the process of defining the architecture, components, modules, interfaces, and data flow of a system to satisfy specified requirements.
          </Paragraph>
          <Paragraph ellipsis={{ rows: 2 }}>
            This is a very long paragraph that will be truncated after two lines. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </Paragraph>
        </div>
      </DemoSection>

      <DemoSection label="Link">
        <div className="flex gap-3">
          <Link href="#">Link</Link>
          <Link href="#" type="secondary">Secondary link</Link>
          <Link href="#" disabled>Disabled link</Link>
        </div>
      </DemoSection>
    </div>
  )
}
