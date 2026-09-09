import { isAfter, parse } from "date-fns"
import { z } from "zod"

import { FILE_TYPE } from "~/hr-port/components/ui/file-uploader/constants"
import i18n from "~/hr-port/config/i18n"
import { ControlType } from "~/hr-port/constants"
import { getMapFromArray } from "~/hr-port/utils/object"
import { capitalizeFirstLetter } from "~/hr-port/utils/string"

import { Field } from "../types"

export enum Rules {
  CHARACTER_APPLIED = "CHARACTER_APPLIED",
  DEPENDS_ON = "DEPENDS_ON",
  FILE_SIZE = "FILE_SIZE",
  FORMAT_FILE = "FORMAT_FILE",
  MAX_LENGTH = "MAX_LENGTH",
  MAX_VALUE = "MAX_VALUE",
  REQUIRED = "REQUIRED",
  SPECIAL_VALIDATION = "SPECIAL_VALIDATION",
}

export enum CharacterAppliedValues {
  ALPHABET = "Alphabet",
  NUMBER = "Number",
  SPECIAL_CHARACTER = "Special Character",
}

export type DependsOnRule = {
  condition: {
    operator: DependsOnRuleOperator
    value: any
  }
  key_parent: string
  operator: DependsOnRuleOperator
  value: any
}

export type DependsOnRuleOperator = "not" | "eq" | "gt"

export type ExtractedRules = {
  CHARACTER_APPLIED: CharacterAppliedValues[]
  DEPENDS_ON: DependsOnRule[]
  FILE_SIZE: number
  FORMAT_FILE: FILE_TYPE[]
  MAX_LENGTH: number
  MAX_VALUE: number
  REQUIRED: boolean
  SPECIAL_VALIDATION: string
}

// This should only be used in extract-profile.ts
export const getRules = (field: Field) => {
  const rules = field.rules
  const rulesGroupByKey = rules.reduce(
    (groupBy, attribute) => {
      switch (attribute.type) {
        case Rules.FORMAT_FILE:
        case Rules.CHARACTER_APPLIED:
        case Rules.DEPENDS_ON:
          groupBy[attribute.type] = attribute.data.data
          break
        default:
          groupBy[attribute.type] = attribute.data.data[0]
      }
      return groupBy
    },
    {} as Record<string, any>
  )

  const parsedProps: Partial<ExtractedRules> = {
    REQUIRED: rulesGroupByKey[Rules.REQUIRED],
    CHARACTER_APPLIED: rulesGroupByKey[Rules.CHARACTER_APPLIED],
    MAX_LENGTH: rulesGroupByKey[Rules.MAX_LENGTH] ?? 255,
    SPECIAL_VALIDATION: rulesGroupByKey[Rules.SPECIAL_VALIDATION],
    FORMAT_FILE: rulesGroupByKey[Rules.FORMAT_FILE],
    FILE_SIZE: rulesGroupByKey[Rules.FILE_SIZE],
    DEPENDS_ON: rulesGroupByKey[Rules.DEPENDS_ON],
    MAX_VALUE: rulesGroupByKey[Rules.MAX_VALUE],
  }

  return parsedProps
}

