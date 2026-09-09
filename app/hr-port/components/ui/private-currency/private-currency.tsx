import React, { PropsWithChildren, useContext, useMemo, useState } from "react"

import { maskCurrency } from "~/hr-port/constants"

interface PrivateCurrencyContextProps {
  isShowCurrency: boolean
  setIsShowCurrency: (value: boolean) => void
}

const PrivateCurrencyContext = React.createContext<
  PrivateCurrencyContextProps | undefined
>(undefined)

export const PrivateCurrencyProvider = ({ children }: PropsWithChildren) => {
  const [isShowCurrency, setIsShowCurrency] = useState(false)

  const contextValue = useMemo(() => {
    return {
      isShowCurrency,
      setIsShowCurrency,
    }
  }, [isShowCurrency, setIsShowCurrency])

  return (
    <PrivateCurrencyContext.Provider value={contextValue}>
      {children}
    </PrivateCurrencyContext.Provider>
  )
}

export const usePrivateCurrencyContext = () => {
  const context = useContext(PrivateCurrencyContext)
  if (!context) {
    throw new Error(
      "usePrivateCurrencyContext must be used within a CurrencyProvider"
    )
  }
  return context
}

const PrivateCurrency = ({ children }: PropsWithChildren) => {
  const { isShowCurrency } = usePrivateCurrencyContext()

  return <>{isShowCurrency ? children : maskCurrency}</>
}

export default PrivateCurrency
