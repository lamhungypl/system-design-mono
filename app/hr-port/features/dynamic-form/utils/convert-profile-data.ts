import { ControlType } from "~/hr-port/constants"
import { tempNullIdPrefix } from "~/hr-port/features/profiles/constants"
import {
  EntityData,
  FieldDataValue,
} from "~/hr-port/features/profiles/types/profile-data"

import {
  Field,
  FieldMap,
  FieldMultipleValues,
  FieldSingleValue,
  GridValue,
  GridValues,
} from "../types"
import {
  getDefaultValueForControlType,
  getFieldValue,
  isMultiSelect,
} from "./field"

export const genderMap = {
  1: "Male",
  2: "Female",
  3: "Do not select",
}

// {field_id: field_value}
export const convertProfileDataToFormData = (params: {
  data: EntityData[]
  fieldMap: FieldMap
  options?: {
    keepDeleteFlg?: boolean
  }
}) => {
  const { data, fieldMap, options = {} } = params
  const { keepDeleteFlg } = options
  const formData: Record<
    string,
    FieldSingleValue | FieldMultipleValues | GridValues | undefined
  > = {}
  for (const entityData of data) {
    const field = fieldMap[entityData.field_id]
    if (!field) continue
    if (field.control_type === ControlType.GRID) {
      const data: GridValues = entityData.grid_data
        .filter(({ delete_flg }) => {
          if (keepDeleteFlg) return true
          return !delete_flg
        })
        .map(({ field_values, entity_data_id, delete_flg }, index) => {
          const rowData: GridValue = field_values.reduce(
            (prev, curr) => {
              const fieldInfo = fieldMap[curr.field_id]
              return {
                ...prev,
                [curr.field_id]: convertToFormValue(
                  getFieldValue(curr.values),
                  fieldInfo
                ),
                field_value_id_map: {
                  ...prev.field_value_id_map,
                  [curr.field_id]: getFieldValue(curr.values, "field_value_id"),
                },
              }
            },
            {
              entity_data_id:
                entity_data_id === null
                  ? `${tempNullIdPrefix}${index}`
                  : entity_data_id.toString(),
              field_value_id_map: {},
              delete_flg,
            }
          )

          field.grid_columns?.forEach((grid_field) => {
            if (rowData[grid_field.id] == undefined) {
              rowData[grid_field.id] = getDefaultValueForControlType(grid_field)
            }
          })

          return rowData
        })
      data.sort((a, b) => {
        if (
          a.entity_data_id.includes(tempNullIdPrefix) &&
          b.entity_data_id.includes(tempNullIdPrefix)
        )
          return 0
        if (a.entity_data_id.includes(tempNullIdPrefix)) return 1
        if (b.entity_data_id.includes(tempNullIdPrefix)) return -1
        return Number(a.entity_data_id) - Number(b.entity_data_id)
      })

      formData[entityData.field_id] = data
    } else if (field.label === "gender") {
      formData[entityData.field_id] =
        genderMap[entityData.values[0]?.value as keyof typeof genderMap]
    } else {
      formData[entityData.field_id] = convertToFormValue(
        getFieldValue(entityData.values),
        field
      )
    }
  }
  return formData
}

export const convertToFormValue = (value: any, field: Field) => {
  if (isMultiSelect(field)) {
    return typeof value === "string" ? value.split(",").filter(Boolean) : value
  } else if (field?.control_type === ControlType.TOGGLE) {
    return value === "true"
  }
  return value
}

// {field_id: {field_value, field_value_id}}
export const convertProfileDataToFormDataWithFieldId = (params: {
  data: EntityData[]
  fieldMap: FieldMap
}) => {
  const { data, fieldMap } = params
  const formData: Record<string, FieldDataValue | GridValues> = {}
  for (const entityData of data) {
    if (entityData.grid_data.length > 0) {
      const data = entityData.grid_data.map(
        ({ field_values, entity_data_id, delete_flg }) => {
          return field_values.reduce(
            (prev, curr) => {
              return {
                ...prev,
                [curr.field_id]: getFieldValue(curr.values),
                field_value_id_map: {
                  ...prev.field_value_id_map,
                  [curr.field_id]: getFieldValue(curr.values, "field_value_id"),
                },
              }
            },
            {
              entity_data_id:
                entity_data_id === null ? null : entity_data_id.toString(),
              field_value_id_map: {},
              delete_flg: !!delete_flg,
            }
          )
        }
      )
      formData[entityData.field_id] = data as any
    } else if (fieldMap?.[entityData.field_id]?.label === "gender") {
      formData[entityData.field_id] = entityData.values[0]
    } else {
      formData[entityData.field_id] = entityData.values?.[0]
    }
  }
  return formData
}