export const getSchemaForField = (field: Field) => {
  const {
    REQUIRED,
    MAX_LENGTH,
    CHARACTER_APPLIED,
    SPECIAL_VALIDATION,
    MAX_VALUE,
  } = field.extracted_rules
  const { suffix, type } = field.extracted_attributes
  const fieldLabel = capitalizeFirstLetter(i18n.t(field.i18n_label))

  switch (field.control_type) {
    case ControlType.FIELD_TEXT:
      return z
        .string()
        .trim()
        .refine(
          (value) => {
            if (!REQUIRED) return true
            return value.length > 0
          },
          {
            message: i18n.t("common.validation.required.input", {
              field: fieldLabel,
            }),
          }
        )
        .refine(
          (value) => {
            if (!value.length || !MAX_LENGTH) return true
            return value.length <= MAX_LENGTH
          },
          { message: "The input value exceeds the accepted max length." }
        )
        .refine(
          (value: string) => {
            const isNotGivenRules = !value.length || !CHARACTER_APPLIED

            if (isNotGivenRules) return true
            let regexStr = "^["
            if (CHARACTER_APPLIED?.includes(CharacterAppliedValues.ALPHABET)) {
              regexStr += "a-zA-Z"
            }
            if (CHARACTER_APPLIED?.includes(CharacterAppliedValues.NUMBER)) {
              regexStr += "0-9"
            }
            if (
              CHARACTER_APPLIED?.includes(
                CharacterAppliedValues.SPECIAL_CHARACTER
              )
            ) {
              regexStr += "!@#$%^&*()-_+=\\[\\]{};:'\",<>.?/|`~"
            }
            regexStr += "]+$"
            return new RegExp(regexStr).test(value)
          },
          {
            message: i18n.t("common.validation.string.pattern", {
              field: fieldLabel,
            }),
          }
        )
        .refine(
          (value) => {
            if (!value.length || !SPECIAL_VALIDATION) return true
            return new RegExp(SPECIAL_VALIDATION).test(value)
          },
          {
            message: i18n.t("common.validation.string.pattern", {
              field: fieldLabel,
            }),
          }
        )
        .refine(
          (value) => {
            if (!value.length || !MAX_VALUE) return true
            return MAX_VALUE >= Number(value)
          },
          {
            message: i18n.t("common.validation.number.max", {
              max: `${MAX_VALUE}${suffix ?? ""}`,
            }),
          }
        )

    case ControlType.DROPDOWN_LIST:
      if (type === 2)
        return z.array(z.any()).refine(
          (value) => {
            if (!REQUIRED) return true
            return value.length > 0
          },
          {
            message: i18n.t("common.validation.required.select", {
              field: fieldLabel,
            }),
          }
        )
      return z.string().refine(
        (value) => {
          if (!REQUIRED) return true
          return value.length > 0
        },
        {
          message: i18n.t("common.validation.required.select", {
            field: fieldLabel,
          }),
        }
      )

    case ControlType.CALENDAR_PICKER:
      return z
        .string()
        .refine(
          (value) => {
            if (!REQUIRED) return true
            return value.length > 0
          },
          {
            message: i18n.t("common.validation.required.select", {
              field: fieldLabel,
            }),
          }
        )
        .refine(
          (value) => {
            if (!REQUIRED && !value.trim()) return true

            const date = parse(value, "yyyy-MM-dd", new Date())
            const year = date.getFullYear()
            return year >= 1900 && year <= new Date().getFullYear() + 100
          },
          { message: i18n.t("common.validation.date.default_rule") }
        )
    case ControlType.RADIO_BUTTONS:
      return z
        .string()
        .trim()
        .refine(
          (value) => {
            if (!REQUIRED) return true
            return value.length > 0
          },
          {
            message: i18n.t("common.validation.required.select", {
              field: fieldLabel,
            }),
          }
        )
    case ControlType.GRID: {
      const gridItemSchema = (field.grid_columns || [])?.reduce(
        (gridSchema, currentField) => {
          gridSchema[currentField.id] = getSchemaForField(currentField)
          return gridSchema
        },
        {} as Record<string, z.ZodTypeAny>
      )
      return z.array(
        z.object({
          ...gridItemSchema,
          /**
           * @description optional key for the submit step
           */
          entity_data_id: z.string().nullable().optional(),
          field_value_id_map: z.any().optional(),
          delete_flg: z.boolean().optional(),
        })
      )
    }
  }
  return z.any()
}

export const getSchemaFromFields = (fields: Field[]) => {
  const fieldMap = getMapFromArray(fields, "id")
  const schemas = getMapFromArray(fields, "id", (field) =>
    getSchemaForField(field)
  )
  const dependsOnRules: {
    child: Field
    parent: Field
    rule: DependsOnRule
  }[] = []
  fields.forEach((field) => {
    const { DEPENDS_ON } = field.extracted_rules
    if (DEPENDS_ON) {
      DEPENDS_ON.forEach((rule) => {
        dependsOnRules.push({
          child: field,
          parent: fieldMap[rule.key_parent],
          rule,
        })
      })
    }
  })

  return z.object(schemas).superRefine((data, ctx) => {
    dependsOnRules.forEach(({ child, parent, rule }) => {
      const parentCondition = rule.condition
      const { isCorrect: isParentMatched } = checkDependsOnRule({
        sourceField: parent,
        sourceValue: data[parent.id],
        targetValue: parentCondition.value,
        operator: parentCondition.operator,
      })
      if (isParentMatched) {
        const { isCorrect, errorMessage } = checkDependsOnRule({
          sourceField: child,
          sourceValue: data[child.id],
          targetValue: rule.value,
          operator: rule.operator,
          parentField: parent,
          parentValue: data[parent.id],
        })

        if (!isCorrect) {
          ctx.addIssue({
            path: [`${child.id}`],
            message: errorMessage,
            code: z.ZodIssueCode.custom,
          })
        }
      }
    })
  })
}

