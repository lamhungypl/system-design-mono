import { createSafeContext } from "~/hr-port/features/common/utils/context"
import {
  CompanyProfileData,
  EmployeeProfileData,
} from "~/hr-port/features/profiles/types/profile-data"

export type DynamicContextValue = {
  data?: EmployeeProfileData | CompanyProfileData
  type: "employee" | "company"
}

export const [DynamicProvider, useDynamicContext] =
  createSafeContext<DynamicContextValue>("Dynamic Context not found")
