import { FILE_FOLDER, FILE_LEVEL } from "~/hr-port/features/documents/constants"
import { CompanyUploadDocsPayload } from "~/hr-port/features/profiles/api/company-profile/company-profile.types"

export const companyUploadDocumentConfig = {
  level: FILE_LEVEL.COMPANY,
  folder: FILE_FOLDER.FILE,
} satisfies Partial<CompanyUploadDocsPayload>

const extractFilename = (str: string) => {
  const regex = new RegExp("images/profile/([^/]+)$")
  const match = str.match(regex)
  if (match && match[1]) {
    return match[1]
  }
  return ""
}

export type StaticProfilePicture = {
  filename: string
  importPath: string
}

export const defaultProfilePictures = Object.entries(
  // PORT: import.meta.glob only accepts relative or absolute patterns, never an
  // alias, so the source's '#/assets/…' glob became a relative one.
  import.meta.glob("../../assets/images/profile/*.{png,jpg,jpeg}", {
    eager: true,
  })
).map(([path, module]) => {
  const url = new URL(
    (module as unknown as { default: string }).default,
    import.meta.url
  )
  return {
    importPath: url.href,
    filename: extractFilename(path),
  } satisfies StaticProfilePicture
})

export const change_request_id_param = "change-request-id"

export const tempNullIdPrefix = "null-"

export const invisibleIdPrefix = "invisible-"

export const employee_profile_form_id = "employee_profile_form_id"

export const email_apply_language_field_label = "email_apply_language"

export const form_salary_info_id = "form_salary_info_id"
