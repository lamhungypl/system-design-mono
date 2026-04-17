import { Breadcrumb } from "~/components/ui/breadcrumb"
import { DemoSection } from "~/components/ui/demo-block"

export default function BreadcrumbBasicDemo() {
  return (
    <div className="flex flex-col gap-5">
      <DemoSection label="Default">
        <Breadcrumb
          items={[
            { title: "Home", href: "/" },
            { title: "Components", href: "/components" },
            { title: "Breadcrumb" },
          ]}
        />
      </DemoSection>

      <DemoSection label="Custom separator">
        <Breadcrumb
          separator="/"
          items={[
            { title: "Dashboard", href: "#" },
            { title: "System Design", href: "#" },
            { title: "Navigation" },
            { title: "Breadcrumb" },
          ]}
        />
      </DemoSection>

      <DemoSection label="With context">
        <Breadcrumb
          items={[
            { title: "Projects", href: "#" },
            { title: "Apollo v2", href: "#" },
            { title: "Settings" },
          ]}
        />
      </DemoSection>
    </div>
  )
}
