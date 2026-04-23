import { Link } from "react-router"
import { buttonVariants } from "~/components/ui/button"

export default function Exception403() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
      <div className="text-[120px] font-bold text-muted/40 leading-none select-none">403</div>
      <h1 className="text-2xl font-semibold mt-2">Access Denied</h1>
      <p className="text-muted-foreground mt-2 max-w-sm text-sm leading-relaxed">
        Sorry, you don't have permission to access this page. Please contact your administrator if you believe this is an error.
      </p>
      <Link to="/templates/dashboard/analysis" className={buttonVariants() + " mt-6"}>Back Home</Link>
    </div>
  )
}
