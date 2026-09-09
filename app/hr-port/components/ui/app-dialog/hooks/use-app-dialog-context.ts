import { useContext } from "react"

import { AppDialogContext } from "../providers/app-dialog-provider"

export function useAppDialogContext() {
  const context = useContext(AppDialogContext)

  if (context === undefined) {
    throw new Error(
      "useAppDialogContext must be used within an AppDialogProvider"
    )
  }

  return context
}
