import { ControlType } from "~/hr-port/constants"
import { ProfileStructure } from "~/hr-port/features/profiles/types/profile-structure"
import { getMapFromArray } from "~/hr-port/utils/object"

import { Field } from "../types"
import { getAttributes } from "./attribute"
import { getRules } from "./rule"

export const formatProfile = (profile: ProfileStructure) => {
  const outerFields: Field[] = []
  const inGridFields: Field[] = []

  const extractFieldsAndGrids = (
    fields: Field[],
    {
      hierarchy_id,
      hierarchy_label,
    }: { hierarchy_id: string[]; hierarchy_label: string[] }
  ) => {
    const addMetadataToField = (field: Field) => {
      addExtractedAttributesAndRulesToField(field)
      const { label_tooltip, placeholder, button_name } =
        field.extracted_attributes
      field.hierarchy_label = [...hierarchy_label, field.label]
      field.i18n_label = field.hierarchy_label.join(".")
      field.hierarchy_id = [...hierarchy_id, field.id.toString()]
      field.i18n_tooltip = label_tooltip
        ? [...hierarchy_label, label_tooltip].join(".")
        : ""
      field.i18n_placeholder = placeholder
        ? [...hierarchy_label, placeholder].join(".")
        : ""
      field.i18n_button_name = button_name
        ? [...hierarchy_label, button_name].join(".")
        : ""
    }

    fields.forEach((field) => {
      addMetadataToField(field)

      if (field.control_type !== ControlType.ADDRESS_SECTION) {
        outerFields.push(field)
      }

      if (field.grid_columns) {
        field.grid_columns.forEach(addMetadataToField)

        if (field.control_type === ControlType.ADDRESS_SECTION) {
          outerFields.push(...field.grid_columns)
        } else if (field.control_type === ControlType.GRID) {
          changeLabelToId(field.grid_columns)
          inGridFields.push(...field.grid_columns)
        }
      }
    })
  }

  for (const section of profile.section_infos) {
    extractFieldsAndGrids(section.fields, {
      hierarchy_id: [section.id.toString()],
      hierarchy_label: [profile.label, section.label],
    })

    section.subsection_infos.forEach((subsection) => {
      extractFieldsAndGrids(subsection.fields, {
        hierarchy_id: [section.id.toString(), subsection.id.toString()],
        hierarchy_label: [profile.label, section.label, subsection.label],
      })
    })
  }

  changeLabelToId(outerFields)

  profile.extracted_fields = outerFields
  profile.field_map = getMapFromArray([...outerFields, ...inGridFields], "id")

  console.log({ profile })
}

// should be called after all needed fields have been added to fields array
export const changeLabelToId = (fields: Field[]) => {
  const labelToFieldMap = getMapFromArray(fields, "label")

  for (const field of fields) {
    const visibleByAttr = field.extracted_attributes.visible_by
    visibleByAttr?.forEach((attrValue) => {
      attrValue.key_parent = `${labelToFieldMap[attrValue.key_parent]?.id}`
    })
    const linkToAttr = field.extracted_attributes.link_to
    if (linkToAttr) {
      field.extracted_attributes.link_to = `${labelToFieldMap[linkToAttr]?.id}`
    }
    const inheritedFieldAttr = field.extracted_attributes.inherited_field
    inheritedFieldAttr?.forEach((attrValue) => {
      const label = attrValue.key_child
      attrValue.key_child = `${labelToFieldMap[label]?.id}`
    })
    const dependOnRule = field.extracted_rules.DEPENDS_ON
    dependOnRule?.forEach((ruleValue) => {
      ruleValue.key_parent = `${labelToFieldMap[ruleValue.key_parent]?.id}`
    })
  }
}

export const addExtractedAttributesAndRulesToField = (field: Field) => {
  const extractedAttributes = getAttributes(field)
  const extractedRules = getRules(field)
  field.extracted_attributes = extractedAttributes
  field.extracted_rules = extractedRules
}
