"use client"

import { CollapsibleHeading } from "~/components/ui/collapsible-heading"
import { Separator } from "~/components/ui/separator"

export default function CollapsibleDemo() {
  return (
    <div className="p-8">
      <h1 className="text-xl font-semibold">Collapsible Headings</h1>
      <p className="mt-1 mb-8 text-sm text-muted-foreground">
        Click any heading to expand or collapse its content.
      </p>

      <div className="max-w-2xl space-y-8">

        {/* All levels flat */}
        <section>
          <p className="mb-4 text-xs font-medium uppercase tracking-wider text-muted-foreground">All levels</p>
          <div className="space-y-4">
            <CollapsibleHeading level={1} title="Heading 1">
              <p className="text-sm text-muted-foreground leading-relaxed">
                This is the content under a first-level heading. It can contain any arbitrary content — paragraphs, lists, or nested sections.
              </p>
            </CollapsibleHeading>

            <CollapsibleHeading level={2} title="Heading 2">
              <p className="text-sm text-muted-foreground leading-relaxed">
                Second-level headings are typically used for major sections within a page or document.
              </p>
            </CollapsibleHeading>

            <CollapsibleHeading level={3} title="Heading 3">
              <p className="text-sm text-muted-foreground leading-relaxed">
                Third-level headings break a section down into more specific topics.
              </p>
            </CollapsibleHeading>

            <CollapsibleHeading level={4} title="Heading 4">
              <p className="text-sm text-muted-foreground leading-relaxed">
                Fourth-level headings are used for fine-grained sub-topics or metadata labels.
              </p>
            </CollapsibleHeading>
          </div>
        </section>

        <Separator />

        {/* Nested hierarchy */}
        <section>
          <p className="mb-4 text-xs font-medium uppercase tracking-wider text-muted-foreground">Nested hierarchy</p>

          <CollapsibleHeading level={1} title="System Design Fundamentals">
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">
              A collection of concepts and patterns for designing scalable systems.
            </p>

            <div className="pl-4 border-l border-border space-y-4">
              <CollapsibleHeading level={2} title="Scalability">
                <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                  The ability of a system to handle increased load by adding resources.
                </p>

                <div className="pl-4 border-l border-border space-y-3">
                  <CollapsibleHeading level={3} title="Horizontal scaling">
                    <p className="text-sm text-muted-foreground leading-relaxed mb-2">
                      Adding more machines to distribute the load across multiple nodes.
                    </p>
                    <div className="pl-4 border-l border-border">
                      <CollapsibleHeading level={4} title="Load balancing strategies" defaultOpen={false}>
                        <ul className="mt-1 space-y-1 text-sm text-muted-foreground list-disc list-inside">
                          <li>Round-robin</li>
                          <li>Least connections</li>
                          <li>IP hash</li>
                          <li>Weighted round-robin</li>
                        </ul>
                      </CollapsibleHeading>
                    </div>
                  </CollapsibleHeading>

                  <CollapsibleHeading level={3} title="Vertical scaling" defaultOpen={false}>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Upgrading the hardware of existing machines — more CPU, RAM, or storage.
                    </p>
                  </CollapsibleHeading>
                </div>
              </CollapsibleHeading>

              <CollapsibleHeading level={2} title="Reliability" defaultOpen={false}>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  The probability that a system performs its intended function without failure over a given period.
                </p>
              </CollapsibleHeading>

              <CollapsibleHeading level={2} title="Availability" defaultOpen={false}>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  The percentage of time a system is operational and accessible, often expressed as nines (99.9%, 99.99%).
                </p>
              </CollapsibleHeading>
            </div>
          </CollapsibleHeading>
        </section>

      </div>
    </div>
  )
}
