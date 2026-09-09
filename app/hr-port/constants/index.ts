import { SelectOption } from "~/hr-port/types/common"

export enum QueryKey {
  ACCESS_PAYROLL = "ACCESS_PAYROLL",
  ADDRESS = "ADDRESS",
  APPROVE_OR_REJECT_EMPLOYEE_CHANGE_PROFILE_REQUEST = "APPROVE_OR_REJECT_EMPLOYEE_CHANGE_PROFILE_REQUEST",
  BANK_CATEGORY = "BANK_CATEGORY",
  COMPANY_BRANCH = "COMPANY_BRANCH",
  COMPANY_CONFIG = "COMPANY_CONFIG",
  COMPANY_CONFIGURATION = "COMPANY_CONFIGURATION",
  COMPANY_PROFILE = "COMPANY_PROFILE",
  COMPANY_PROFILE_DATA = "COMPANY_PROFILE_DATA",
  EMPLOYEE_LIST = "EMPLOYEE_LIST",
  EMPLOYEE_PROFILE_DATA = "EMPLOYEE_PROFILE_DATA",
  EMPLOYEE_PROFILE_STRUCTURE = "EMPLOYEE_PROFILE_STRUCTURE",
  EMPLOYMENT_CONFIG = "EMPLOYMENT_CONFIG",
  EMPLOYMENT_FILTER_OPTION = "EMPLOYMENT_FILTER_OPTION",
  EMPLOYMENT_PROFILE = "EMPLOYMENT_PROFILE",
  LANGUAGES = "LANGUAGES",
  MASTER_CATEGORY = "MASTER_CATEGORY",
  MOCK = "MOCK",
  OPTIONS = "OPTIONS",
  PAYROLL_INFO = "PAYROLL_INFO",
  PERIOD_ADD = "PERIOD_ADD",
  PERIOD_EDIT = "PERIOD_EDIT",
  PERIOD_GENERATE = "PERIOD_GENERATE",
  PERIOD_LIST = "PERIOD_LIST",
  REGION_SETTING = "REGION_SETTING",
  REGIONS = "REGIONS",
  REPORT_INFO = "REPORT_INFO",
  REPORT_TO = "REPORT_TO",
  SALARY_INFO = "SALARY_INFO",
  SALARY_MOVEMENT = "SALARY_MOVEMENT",
  USER = "USER",
}

export const ALL_OPTION_VALUE = "All"

export enum DROPDOWN_LIST_TYPE {
  MULTIPLE_DROPDOWN_LIST = 2,
  SINGLE_DROPDOWN_LIST = 1,
}

export enum ControlType {
  ADDRESS_SECTION = "ADDRESS_SECTION",
  CALENDAR_PICKER = "CALENDAR_PICKER",
  CHECKBOXES = "CHECKBOXES",
  DROPDOWN_LIST = "DROPDOWN_LIST",
  FIELD_TEXT = "FIELD_TEXT",
  FILE_UPLOADER = "FILE_UPLOADER",
  GRID = "GRID",
  RADIO_BUTTONS = "RADIO_BUTTONS",
  SLIDERS = "SLIDERS",
  TOGGLE = "TOGGLE",
}

export enum DropdownListType {
  DROPDOWN_LIST_MULTIPLE = "DROPDOWN_LIST_MULTIPLE",
  DROPDOWN_LIST_SINGLE = "DROPDOWN_LIST_SINGLE",
}

export enum Status {
  ACTIVE = "ACTIVE",
  DISABLED = "DISABLED",
}

export const FIELD_NOT_IN_SUB_SECTION = "FIELD_NOT_IN_SUB_SECTION"

export const pageSizes = [25, 50, 75, 100]

export const pageSizeOptions: SelectOption[] = pageSizes.map((pageSize) => ({
  label: `${pageSize}`,
  value: `${pageSize}`,
}))

export enum AuthErrors {
  ACCESS_DENIED = "ACCESS_DENIED",
  TOKEN_INVALID = "TOKEN_INVALID",
  TOKEN_TIMEOUT = "TOKEN_TIMEOUT",
}

export enum AuthErrorMessages {
  ACCESS_DENIED = "common.error.access.denied.message",
  TA_API_CALL_FAILED = "error.ta_api.call_failed.message",
  TOKEN_INVALID = "error.token.invalid",
  TOKEN_TIMEOUT = "error.token.timeout",
}

