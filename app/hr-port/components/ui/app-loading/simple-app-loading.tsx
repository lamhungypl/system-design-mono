import ImageUrl from "~/hr-port/assets/gifs/app-loading.gif"
import { cn } from "~/hr-port/utils/style"

export default function SimpleAppLoading() {
  return (
    <div
      className={cn(
        "pointer-events-auto fixed inset-0 z-[100] flex items-center justify-center backdrop-blur-sm"
      )}
      style={{
        transition: "all 0.15s ease-out",
      }}
    >
      <div className="flex flex-col items-center gap-2">
        <img className="h-10" src={ImageUrl} />
      </div>
    </div>
  )
}
