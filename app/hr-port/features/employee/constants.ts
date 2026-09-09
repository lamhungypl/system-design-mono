import { FILE_FOLDER, FILE_LEVEL } from "~/hr-port/features/documents/constants"
import { EmployeeUploadDocsPayload } from "~/hr-port/features/employee/api/employee/employee.types"

export const employeeUploadDocumentConfig = {
  level: FILE_LEVEL.EMPLOYEE,
  folder: FILE_FOLDER.FILE,
} satisfies Partial<EmployeeUploadDocsPayload>

export enum TEMPLATE_EMPLOYEE_TYPE {
  BLANK = "BLANK",
  INCLUDE_EMPLOYEE_INFO = "INCLUDE_EMPLOYEE_INFO",
}

export const MAX_SIZE_IMPORT_FILE = 25 * 1024 * 1024

export enum IMPORT_TYPE {
  IMPORT_ALL = "IMPORT_ALL",
  ONLY_SALARY = "ONLY_SALARY",
}

export enum EXPORT_TYPE {
  ALL = "ALL",
  AS_FILTER = "AS_FILTER",
}
