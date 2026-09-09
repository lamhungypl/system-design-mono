import { Field, FieldMap } from "~/hr-port/features/dynamic-form/types"
import { EmployeeProfileData } from "~/hr-port/features/profiles/types/profile-data"

import { convertFormValuesToPayloadFormat } from "../dynamic-form/utils/convert-form-data"

export const isEmployee = (data: any): data is EmployeeProfileData => {
  return !!data?.employee_id
}

export const getUpdateEmployeeProfilePayload = (props: {
  fieldMap: FieldMap
  fields: Field[]
  formValues: Record<string, any>
  profileData: EmployeeProfileData
}) => {
  const { formValues, fields, fieldMap, profileData } = props

  const payload = {
    ...profileData,
    //TODO: replace hardcoded values with correct actions // NOSONAR
    status: "ACTIVE",
    entity_data: convertFormValuesToPayloadFormat({
      formValues,
      fields,
      fieldMap,
      profileData,
    }),
  }
  return payload
}
