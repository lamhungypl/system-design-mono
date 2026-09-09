import { useEffect, useMemo } from "react"
import { FormProvider, useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"

import AppDialog from "~/hr-port/components/ui/app-dialog/app-dialog"
import { AppDialogOpenProps } from "~/hr-port/components/ui/app-dialog/types"
import {
  ControlType,
  PaymentMethods,
  Roles,
  TABLE_ANCESTOR_LAYOUT,
} from "~/hr-port/constants"
import { DynamicProvider } from "~/hr-port/features/dynamic-form/components/dynamic-provider"
import { Field, GridValues } from "~/hr-port/features/dynamic-form/types"
import { convertProfileDataToFormData } from "~/hr-port/features/dynamic-form/utils/convert-profile-data"
import { getDefaultValueForField } from "~/hr-port/features/dynamic-form/utils/field"
import { useEmployeeProfileQuery } from "~/hr-port/features/profiles/api/employee-profile/employee-profie.query"
import {
  invisibleIdPrefix,
  tempNullIdPrefix,
} from "~/hr-port/features/profiles/constants"
import FieldsInfoProvider from "~/hr-port/features/profiles/providers/FieldsInfoProvider"
import { CompanyProfileData } from "~/hr-port/features/profiles/types/profile-data"
import useSyncAppLoading from "~/hr-port/hooks/use-sync-app-loading"
import { isData } from "~/hr-port/utils/object"
import { cn } from "~/hr-port/utils/style"

import { useEmployeeChangeProfileRequestDetailsQuery } from "../../api/employee-change-profile-request-approvals.query"
import { EmployeeChangeProfileData } from "../../api/employee-change-profile-request-approvals.types"
import { newDataIdPrefix, oldDataIdPrefix } from "../../constant"
import useOpenedSection from "../../hooks/use-opened-section"
import SectionDetails from "./section-details"
import SectionTabs, { SectionTabProps } from "./section-tabs"

export type EmployeeChangeProfileCompareDialogProps = {
  id: string
} & AppDialogOpenProps

const placeholderData: CompanyProfileData = {
  entity_data: [],
  entity_data_id: 0,
}

export default function EmployeeChangeProfileCompareDialog(
  props: EmployeeChangeProfileCompareDialogProps
) {
  const { id, ...dialogProps } = props
  const { t } = useTranslation(undefined, {
    keyPrefix: "hr_request_approvals.employee_change_profile.compare_dialog",
  })
  const { t: _t } = useTranslation()

  const { data: requestDetails, isFetching: isRequestDetailsFetching } =
    useEmployeeChangeProfileRequestDetailsQuery(id)
  const {
    data: employeeProfileStructure,
    isFetching: isEmployeeProfileStructureFetching,
  } = useEmployeeProfileQuery()
  useSyncAppLoading({
    loading: isRequestDetailsFetching || isEmployeeProfileStructureFetching,
  })
  const { openSection } = useOpenedSection()

  const extractedFields = useMemo(() => {
    if (!isData(employeeProfileStructure)) return null
    return employeeProfileStructure.extracted_fields
  }, [employeeProfileStructure])

  const fieldMap = useMemo(() => {
    if (!isData(employeeProfileStructure)) return null
    return employeeProfileStructure.field_map
  }, [employeeProfileStructure])

  const oldNewData = useMemo(() => {
    if (!requestDetails || !fieldMap) return {}
    const { new_data, old_data } = requestDetails

    const getEmployeeData = (
      employeeInfo: EmployeeChangeProfileData["employee_info"]
    ) => {
      if (!employeeInfo) return null
      return convertProfileDataToFormData({
        data: employeeInfo.entity_data,
        fieldMap,
        options: {
          keepDeleteFlg: true,
        },
      })
    }

    const getSalaryInfo = (
      salaryData: EmployeeChangeProfileData["salary_info"]
    ) => {
      if (!salaryData) return null
      return {
        payment_method: salaryData?.payment_method ?? PaymentMethods.BANK,
        bank_account: salaryData?.bank_account_info?.key ?? null,
        bank_no: salaryData?.bank_no,
      }
    }

    const newEmployeeData = getEmployeeData(new_data.employee_info)
    const oldEmployeeData = getEmployeeData(old_data.employee_info)
    const newSalaryInfo = getSalaryInfo(new_data.salary_info)
    const oldSalaryInfo = getSalaryInfo(old_data.salary_info)

    extractedFields?.map((field) => {
      if (
        field.control_type === ControlType.GRID &&
        newEmployeeData?.[field.id] &&
        oldEmployeeData?.[field.id]
      ) {
        const newRows = newEmployeeData[field.id] as GridValues
        const oldRows = oldEmployeeData[field.id] as GridValues
        const addedRowsCount = newRows.filter((newRow) =>
          newRow.entity_data_id.includes(tempNullIdPrefix)
        ).length
        oldEmployeeData[field.id] = oldRows.concat(
          new Array(addedRowsCount).fill({
            entity_data_id: invisibleIdPrefix,
            field_value_id_map: {},
          })
        )
      }
    })

    return {
      newEmployeeData,
      oldEmployeeData,
      newSalaryInfo,
      oldSalaryInfo,
    }
  }, [requestDetails, fieldMap, extractedFields])

  const sectionTabs = useMemo(() => {
    if (!isData(employeeProfileStructure)) return []
    const { newEmployeeData, newSalaryInfo } = oldNewData
    const employeeProfileSections = employeeProfileStructure.section_infos
      .filter((section_info) => section_info.label !== "deduction_settings")
      .map((section_info) => {
        return {
          id: section_info.id,
          label: _t(
            `${employeeProfileStructure.label}.${section_info.label}.section_title`
          ),
        } satisfies SectionTabProps
      })
    const salaryInfoSection = {
      id: "salary_information",
      label: _t(`${employeeProfileStructure.label}.salary_information.title`),
    }

    const result: SectionTabProps[] = []
    if (newEmployeeData) result.push(...employeeProfileSections)
    if (newSalaryInfo) result.push(salaryInfoSection)
    return result
  }, [employeeProfileStructure, _t, oldNewData])

  const { visibleFieldMap, visibleSectionMap } = useMemo(() => {
    if (!isData(employeeProfileStructure)) return {}
    const { newEmployeeData, oldEmployeeData, newSalaryInfo, oldSalaryInfo } =
      oldNewData
    const visibleSectionMap: Record<string, boolean> = {}
    const visibleFieldMap: Record<string, boolean> = {}

    employeeProfileStructure.section_infos.forEach((section_info) => {
      let hasChangedField = false
      let hasChangedSubsection = false

      const checkHasChangedField = (fields: Field[]) => {
        let result = false
        fields.forEach((field) => {
          const { uneditable_roles } = field.extracted_attributes
          if (uneditable_roles?.includes(Roles.EMPLOYEE)) return
          const checkHasChangedValue = (field: Field) => {
            const id = field.id
            let newValue = newEmployeeData?.[id]
            let oldValue = oldEmployeeData?.[id]

            if (field.control_type === ControlType.ADDRESS_SECTION) {
              let hasChangedAddressSection = false
              field.grid_columns?.forEach((field) => {
                const hasChangedValue = checkHasChangedValue(field)
                visibleFieldMap[`${field.id}`] = hasChangedValue
                visibleFieldMap[`${oldDataIdPrefix}${field.id}`] =
                  hasChangedValue
                visibleFieldMap[`${newDataIdPrefix}${field.id}`] =
                  hasChangedValue
                hasChangedAddressSection =
                  hasChangedAddressSection || hasChangedValue
              })
              return hasChangedAddressSection
            } else if (field.control_type === ControlType.GRID) {
              newValue = (newValue ?? []) as GridValues
              oldValue = (oldValue ?? []) as GridValues
              if (newValue.length !== oldValue.length) return true
              for (let i = 0; i < newValue.length; i++) {
                const newItem = newValue[i]
                const oldItem = oldValue[i]

                for (const key in newItem) {
                  if (!["entity_data_id", "field_value_id_map"].includes(key)) {
                    if (newItem[key] !== oldItem?.[key]) return true
                  }
                }
              }
              return false
            } else {
              const defaultValue = getDefaultValueForField(field)
              newValue = newValue ?? defaultValue
              oldValue = oldValue ?? defaultValue
              return `${newValue}` !== `${oldValue}`
            }
          }
          const hasChangedValue = checkHasChangedValue(field)

          visibleFieldMap[`${field.id}`] = hasChangedValue
          visibleFieldMap[`${oldDataIdPrefix}${field.id}`] = hasChangedValue
          visibleFieldMap[`${newDataIdPrefix}${field.id}`] = hasChangedValue
          result = result || hasChangedValue
        })
        return result
      }

      hasChangedField = checkHasChangedField(section_info.fields)

      section_info.subsection_infos.forEach((subsection_info) => {
        const hasChangedField = checkHasChangedField(subsection_info.fields)

        visibleSectionMap[subsection_info.id] = hasChangedField
        hasChangedSubsection = hasChangedSubsection || hasChangedField
      })

      visibleSectionMap[section_info.id] =
        hasChangedField || hasChangedSubsection
    })

    if (
      newSalaryInfo &&
      (newSalaryInfo.bank_account !== oldSalaryInfo?.bank_account ||
        newSalaryInfo.bank_no !== oldSalaryInfo?.bank_no ||
        newSalaryInfo.payment_method !== oldSalaryInfo?.payment_method)
    ) {
      visibleSectionMap["salary_information"] = true
    }

    return { visibleFieldMap, visibleSectionMap }
  }, [employeeProfileStructure, oldNewData])

  useEffect(() => {
    if (sectionTabs.length && visibleSectionMap) {
      const firstVisibleSectionTab = sectionTabs.find(
        (tab) => visibleSectionMap[tab.id]
      )
      if (firstVisibleSectionTab) openSection(firstVisibleSectionTab.id)
    }
  }, [sectionTabs, openSection, visibleSectionMap])

  const initPayload = useMemo(() => {
    const { newEmployeeData, newSalaryInfo, oldEmployeeData, oldSalaryInfo } =
      oldNewData
    const addDataIdPrefix = (data: Record<string, any>, prefix: string) => {
      const result: Record<string, any> = {}
      Object.keys(data).forEach((key) => {
        result[`${prefix}${key}`] = data[key]
      })
      return result
    }
    let result: Record<string, any> = {}
    if (newEmployeeData) {
      result = {
        ...result,
        ...addDataIdPrefix(newEmployeeData ?? {}, newDataIdPrefix),
        ...addDataIdPrefix(oldEmployeeData ?? {}, oldDataIdPrefix),
      }
    }
    if (newSalaryInfo)
      result = {
        ...result,
        ...addDataIdPrefix(newSalaryInfo ?? {}, newDataIdPrefix),
        ...addDataIdPrefix(oldSalaryInfo ?? {}, oldDataIdPrefix),
      }

    console.log(result)
    return result
  }, [oldNewData])

  const methods = useForm({
    mode: "onBlur",
    values: initPayload ?? {},
  })

  return (
    <AppDialog
      title={t("title")}
      slotProps={{
        dialogContent: {
          className: cn(
            "h-[90%] w-[90%] !max-w-[1600px]",
            TABLE_ANCESTOR_LAYOUT
          ),
        },
        content: {
          className: cn("!pb-4"),
        },
      }}
      {...dialogProps}
    >
      {isData(employeeProfileStructure) && requestDetails && fieldMap && (
        <DynamicProvider value={{ type: "employee", data: placeholderData }}>
          <FieldsInfoProvider
            fieldMap={fieldMap}
            visibleFieldMap={visibleFieldMap}
            visibleSectionMap={visibleSectionMap}
          >
            <FormProvider {...methods}>
              <SectionTabs tabs={sectionTabs} />
              <div className="mt-3 text-xs font-bold text-[#f19100]">
                <span className="asterisk"></span>
                {t("guide")}
              </div>
              <div
                className="mt-4 grid flex-1 items-center gap-x-4"
                style={{
                  gridTemplateColumns: "150px 1fr 1fr",
                }}
              >
                <div></div>
                <div className="flex justify-center font-bold text-[#f19100]">
                  {t("original_data")}
                </div>
                <div className="flex justify-center font-bold text-[#f19100]">
                  {t("updated_data")}
                </div>
              </div>
              <div className="mt-6" />
              <SectionDetails
                i18n_key={employeeProfileStructure.label}
                section_infos={employeeProfileStructure.section_infos}
                oldSalaryInfo={oldNewData.oldSalaryInfo}
                newSalaryInfo={oldNewData.newSalaryInfo}
              />
            </FormProvider>
          </FieldsInfoProvider>
        </DynamicProvider>
      )}
    </AppDialog>
  )
}
