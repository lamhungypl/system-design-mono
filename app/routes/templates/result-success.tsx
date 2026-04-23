"use client"

import { CheckCircle, Clock } from "lucide-react"
import { Link } from "react-router"
import { Button, buttonVariants } from "~/components/ui/button"

const details = [
  { label: "Project Name", value: "Alipay" },
  { label: "Project ID", value: "2000000000" },
  { label: "Principal", value: "付小小" },
  { label: "Effective Date", value: "2024-01-01 ~ 2025-01-01" },
]

const approvals = [
  { role: "Submitter", name: "付小小", time: "2024-01-15 09:30", done: true },
  { role: "Executive Director", name: "曲丽丽", time: "2024-01-15 10:00", done: true },
  { role: "Finance", name: "林东东", time: "2024-01-15 11:00", done: true },
]

export default function ResultSuccess() {
  return (
    <div className="p-6 max-w-2xl mx-auto space-y-6 pt-12">
      <div className="text-center">
        <div className="flex items-center justify-center mb-4">
          <CheckCircle className="size-16 text-green-500" strokeWidth={1.5} />
        </div>
        <h1 className="text-2xl font-semibold">Submission Successful</h1>
        <p className="text-sm text-muted-foreground mt-2 max-w-md mx-auto">
          Your project has been submitted for review. The review process typically takes 1–3 business days.
          You will be notified of the result via email.
        </p>
        <div className="flex gap-3 justify-center mt-6">
          <Link to="/templates/list/table-list" className={buttonVariants({ variant: "outline" })}>Back to List</Link>
          <Button>View Project</Button>
          <Button variant="outline">Print</Button>
        </div>
      </div>

      <div className="rounded-xl border bg-card p-5">
        <h2 className="font-semibold mb-4">Project Information</h2>
        <div className="grid grid-cols-2 gap-4">
          {details.map((d) => (
            <div key={d.label} className="text-sm">
              <div className="text-muted-foreground text-xs mb-0.5">{d.label}</div>
              <div className="font-medium">{d.value}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-xl border bg-card p-5">
        <h2 className="font-semibold mb-4">Approval Timeline</h2>
        <div className="space-y-0">
          {approvals.map((a, i) => (
            <div key={i} className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className={`size-8 rounded-full flex items-center justify-center shrink-0 text-xs font-semibold ${a.done ? "bg-primary text-primary-foreground" : "border-2 border-muted text-muted-foreground"}`}>
                  {i + 1}
                </div>
                {i < approvals.length - 1 && <div className="w-0.5 h-10 bg-muted mt-1" />}
              </div>
              <div className="pb-8">
                <div className="text-sm font-medium">{a.role}</div>
                <div className="text-xs text-muted-foreground mt-0.5">{a.name}</div>
                <div className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                  <Clock className="size-3" /> {a.time}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
