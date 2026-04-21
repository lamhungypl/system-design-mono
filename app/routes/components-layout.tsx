"use client"

import { useState } from "react"
import { Outlet } from "react-router"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { BackToTop } from "~/components/layout/back-to-top"
import { SidebarLayout } from "~/components/layout/sidebar-layout"
import { nav } from "~/lib/nav"

export default function ComponentsLayout() {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 30_000,
            refetchOnWindowFocus: false,
            retry: false,
          },
        },
      }),
  )

  return (
    <QueryClientProvider client={queryClient}>
      <SidebarLayout
        sections={nav}
        header={
          <span className="text-sm font-semibold tracking-tight">
            System Design
          </span>
        }
      >
        <Outlet />
        <BackToTop />
      </SidebarLayout>
    </QueryClientProvider>
  )
}
