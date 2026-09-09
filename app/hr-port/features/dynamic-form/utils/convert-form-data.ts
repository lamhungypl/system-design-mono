import { SPLITTER } from "~/hr-port/components/form/form-file-uploader/constants"
import { FormFileData as FormSingFileData } from "~/hr-port/components/form/form-file-uploader/types"
import { ControlType } from "~/hr-port/constants"
import { tempNullIdPrefix } from "~/hr-port/features/profiles/constants"
import {
  EntityData,
  FieldData,
  FieldDataValue,
} from "~/hr-port/features/profiles/types/profile-data"
import { getMapFromArray } from "~/hr-port/utils/object"

import { gridFieldArrayKey } from "../constants"
import { Field, FieldMap, FieldMultipleValues, GridValues } from "../types"
import { convertProfileDataToFormDataWithFieldId } from "./convert-profile-data"
import { checkDependsOnRule } from "./rule"

export const convertFormValuesToPayloadFormat = (props: {
  fieldMap: FieldMap
  fields: Field[]
  formValues: Record<string, any>
  profileData: { entity_data: EntityData[]; entity_data_id: number }
}) => {
  const { formValues, fields, fieldMap, profileData } = props

  resetHiddenFieldValues({ formValues, fields })

  const rawInitFormData = convertProfileDataToFormDataWithFieldId({
    data: profileData.entity_data,
    fieldMap,
  })

  const result = fields.map((fieldItem) => {
    const fieldInfo = fieldMap[fieldItem.id]

    if (fieldInfo.control_type === ControlType.GRID) {
      const formFieldValue = formValues[fieldItem.id] as GridValues
      const initFieldValue = rawInitFormData[fieldItem.id] as
        | GridValues
        | undefined

      const formFieldEntityDataIdExistMap = formFieldValue.reduce(
        (prev, fieldItem) => {
          prev[fieldItem.entity_data_id] = true
          return prev
        },
        {} as Record<string, boolean>
      )

      const deletedGridFieldValues: any[] =
        initFieldValue?.filter(
          ({ entity_data_id, delete_flg }) =>
            !delete_flg &&
            entity_data_id !== null &&
            !formFieldEntityDataIdExistMap[entity_data_id]
        ) ?? []

      const deleteFlgGridFieldValues =
        initFieldValue?.filter(({ delete_flg }) => !!delete_flg) ?? []

      return {
        field_id: fieldItem.id,
        values: [],
        grid_data: formFieldValue
          .concat(deletedGridFieldValues, deleteFlgGridFieldValues)
          .map((gridItem) => {
            const isDeleted = deletedGridFieldValues.some(
              (item) => item.entity_data_id === gridItem.entity_data_id
            )

            const entity_data_id =
              gridItem.entity_data_id == undefined ||
              gridItem.entity_data_id.includes(tempNullIdPrefix)
                ? null
                : Number(gridItem.entity_data_id)

            return {
              entity_data_id,
              is_deleted: isDeleted,
              delete_flg: gridItem.delete_flg,
              field_values: Object.entries(gridItem)
                .filter(([gridFieldId]) => {
                  return ![
                    "entity_data_id",
                    "field_value_id_map",
                    "delete_flg",
                    gridFieldArrayKey,
                  ].includes(gridFieldId)
                })
                .map(([gridFieldId, gridFieldValues]) => {
                  const gridFieldValueId =
                    gridItem?.field_value_id_map?.[gridFieldId] || null

                  const values = {
                    value: convertFieldValueToPayloadFormat(gridFieldValues),
                    field_value_id: gridFieldValueId,
                    is_deleted: isDeleted,
                  }

                  return {
                    is_deleted: isDeleted,
                    field_id: Number(gridFieldId) || gridFieldId,
                    values: [values],
                  }
                }),
            }
          }),
      }
    }

    const formFieldValue = formValues[fieldItem.id]
    const initFieldValue = rawInitFormData[fieldItem.id] as FieldDataValue
    const values = {
      field_value_id: initFieldValue?.field_value_id ?? null,
      value:
        fieldItem.label === "gender"
          ? initFieldValue.value
          : convertFieldValueToPayloadFormat(formFieldValue),
      is_deleted: false,
    } satisfies FieldData["values"][number]

    return {
      field_id: fieldItem.id,
      values: [values],
      grid_data: [],
    }
  })

  console.log("output - result", result)

  return result
}

export const convertFieldValueToPayloadFormat = (data: unknown) => {
  if (Array.isArray(data)) {
    if (data.length === 0) {
      return ""
    }
    if (isMultiSelectData(data)) {
      return data.join(",")
    }
    if (isFormFileUploaderData(data)) {
      const fileId = data[0].id
      const fileName = data[0].name
      const formattedDataFile = `${fileId}${SPLITTER}${fileName}`
      return formattedDataFile
    }
  }
  return data
}

export const isFormFileUploaderData = (
  data: unknown
): data is FormSingFileData[] => {
  if (!Array.isArray(data)) {
    return false
  }
  return data.length === 0 || isFormSingleFileData(data[0])
}

const isFormSingleFileData = (data: unknown): data is FormSingFileData => {
  return !!(data as FormSingFileData)?.["uid"]
}

export const isMultiSelectData = (
  data: unknown
): data is FieldMultipleValues => {
  return Array.isArray(data) && typeof data[0] === "string"
}

export const resetHiddenFieldValues = (params: {
  fields: Field[]
  formValues: Record<string, any>
}) => {
  const { formValues, fields } = params
  const parentConditionsMap = getMapFromArray(
    fields,
    "id",
    (field) => field.extracted_attributes.visible_by
  )
  const fieldMap = getMapFromArray(fields, "id")
  Object.keys(formValues).forEach((childId) => {
    const parentConditions = parentConditionsMap[childId]
    if (parentConditions) {
      for (const parentCondition of parentConditions) {
        if (
          checkDependsOnRule({
            sourceField: fieldMap[parentCondition.key_parent],
            sourceValue: formValues[parentCondition.key_parent],
            operator: "not",
            targetValue: parentCondition.value_parent,
          }).isCorrect
        ) {
          formValues[childId] = ""
          break
        }
      }
    }
  })
}
