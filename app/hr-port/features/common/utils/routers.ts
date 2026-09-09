import { ColumnFiltersState, SortingState } from "@tanstack/react-table"
import qs from "qs"

import { PER_PAGE_COUNT } from "~/hr-port/components/ui/data-table/constants"
import { env } from "~/hr-port/config/env"
import { PageParams } from "~/hr-port/features/common/data-access/types"
import { alphabeticalSort } from "~/hr-port/features/common/utils"

/**
 *
 * @see m https://reactrouter.com/upgrading/router-provider#1-move-route-definitions-into-route-modules
 *
 * Not only does route definition conform to the Route Module API,
 * but you also get the benefits of code-splitting routes
 *
 */
export const convertRouteModule = (m: any) => {
  const { clientLoader, clientAction, default: Component, ...rest } = m
  return {
    ...rest,
    loader: clientLoader,
    action: clientAction,
    Component,
  }
}

export const pathMap = {
  changePassword: () => env.APP_TA_URL,
  profile: () => "/profile",
  profileSettings: () => "/profile-settings",
  onboarding: () => "/onboarding",
  home: () => "/home",
  ta: () => env.APP_TA_URL || "",

  standardSettings: () => "/settings",
  standardSettingsCompany: () => "/settings/company",
  standardSettingsEmployment: () => "/settings/employment",
  emailSettings: () => "/settings/email",
  payslipSettings: () => "/settings/payslip",
  faqSettings: () => "/settings/faq",

  companyProfile: () => "/company-profile",
  employeeList: () => "/employee",
  employeeProfile: (id: string) => `/employee/${id}`,
  hr: () => "/hr",
  requestApprovals: () => "/hr/request-approvals",
  salaryMovementRequests: () => "/hr/request-approvals/salary-movement",
  employeeChangeProfileRequests: () =>
    "/hr/request-approvals/employee-change-profile",

  payroll: () => "/payroll",
  incomeList: () => "/payroll/income",
  deductionList: () => "/payroll/deduction",
  employmentType: () => "/payroll/employment-type",
  payrollPeriod: () => "/payroll/period",
  payrollCreatePeriod: () => "/payroll/period/create",

  // permission settings
  permissionSettings: () => "/permission-settings",

  payrollCalculation: (id: string) => `/payroll/calculation/${id}`,
  payrollCalculationEdited: (id: string) => `/payroll/calculation/${id}/edited`,
  payrollCalculationHistory: (id: string) =>
    `/payroll/calculation/${id}/history-calculation-log`,
  payrollCalculationHistoryImport: (id: string) =>
    `/payroll/calculation/${id}/history-import-log`,
  themeSettings: () => "/theme-settings",
  playground: () => "/playground",
  playgroundUploader: () => "/playground/uploader",
  notFound: () => "/not-found",
  authError: () => "/auth/error",
  authToken: () => "/auth/token",
  maintenance: () => "/maintenance",
  analyticReport: () => "/analytic-report",
  analyticReportElementUsage: () => "/analytic-report/element-usage",
  analyticReportAverageSalary: () => "/analytic-report/average-salary",
  analyticReportManualMapping: () => "/analytic-report/manual-mapping",
  analyticReportCategoryMangagement: () =>
    "/analytic-report/category-management",
} as const

export type PathMap = typeof pathMap
export type Pathname = keyof PathMap

export const getPath = <TRoute extends keyof PathMap>(
  route: TRoute,
  ...params: Parameters<PathMap[TRoute]>
) => {
  const pathCb: (...args: any[]) => string = pathMap[route]
  return pathCb(...params)
}

export const cleanParamsIfEqualDefaultConfigs = (
  params: Partial<PageParams>
) => {
  const { ...clonedParams } = params
  if (clonedParams.page && clonedParams.page <= 1) {
    delete clonedParams.page
  }
  if (clonedParams.size === PER_PAGE_COUNT) {
    delete clonedParams.size
  }
  if (clonedParams.search === "") {
    delete clonedParams.search
  }
  if (clonedParams.sort === "") {
    delete clonedParams.sort
  }

  return clonedParams
}

export const NON_FILTER_KEYS = ["page", "size", "search", "sort"]
export const parseFilterParams = (
  url?: string
): ColumnFiltersState | undefined => {
  if (!url) return undefined

  const queryParams = queryStringToParams(url)

  const filterParams = Object.entries(queryParams ?? {})
    .filter(([key]) => !NON_FILTER_KEYS.includes(key)) // Omit the keys of the other states
    .map(([id, value]) => {
      return { id, value }
    })

  return filterParams
}

export const isFilterKey = (key: string) => !NON_FILTER_KEYS.includes(key)

export const parseSortParams = (sortStr?: string): SortingState | undefined => {
  if (!sortStr) return undefined

  return sortStr.split(";").map((part) => {
    const [id, direction] = part.split(",")
    return { id, desc: direction === "desc" } satisfies SortingState[number]
  })
}

export const paramsToQueryString = (params: Partial<PageParams>) => {
  return qs.stringify(params, { sort: alphabeticalSort, arrayFormat: "repeat" })
}

export const queryStringToParams = (url?: string) => {
  if (!url) return undefined

  const rawParams = qs.parse(url, {
    duplicates: "combine",
    ignoreQueryPrefix: true,
  })

  const pageParam = Number(rawParams.page)
  const pageSizeParam = Number(rawParams.size)
  const searchParam = rawParams.search as string
  const sortParam = rawParams.sort as string

  const params = {
    ...rawParams,
    page: pageParam,
    size: pageSizeParam,
    search: searchParam,
    sort: sortParam,
  } satisfies Partial<PageParams>
  return params
}

export const publicRoutes = [
  getPath("authError"),
  getPath("authToken"),
  getPath("notFound"),
  getPath("playground"),
  getPath("playgroundUploader"),
]

export const systemAdminRoutes = [
  getPath("faqSettings"),
  getPath("analyticReport"),
  getPath("analyticReportAverageSalary"),
  getPath("analyticReportElementUsage"),
  getPath("analyticReportManualMapping"),
  getPath("analyticReportCategoryMangagement"),
]
