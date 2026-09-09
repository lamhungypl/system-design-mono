import { TFunction } from "i18next"

import { FormAddressSectionProps } from "~/hr-port/components/form/form-address-section/form-address-section"
import { FormSelectProps } from "~/hr-port/components/form/form-select/form-select"
import { ControlType } from "~/hr-port/constants"
import { SelectOption } from "~/hr-port/types/common"

import { AddressField, Field, FieldAttribute } from "../types"

export enum Attributes {
  AUTO_INCREMENT = "auto_increment",
  AUTO_VALUE = "auto_value",
  BUTTON_NAME = "button_name",
  DEDUCTION_SERVICE = "deduction_service",
  DEFAULT_VALUE = "default_value",
  EDITABLE = "editable",
  ENABLED = "enabled",
  FORMATTER = "formatter",
  FROM_REGION_CONFIG = "from_region_config",
  INHERITED_FIELD = "inherited_field",
  LABEL_CHECKED = "label_checked",
  LABEL_DISABLE = "label_disable",
  LABEL_ONLY = "label_only",
  LABEL_TOOLTIP = "label_tooltip",
  LINK_TO = "link_to",
  OPTION_WITH_ICON = "option_with_icon",
  OPTIONS = "options",
  PATH_FILE = "path_file",
  PLACEHOLDER = "placeholder",
  PREFIX = "prefix",
  SERVICE_PATH = "service_path",
  SUFFIX = "suffix",
  TYPE = "type",
  UNEDITABLE_ROLES = "uneditable_roles",
  VISIBLE_BY = "visible_by",
}

export enum InheritType {
  SELECT_OPTION = "SELECT_OPTION",
  TRANSFORM = "TRANSFORM",
}

export type InheritedFieldAttribute = {
  inherit_type: InheritType
  key_child: string
  select_option_property: string
  transform: null // for future
}

export type VisibleByAttribute = {
  key_parent: string
  value_parent: any
}

export type ExtractedAttributes = {
  button_name: string
  deduction_service: string
  default_value: any
  disabled: boolean
  enabled: boolean
  formatter: string
  from_region_config: boolean
  inherited_field: InheritedFieldAttribute[]
  label_checked: boolean
  label_disable: boolean
  label_only: boolean
  label_tooltip: string
  link_to: string
  option_with_icon: boolean
  options: SelectOption[]
  path_file: string
  placeholder: string
  prefix: string
  service_path: string
  suffix: string
  type: number
  uneditable_roles: string[]
  visible_by: VisibleByAttribute[]
}

// This should only be used in extract-profile.ts
export const getAttributes: (field: Field) => Partial<ExtractedAttributes> = (
  field
) => {
  const attributes = field.attributes
  const attrGroupByKey = attributes.reduce(
    (groupBy, attribute) => {
      switch (attribute.key) {
        case Attributes.OPTIONS:
          groupBy[attribute.key] = attribute.value.data.map((option) => ({
            ...option,
            value: `${option.value}`,
          }))
          break
        case Attributes.INHERITED_FIELD:
        case Attributes.DEFAULT_VALUE:
        case Attributes.UNEDITABLE_ROLES:
          groupBy[attribute.key] = attribute.value.data
          break
        // naming from BE is not suitable
        case "depend_on": {
          groupBy[Attributes.VISIBLE_BY] = attribute.value.data.map(
            (attrValue) => ({
              key_parent: attrValue.key_parent,
              value_parent:
                typeof attrValue.value_parent === "number"
                  ? `${attrValue.value_parent}`
                  : attrValue.value_parent,
            })
          )
          break
        }
        default:
          groupBy[attribute.key] = attribute.value.data[0]
      }

      return groupBy
    },
    {} as Record<string, FieldAttribute["value"]["data"][number]>
  )

  const attrs: Partial<ExtractedAttributes> = {
    enabled: attrGroupByKey[Attributes.ENABLED],
    placeholder: attrGroupByKey[Attributes.PLACEHOLDER],
    disabled: attrGroupByKey[Attributes.EDITABLE] === false,
    prefix: attrGroupByKey[Attributes.PREFIX],
    suffix: attrGroupByKey[Attributes.SUFFIX],
    default_value: attrGroupByKey[Attributes.DEFAULT_VALUE]?.[0],
    options: attrGroupByKey[Attributes.OPTIONS],
    button_name: attrGroupByKey[Attributes.BUTTON_NAME],
    service_path: attrGroupByKey[Attributes.SERVICE_PATH],
    path_file: attrGroupByKey[Attributes.PATH_FILE],
    type: attrGroupByKey[Attributes.TYPE],
    formatter: attrGroupByKey[Attributes.FORMATTER],
    inherited_field: attrGroupByKey[Attributes.INHERITED_FIELD],
    label_checked: attrGroupByKey[Attributes.LABEL_CHECKED],
    label_only: attrGroupByKey[Attributes.LABEL_ONLY],
    label_disable: attrGroupByKey[Attributes.LABEL_DISABLE],
    label_tooltip: attrGroupByKey[Attributes.LABEL_TOOLTIP],
    visible_by: attrGroupByKey[Attributes.VISIBLE_BY],
    deduction_service: attrGroupByKey[Attributes.DEDUCTION_SERVICE],
    link_to: attrGroupByKey[Attributes.LINK_TO],
    from_region_config: attrGroupByKey[Attributes.FROM_REGION_CONFIG],
    option_with_icon: attrGroupByKey[Attributes.OPTION_WITH_ICON],
    uneditable_roles: attrGroupByKey[Attributes.UNEDITABLE_ROLES],
  }

  if (attrs.type === 2 && field.control_type === ControlType.DROPDOWN_LIST) {
    attrs.default_value = attrGroupByKey[Attributes.DEFAULT_VALUE]
  }

  return attrs
}

