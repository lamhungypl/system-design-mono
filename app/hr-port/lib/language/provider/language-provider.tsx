import React, { createContext, useCallback, useMemo } from "react"
import { useTranslation } from "react-i18next"

import { Language } from "~/hr-port/constants"

/**
 * Stubbed port of dynamic-web-app's src/lib/language/provider/language-provider.tsx.
 *
 * The original fetches translation bundles from the API, caches them in IndexedDB
 * (`idb`) and blocks rendering until the region setting resolves. Here every namespace
 * is bundled at build time by config/i18n.ts, so this provider only exposes the same
 * context shape — `useLanguage()` consumers (calendar, form-address-section,
 * app-guide-line) work unchanged.
 *
 * To un-stub: copy the original file back and add the `idb` dependency plus the
 * `#/api/language` + region-setting queries.
 */
interface LanguageContextType {
  changeLanguage: (lang: Language) => void
  isFetched: boolean
  language: Language
  loadLanguage: (newLang: string) => Promise<boolean>
  reloadLanguage: () => Promise<void>
}

export const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const { i18n } = useTranslation()

  const language = useMemo(() => i18n.language as Language, [i18n.language])

  const changeLanguage = useCallback(
    (newLang: Language) => {
      i18n.changeLanguage(newLang)
      localStorage.setItem("lang", newLang)
    },
    [i18n]
  )

  const loadLanguage = useCallback(async () => true, [])
  const reloadLanguage = useCallback(async () => {}, [])

  const contextValue = useMemo(
    () => ({
      changeLanguage,
      reloadLanguage,
      isFetched: true,
      language,
      loadLanguage,
    }),
    [changeLanguage, reloadLanguage, language, loadLanguage]
  )

  return (
    <LanguageContext.Provider value={contextValue}>
      {children}
    </LanguageContext.Provider>
  )
}
