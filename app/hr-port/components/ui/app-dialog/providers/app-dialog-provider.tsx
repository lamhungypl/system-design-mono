import { createContext, PropsWithChildren, useMemo, useState } from "react"

interface AppDialogContextType {
  customOnClose?: (() => void) | null
  setCustomOnClose: (fn: () => void) => void
}

export const AppDialogContext = createContext<AppDialogContextType | undefined>(
  undefined
)

export function AppDialogProvider({ children }: PropsWithChildren) {
  const [customOnClose, setCustomOnClose] = useState<(() => void) | null>(null)

  const contextValue = useMemo(() => {
    return {
      customOnClose,
      setCustomOnClose,
    }
  }, [customOnClose, setCustomOnClose])

  return (
    <AppDialogContext.Provider value={contextValue}>
      {children}
    </AppDialogContext.Provider>
  )
}
