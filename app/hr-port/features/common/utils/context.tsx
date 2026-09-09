import { createContext, useContext } from "react"

export const createSafeContext = <ContextValue,>(errorMessage: string) => {
  const Context = createContext<ContextValue | null>(null)

  const useSafeContext = () => {
    const ctx = useContext(Context)

    if (ctx === null) {
      throw new Error(errorMessage)
    }

    return ctx
  }

  const Provider = ({
    children,
    value,
  }: {
    children: React.ReactNode
    value: ContextValue
  }) => <Context.Provider value={value}>{children}</Context.Provider>

  return [Provider, useSafeContext] as const
}
