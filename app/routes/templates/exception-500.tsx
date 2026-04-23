import { Link } from "react-router"
import { Button, buttonVariants } from "~/components/ui/button"

export default function Exception500() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
      <div className="text-[120px] font-bold text-muted/40 leading-none select-none">500</div>
      <h1 className="text-2xl font-semibold mt-2">Internal Server Error</h1>
      <p className="text-muted-foreground mt-2 max-w-sm text-sm leading-relaxed">
        Sorry, something went wrong on our end. Our team has been notified and is working on a fix. Please try again later.
      </p>
      <div className="flex gap-3 mt-6">
        <Button variant="outline" onClick={() => window.location.reload()}>Retry</Button>
        <Link to="/templates/dashboard/analysis" className={buttonVariants()}>Back Home</Link>
      </div>
    </div>
  )
}