export enum Roles {
  ACCOUNTANT = "ACCOUNTANT",
  COMPANY_ADMIN = "COMPANY_ADMIN",
  EMPLOYEE = "EMPLOYEE",
  SYSTEM_ADMIN = "SYSTEM_ADMIN",
}

export enum PaymentMethods {
  BANK = "BANK",
  CASH = "CASH",
}

export const PaymentMethodOptions = [
  { label: "payment.bank", value: PaymentMethods.BANK },
  { label: "payment.cash", value: PaymentMethods.CASH },
]

export enum MasterCategory {
  FREQUENCY_OF_PAYMENT = 4,
  INCOME_TYPE = 1,
  ROUNDING_TYPE = 3,
  TAX_CALCULATION_TYPE = 2,
}

export enum SalaryType {
  FULL_TIME = 1,
  PART_TIME = 2,
}

export enum RoundingType {
  MONEY_ADJUSTMENT_SOCIAL = "rounding_money_adjustment_social",
  NO_ADJUST = "NO_ADJUST",
  ROUND_DOWN = "DOWN",
  ROUND_UP = "UP",
}

export const RoundingMap = {
  rounding_round_up: RoundingType.ROUND_UP,
  rounding_round_down: RoundingType.ROUND_DOWN,
  rounding_money_adjustment_social: RoundingType.MONEY_ADJUSTMENT_SOCIAL,
  rounding_no_adjust: RoundingType.NO_ADJUST,
}

export type RoundingMapKey = keyof typeof RoundingMap

export enum TaxCalculationType {
  ALL_YEAR = "tax_calculation_all_year",
  NONE = "tax_calculation_none",
  ONE_TIME = "tax_calculation_one_time",
}

export enum CurrencyByRegion {
  ENG = "USD",
  JPY = "JPY",
  THB = "THB",
}

export enum LocalesByRegion {
  ENG = "en-GB",
  JPY = "ja-JP",
  THB = "th-TH",
}

export enum TimezoneByRegion {
  ENG = "UTC",
  JPY = "Asia/Tokyo",
  THB = "Asia/Bangkok",
}

export type RegionCode = string

export const RegionCodeToRegionCurrency: Record<RegionCode, string> = {
  JPN: "JPY",
  THA: "THB",
}

export const RegionCodeToRegionCurrencySymbol: Record<RegionCode, string> = {
  JPN: "¥",
  THA: "฿",
}

export const maskCurrency = "X,XXX.XX"

export enum PeriodType {
  MONTHLY = "MONTHLY",
  THREE_PERIOD = "THREE_PERIOD",
  TWO_PERIOD = "TWO_PERIOD",
  WEEKLY = "WEEKLY",
}

export enum PeriodRequestType {
  AT_SPECIFIC_DAY_OF_MONTH = "AT_SPECIFIC_DAY_OF_MONTH",
  AT_SPECIFIC_DAY_OF_NEXT_MONTH = "AT_SPECIFIC_DAY_OF_NEXT_MONTH",
  AT_SPECIFIC_DAY_OF_NEXT_WEEK = "AT_SPECIFIC_DAY_OF_NEXT_WEEK",
  AT_SPECIFIC_DAY_OF_WEEK = "AT_SPECIFIC_DAY_OF_WEEK",
  END_OF_MONTH = "END_OF_MONTH",
}

export const screens = {
  xs: 0,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536,
}

export enum EmitterEvent {
  EMPLOYEE_CHANGE_PROFILE_REQUEST_PROCESS = "EMPLOYEE_CHANGE_PROFILE_REQUEST_PROCESS",
  FCM_NOTIFICATION = "FCM_NOTIFICATION",
  SALARY_MOVEMENT_PROCESS = "SALARY_MOVEMENT_PROCESS",
}

export enum Language {
  EN = "en",
  JP = "jp",
  TH = "th",
}

export const defaultLanguage = Language.TH

export const languageOptions = [
  {
    value: Language.EN,
    label: "English",
  },
  {
    value: Language.TH,
    label: "Thai",
  },
  {
    value: Language.JP,
    label: "Japanese",
  },
]

export const EXPORT_TYPES = {
  CSV: "CSV",
  XLSX: "XLSX",
  PDF: "PDF",
} as const

export const TABLE_ANCESTOR_LAYOUT = "table-ancestor-layout"

export const SCROLL_BAR_WIDTH = 7

export enum THEME_VARIABLES {
  PRIMARY = "--primary",
  PRIMARY_LIGHT = "--primary-light",
}

export const EMPTY_ARRAY: any[] = []
