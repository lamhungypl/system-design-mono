"use client"

import { XCircle } from "lucide-react"
import { Link } from "react-router"
import { Button, buttonVariants } from "~/components/ui/button"

const reasons = [
  "Your account has been frozen — please contact support.",
  "Verification failed: account information does not match records.",
  "Daily transfer limit exceeded for this account type.",
]

export default function ResultFail() {
  return (
    <div className="p-6 max-w-xl mx-auto space-y-6 pt-12">
      <div className="text-center">
        <div className="flex items-center justify-center mb-4">
          <XCircle className="size-16 text-destructive" strokeWidth={1.5} />
        </div>
        <h1 className="text-2xl font-semibold">Submission Failed</h1>
        <p className="text-sm text-muted-foreground mt-2">
          Your submission could not be processed. Please review the errors below and try again.
        </p>
      </div>

      <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-5">
        <h2 className="font-semibold text-destructive mb-3 text-sm">Failure Reasons</h2>
        <ul className="space-y-2">
          {reasons.map((r, i) => (
            <li key={i} className="flex gap-2 text-sm text-destructive/80">
              <span className="text-destructive/50 mt-0.5">•</span>
              {r}
            </li>
          ))}
        </ul>
      </div>

      <div className="rounded-xl border bg-card p-5 text-sm space-y-2">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Payment Account</span>
          <span className="font-medium">ant-design@alipay.com</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Recipient Account</span>
          <span className="font-medium">test@example.com</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Amount</span>
          <span className="font-medium text-destructive">¥5,000.00</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Error Code</span>
          <span className="font-mono text-xs bg-muted px-2 py-0.5 rounded">ERR_TRANSFER_LIMIT</span>
        </div>
      </div>

      <div className="flex gap-3 justify-center">
        <Link to="/templates/form/step-form" className={buttonVariants()}>Retry</Link>
        <Link to="/templates/list/table-list" className={buttonVariants({ variant: "outline" })}>Back to List</Link>
        <Button variant="ghost">Contact Support</Button>
      </div>
    </div>
  )
}
