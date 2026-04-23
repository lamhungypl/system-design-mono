import { Link } from "react-router"
import { buttonVariants } from "~/components/ui/button"

export default function Exception404() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
      <div className="text-[120px] font-bold text-muted/40 leading-none select-none">404</div>
      <h1 className="text-2xl font-semibold mt-2">Page Not Found</h1>
      <p className="text-muted-foreground mt-2 max-w-sm text-sm leading-relaxed">
        Sorry, the page you visited does not exist. It may have been moved, deleted, or the URL may be incorrect.
      </p>
      <Link to="/templates/dashboard/analysis" className={buttonVariants() + " mt-6"}>Back Home</Link>
    </div>
  )
}
