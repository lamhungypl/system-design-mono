import { ControlType, DROPDOWN_LIST_TYPE } from "~/hr-port/constants"
import { FieldData } from "~/hr-port/features/profiles/types/profile-data"
import { getMapFromArray } from "~/hr-port/utils/object"

import { Field } from "../types"

export const getFieldValue = (
  values: FieldData["values"],
  key = "value" as keyof FieldData["values"][number],
  defaultValue?: any
) => {
  if (values.length === 0) return defaultValue ?? undefined

  return values[0]?.[key]
}

export const isMultiSelect = (field?: Field) => {
  if (!field) {
    return false
  }
  const { type } = field.extracted_attributes
  return (
    type === DROPDOWN_LIST_TYPE.MULTIPLE_DROPDOWN_LIST &&
    field.control_type === ControlType.DROPDOWN_LIST
  )
}

export const getDefaultValueForControlType = (field: Field) => {
  const { type } = field.extracted_attributes
  const defaultValueLookup: Record<ControlType, any> = {
    [ControlType.ADDRESS_SECTION]: undefined,
    [ControlType.CALENDAR_PICKER]: null,
    [ControlType.CHECKBOXES]: false,
    [ControlType.DROPDOWN_LIST]: type === 2 ? [] : "",
    [ControlType.FIELD_TEXT]: "",
    [ControlType.FILE_UPLOADER]: [],
    [ControlType.GRID]: [],
    [ControlType.RADIO_BUTTONS]: null,
    [ControlType.SLIDERS]: null,
    [ControlType.TOGGLE]: false,
  }
  return defaultValueLookup[field.control_type] ?? ""
}

export const getDefaultValueForField = (field: Field) => {
  const { default_value } = field.extracted_attributes
  if (field.label === "country") {
    return "1"
  } else if (default_value !== undefined) {
    if (isMultiSelect(field)) {
      return default_value.map((v: number | string) => `${v}`)
    } else if (field.control_type === ControlType.TOGGLE) {
      return default_value
    } else {
      return `${default_value}`
    }
  } else {
    return getDefaultValueForControlType(field)
  }
}

export const getDefaultValueForFields = (fields: Field[]) => {
  return getMapFromArray(fields, "id", getDefaultValueForField)
}