export const getAddressSectionPropsFromAttribute = (
  field: AddressField,
  t: TFunction,
  {
    namePrefix = "",
    viewOnly,
    ignoreRules = false,
  }: { ignoreRules?: boolean; namePrefix?: string; viewOnly?: boolean } = {}
): Omit<FormAddressSectionProps, "file_path" | "service_path"> => {
  const grid_columns = field.grid_columns
  const countryField = grid_columns.find(
    (column) => column.label === "country"
  )!
  const provinceField = grid_columns.find(
    (column) => column.label === "province_city"
  )!
  const districtField = grid_columns.find(
    (column) => column.label === "district"
  )!
  const subdistrictField = grid_columns.find(
    (column) => column.label === "sub_district"
  )!

  const countryAttrs = countryField.extracted_attributes
  const provinceAttrs = provinceField.extracted_attributes
  const districtAttrs = districtField.extracted_attributes
  const subdistrictAttrs = subdistrictField.extracted_attributes

  const countryRules = ignoreRules ? {} : countryField.extracted_rules
  const provinceRules = ignoreRules ? {} : provinceField.extracted_rules
  const districtRules = ignoreRules ? {} : districtField.extracted_rules
  const subdistrictRules = ignoreRules ? {} : subdistrictField.extracted_rules

  const countryProps: FormSelectProps = {
    name: `${namePrefix}${countryField.id}`,
    label: field.label === "" ? "" : t(countryField.i18n_label),
    options: [],
    disabled: countryAttrs.disabled || viewOnly,
    required: countryRules.REQUIRED,
    inherited_field: countryAttrs.inherited_field,
  }

  const provinceProps: FormSelectProps = {
    name: `${namePrefix}${provinceField.id}`,
    label: field.label === "" ? "" : t(provinceField.i18n_label),
    options: [],
    disabled: provinceAttrs.disabled || viewOnly,
    required: provinceRules.REQUIRED,
    inherited_field: provinceAttrs.inherited_field,
  }

  const districtProps: FormSelectProps = {
    name: `${namePrefix}${districtField.id}`,
    label: field.label === "" ? "" : t(districtField.i18n_label),
    options: [],
    disabled: districtAttrs.disabled || viewOnly,
    required: districtRules.REQUIRED,
    inherited_field: districtAttrs.inherited_field,
  }

  const subdistrictProps: FormSelectProps = {
    name: `${namePrefix}${subdistrictField.id}`,
    label: field.label === "" ? "" : t(subdistrictField.i18n_label),
    options: [],
    disabled: subdistrictAttrs.disabled || viewOnly,
    required: subdistrictRules.REQUIRED,
    inherited_field: subdistrictAttrs.inherited_field,
  }

  const parsedProps = {
    countryProps,
    districtProps,
    provinceProps,
    subdistrictProps,
  }

  return parsedProps
}
