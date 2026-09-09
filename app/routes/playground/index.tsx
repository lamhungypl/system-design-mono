import { Link } from "react-router"

import { Card } from "~/components/ui/card"

export default function PlaygroundIndex() {
  return (
    <div className="p-8">
      <h1 className="text-xl font-semibold">UI/UX Playground</h1>
      <p className="mt-1 mb-8 max-w-2xl text-sm text-muted-foreground">
        Screens ported from other apps so their layout and overlay behaviour can
        be exercised here. Everything under <code>app/hr-port/</code> is copied
        from <code>dynamic-web-app</code> — see{" "}
        <code>app/hr-port/PORT-NOTES.md</code>.
      </p>

      <div className="grid gap-4 sm:grid-cols-2">
        <Link to="/playground/table-modal-changes" className="block">
          <Card className="h-full p-5 transition-colors hover:bg-accent">
            <h2 className="text-base font-medium">Table + change modal</h2>
            <p className="mt-1.5 text-sm text-muted-foreground">
              HR request-approval tables with filters, row selection and bulk
              approve / reject, plus the side-by-side employee-data diff modal.
            </p>
          </Card>
        </Link>

        <Link to="/playground/master-child-review-changes" className="block">
          <Card className="h-full p-5 transition-colors hover:bg-accent">
            <h2 className="text-base font-medium">
              Master–child: &ldquo;View changes&rdquo;
            </h2>
            <p className="mt-1.5 text-sm text-muted-foreground">
              MathGPT&apos;s Review changes dialog rendered two ways off one
              fixture — the flat list that ships today, and the side-by-side
              <code> ITEM | CURRENT | NEW </code> diff table Figma specifies.
            </p>
          </Card>
        </Link>
      </div>
    </div>
  )
}
