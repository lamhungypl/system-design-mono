import { QueryClientProvider } from "@tanstack/react-query"
import { configResponsive } from "ahooks"
import { Suspense } from "react"
import { I18nextProvider } from "react-i18next"
import { Outlet } from "react-router"

import { SidebarLayout } from "~/components/layout/sidebar-layout"
import { Toaster } from "~/hr-port/components/base/toaster"
import { TooltipProvider } from "~/hr-port/components/base/tooltip"
import AppDialogBaseContainer from "~/hr-port/components/ui/app-dialog/app-dialog-base-container"
import AppLoading from "~/hr-port/components/ui/app-loading/app-loading"
import i18n from "~/hr-port/config/i18n"
import { screens } from "~/hr-port/constants"
import { queryClient } from "~/hr-port/features/common/data-access/query-client"
import { LanguageProvider } from "~/hr-port/lib/language/provider/language-provider"
import { playgroundNav } from "~/lib/playground-nav"

// dynamic-web-app does this in src/main.tsx; ahooks' useResponsive (behind
// useGetDevice) needs the breakpoints registered before any component reads them.
configResponsive(screens)

/**
 * Providers the copied tree expects, mirroring dynamic-web-app's src/app/provider.tsx
 * minus firebase messaging, analytics, prefetching, theming and the document title.
 */
export default function PlaygroundLayout() {
  return (
    <I18nextProvider i18n={i18n}>
      <QueryClientProvider client={queryClient}>
        <Suspense fallback={null}>
          <LanguageProvider>
            <TooltipProvider delayDuration={200}>
              <SidebarLayout
                sections={playgroundNav}
                header={
                  <span className="text-sm font-semibold tracking-tight">
                    UI/UX Playground
                  </span>
                }
              >
                <Outlet />
              </SidebarLayout>
              <AppDialogBaseContainer />
              <AppLoading />
              <Toaster />
            </TooltipProvider>
          </LanguageProvider>
        </Suspense>
      </QueryClientProvider>
    </I18nextProvider>
  )
}
