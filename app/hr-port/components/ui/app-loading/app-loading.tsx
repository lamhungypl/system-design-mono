import { useTranslation } from "react-i18next"

import ImageUrl from "~/hr-port/assets/gifs/app-loading.gif"
import { Dialog, DialogPortal } from "~/hr-port/components/base/dialog"
import { NON_BREAKING_SPACE } from "~/hr-port/features/common/constants"
import useAppLoading from "~/hr-port/stores/use-app-loading"
import { cn } from "~/hr-port/utils/style"

export default function AppLoading() {
  const { isAppLoading, isPendingSync } = useAppLoading()
  const { t } = useTranslation()

  return (
    <Dialog open={isAppLoading}>
      <DialogPortal>
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

            <span
              className={cn(
                "px-4 text-center text-sm font-medium text-primary",
                {
                  //NOTE: use visibility to avoid layout shift
                  invisible: !isPendingSync,
                  visible: isPendingSync,
                }
              )}
            >
              {isPendingSync
                ? t("common.synchronizing_data")
                : NON_BREAKING_SPACE}
            </span>
          </div>
        </div>
      </DialogPortal>
    </Dialog>
  )
}
