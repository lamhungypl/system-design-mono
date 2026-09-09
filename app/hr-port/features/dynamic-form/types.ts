import { ControlType } from "~/hr-port/constants"

import { ExtractedAttributes } from "./utils/attribute"
import { ExtractedRules } from "./utils/rule"

export type Field = {
  attributes: FieldAttribute[]
  control_type: ControlType
  grid_columns?: Field[]
  id: number | string
  label: string
  rules: FieldRule[]
  sort_order: number
} & FieldMetadata

export type FieldMetadata = {
  extracted_attributes: Partial<ExtractedAttributes>
  extracted_rules: Partial<ExtractedRules>
  hierarchy_id: string[]
  hierarchy_label: string[]
  i18n_button_name: string
  i18n_label: string
  i18n_placeholder: string
  i18n_tooltip: string
}

export type AddressField = {
  grid_columns: Field[]
} & Field

export type FieldAttribute = {
  id: number
  key: string
  value: {
    data: any[]
  }
}

export type FieldRule = {
  data: {
    data: any[]
  }
  id: number
  type: string
}

export type FieldMap = Record<string, Field>
export type FieldSingleValue = string
export type FieldMultipleValues = string[]
export type GridValue = {
  [key: string]: string | { [key: string]: number } | boolean | undefined
  delete_flg?: boolean
  entity_data_id: string
  field_value_id_map: {
    [key: string]: number
  }
}
export type GridValues = GridValue[]
