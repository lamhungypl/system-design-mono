import i18n from "i18next"
import { initReactI18next } from "react-i18next"

import { defaultLanguage, Language } from "~/hr-port/constants"

/**
 * Adapted from dynamic-web-app's src/config/i18n.ts.
 *
 * The original loads only `common` at init and fetches every other namespace from the
 * API via LanguageProvider. There is no API here, so all local locale files are loaded
 * eagerly instead. The resource shape matches the source's
 * (`translation.<namespace>.<key…>`), so `t('hr_request_approvals.…')` in the copied
 * components resolves unchanged.
 */
const modules = import.meta.glob("../locales/**/*.json", {
  eager: true,
}) as Record<string, { default: Record<string, unknown> }>

const resources: Record<string, { translation: Record<string, unknown> }> = {}

for (const filePath in modules) {
  const match = filePath.match(/\.\.\/locales\/([a-z]{2})\/(.+)\.json$/)
  if (!match) {
    console.error(`Invalid translation file: ${filePath}`)
    continue
  }
  const [, lang, namespace] = match
  resources[lang] ??= { translation: {} }
  resources[lang].translation[namespace] = modules[filePath].default
}

const storedLanguage =
  typeof localStorage === "undefined" ? null : localStorage.getItem("lang")

i18n.use(initReactI18next).init({
  lng: storedLanguage || defaultLanguage,
  fallbackLng: Language.EN,
  resources,
  interpolation: {
    escapeValue: false, // React already escapes
  },
})

export default i18n
