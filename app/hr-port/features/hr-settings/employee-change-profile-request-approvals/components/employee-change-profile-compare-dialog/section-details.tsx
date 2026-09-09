import { cloneDeep } from "lodash"
import { useMemo } from "react"
import { useTranslation } from "react-i18next"
import { ScrollSync, ScrollSyncPane } from "react-scroll-sync"

import Untouchable from "~/hr-port/components/ui/untouchable/Untouchable"
import { ControlType } from "~/hr-port/constants"
import FormDynamicField from "~/hr-port/features/profiles/components/form-dynamic-field/form-dynamic-field"
import { useFieldsInfo } from "~/hr-port/features/profiles/providers/FieldsInfoProvider"
import SectionSumProvider from "~/hr-port/features/profiles/providers/SectionSumProvider"
import {
  SectionInfo,
  SubSectionInfo,
} from "~/hr-port/features/profiles/types/profile-structure"
import { cn } from "~/hr-port/utils/style"

import { newDataIdPrefix, oldDataIdPrefix } from "../../constant"
import useOpenedSection from "../../hooks/use-opened-section"
import SalaryInformationSection from "./salary-information-section"

export type SalaryInfo = {
  bank_account: string | null
  bank_no: string | null
  payment_method: string
}

export type SectionDetailsProps = {
  i18n_key: string
  newSalaryInfo?: SalaryInfo | null
  oldSalaryInfo?: SalaryInfo | null
  section_infos: SectionInfo[]
}

export default function SectionDetails({
  i18n_key,
  section_infos,
  newSalaryInfo,
  oldSalaryInfo,
}: SectionDetailsProps) {
  const { openedSectionId } = useOpenedSection()

  const sectionInfos = useMemo(() => {
    const result = cloneDeep(section_infos)
    result.forEach((section) => {
      section.label = `${i18n_key}.${section.label}`
      section.subsection_infos.forEach((subsection) => {
        subsection.label = `${section.label}.${subsection.label}`
      })
    })
    return result
  }, [section_infos, i18n_key])

  const sectionDetails = useMemo(() => {
    return sectionInfos.find(
      (section) => section.id.toString() === openedSectionId
    )
  }, [openedSectionId, sectionInfos])

  return (
    <>
      {!!sectionDetails && (
        <>
          {sectionDetails.fields.length > 0 && (
            <SubsectionDetails {...sectionDetails} showSectionLabel={false} />
          )}
          <div className="flex flex-col gap-y-8">
            {sectionDetails.subsection_infos.length > 0 &&
              sectionDetails.subsection_infos.map((subsection) => (
                // PORT: the source omits `key` here, which React 19 warns about.
                <SubsectionDetails key={subsection.id} {...subsection} />
              ))}
          </div>
        </>
      )}
      {openedSectionId === "salary_information" && (
        <SalaryInformationSection
          newSalaryInfo={newSalaryInfo}
          oldSalaryInfo={oldSalaryInfo}
        />
      )}
    </>
  )
}

const SubsectionDetails = ({
  showSectionLabel = true,
  fields,
  label: i18n_key,
  ...props
}: { showSectionLabel?: boolean } & SubSectionInfo) => {
  const { t } = useTranslation()
  const { visibleFieldMap, visibleSectionMap } = useFieldsInfo()

  if (visibleSectionMap?.[props.id] === false) return null

  return (
    <div className="flex flex-col gap-y-4">
      <SectionSumProvider>
        {showSectionLabel && (
          <div className="text-sm font-bold text-[#f19100]">
            {t(`${i18n_key}.section_title`)}
          </div>
        )}
        <div className="flex flex-col gap-y-2">
          {fields.map((field) => {
            if (visibleFieldMap?.[field.id] === false) return null
            const isGrid = field.control_type === ControlType.GRID
            const isAddressSection =
              field.control_type === ControlType.ADDRESS_SECTION

            if (isAddressSection)
              return (
                <div
                  key={field.id}
                  className="grid gap-x-4"
                  style={{
                    gridTemplateColumns: "150px 1fr 1fr",
                  }}
                >
                  <Untouchable
                    className="col-span-2 grid items-center gap-x-4 gap-y-2"
                    style={{
                      gridTemplateColumns: "150px 1fr",
                    }}
                  >
                    <FormDynamicField
                      {...field}
                      label={field.label}
                      ignoreRules
                      namePrefix={oldDataIdPrefix}
                      compareMode
                      formFieldProps={{ className: "border-action-red" }}
                    />
                  </Untouchable>
                  <Untouchable className="flex flex-col gap-y-2">
                    <FormDynamicField
                      {...field}
                      label=""
                      ignoreRules
                      namePrefix={newDataIdPrefix}
                      formFieldProps={{ className: "border-action-green" }}
                    />
                  </Untouchable>
                </div>
              )
            return (
              <ScrollSync key={field.id}>
                <div
                  key={field.id}
                  className="grid items-stretch gap-x-4"
                  style={{
                    gridTemplateColumns: "150px 1fr 1fr ",
                  }}
                >
                  <div
                    className={cn("text-xs break-words", {
                      "flex items-center": !isGrid,
                    })}
                  >
                    {t(`${i18n_key}.${field.label}`)}
                  </div>

                  {!isGrid && (
                    <>
                      <Untouchable>
                        <FormDynamicField
                          {...field}
                          label=""
                          ignoreRules
                          namePrefix={oldDataIdPrefix}
                          compareMode
                          formFieldProps={{ className: "border-action-red" }}
                        />
                      </Untouchable>
                      <Untouchable>
                        <FormDynamicField
                          {...field}
                          label=""
                          ignoreRules
                          namePrefix={newDataIdPrefix}
                          compareMode
                          formFieldProps={{ className: "border-action-green" }}
                        />
                      </Untouchable>
                    </>
                  )}

                  {isGrid && (
                    <>
                      <ScrollSyncPane>
                        <div className="overflow-auto rounded-sm border border-action-red">
                          <FormDynamicField
                            {...field}
                            label={field.label}
                            viewOnly
                            ignoreRules
                            namePrefix={oldDataIdPrefix}
                            compareMode
                          />
                        </div>
                      </ScrollSyncPane>
                      <ScrollSyncPane>
                        <div className="overflow-auto rounded-sm border border-action-green">
                          <FormDynamicField
                            {...field}
                            label={field.label}
                            viewOnly
                            ignoreRules
                            namePrefix={newDataIdPrefix}
                            compareMode
                          />
                        </div>
                      </ScrollSyncPane>
                    </>
                  )}
                </div>
              </ScrollSync>
            )
          })}
        </div>
      </SectionSumProvider>
    </div>
  )
}
