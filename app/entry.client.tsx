import { startTransition, StrictMode } from "react"
import { hydrateRoot } from "react-dom/client"
import { HydratedRouter } from "react-router/dom"

/**
 * MSW powers every request made by app/hr-port/** (copied from dynamic-web-app).
 * Starting it from the client entry is the approach recommended for react-router v7:
 * https://github.com/remix-run/react-router/discussions/12651
 */
async function enableApiMocking() {
  if (!import.meta.env.DEV) return
  if (import.meta.env.VITE_APP_ENABLE_API_MOCKING !== "true") return

  const { worker } = await import("~/hr-port/lib/mocks/browser")
  return worker.start({
    // "warn" rather than "bypass": an endpoint the copied code calls but the mocks
    // do not cover would otherwise hang silently (the request escapes to a host that
    // does not exist) instead of saying so in the console.
    onUnhandledRequest: "warn",
    quiet: false,
  })
}

enableApiMocking().then(() => {
  startTransition(() => {
    hydrateRoot(
      document,
      <StrictMode>
        <HydratedRouter />
      </StrictMode>
    )
  })
})