export type CheckDependsOnRule = (params: {
  operator: DependsOnRuleOperator
  parentField?: Field
  parentValue?: any
  sourceField: Field
  sourceValue: any
  targetValue: any
}) => {
  errorMessage: string
  errorType: Rules | null
  isCorrect: boolean
}

export const checkDependsOnRule: CheckDependsOnRule = (params) => {
  const {
    sourceField,
    sourceValue,
    targetValue,
    operator,
    parentField,
    parentValue,
  } = params
  let isCorrect = false
  let errorMessage = "undefined_validation_error_message"
  let errorType: Rules | null = null
  const sourceFieldLabel = capitalizeFirstLetter(i18n.t(sourceField.i18n_label))
  const parentFieldLabel = parentField
    ? capitalizeFirstLetter(i18n.t(parentField.i18n_label))
    : ""
  switch (sourceField.control_type) {
    case ControlType.FIELD_TEXT: {
      switch (operator) {
        case "not": {
          if (targetValue === null) {
            isCorrect = sourceValue !== ""
            if (!isCorrect) {
              errorMessage = i18n.t("common.validation.required.input", {
                field: sourceFieldLabel,
              })
              errorType = Rules.REQUIRED
            }
          } else {
            isCorrect = sourceValue !== targetValue
          }
          break
        }
      }
      break
    }
    case ControlType.TOGGLE: {
      switch (operator) {
        case "eq": {
          isCorrect = sourceValue === targetValue
          break
        }
        case "not": {
          isCorrect = sourceValue !== targetValue
          break
        }
      }
      break
    }
    case ControlType.RADIO_BUTTONS: {
      switch (operator) {
        case "not": {
          if (targetValue === null) {
            isCorrect = sourceValue !== ""
            if (!isCorrect) {
              errorMessage = i18n.t("common.validation.required.select", {
                field: sourceFieldLabel,
              })
              errorType = Rules.REQUIRED
            }
          } else {
            isCorrect = sourceValue !== String(targetValue)
          }
          break
        }
      }
      break
    }
    case ControlType.DROPDOWN_LIST: {
      switch (operator) {
        case "eq": {
          isCorrect = sourceValue === String(targetValue)
          break
        }
        case "not": {
          if (targetValue === null) {
            isCorrect = sourceValue !== ""
            if (!isCorrect) {
              errorMessage = i18n.t("common.validation.required.select", {
                field: sourceFieldLabel,
              })
              errorType = Rules.REQUIRED
            }
          } else {
            isCorrect = sourceValue !== String(targetValue)
          }
          break
        }
      }
      break
    }
    case ControlType.CALENDAR_PICKER: {
      switch (operator) {
        case "not": {
          if (targetValue === null) {
            isCorrect = sourceValue !== ""
            if (!isCorrect) {
              errorMessage = i18n.t("common.validation.required.select", {
                field: sourceFieldLabel,
              })
              errorType = Rules.REQUIRED
            }
          } else {
            isCorrect = sourceValue !== targetValue
          }
          break
        }
        case "gt": {
          if (targetValue === "undefined") {
            if (!sourceValue || !isAfter(sourceValue, parentValue)) {
              errorMessage = i18n.t("common.validation.date.gt", {
                end: sourceFieldLabel,
                start: parentFieldLabel,
              })
            } else {
              isCorrect = true
            }
          } else {
            if (!sourceValue || !isAfter(sourceValue, targetValue)) {
              errorMessage = i18n.t("common.validation.date.gt", {
                end: sourceFieldLabel,
                start: targetValue,
              })
            } else {
              isCorrect = true
            }
          }
          break
        }
      }
      break
    }
  }

  return {
    isCorrect,
    errorMessage,
    errorType,
  }
}
