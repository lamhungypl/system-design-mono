import { useMemo } from "react"
import { useWatch } from "react-hook-form"
import { useTranslation } from "react-i18next"

import { useUserQuery } from "~/hr-port/api/user/user.query"
import FormAddressSection from "~/hr-port/components/form/form-address-section/form-address-section"
import FormCalendar from "~/hr-port/components/form/form-calendar/form-calendar"
import FormDataTable from "~/hr-port/components/form/form-data-table/form-data-table"
import FormFileUploader from "~/hr-port/components/form/form-file-uploader/form-file-uploader"
import FormMultiSelect from "~/hr-port/components/form/form-multi-select/form-multi-select"
import FormMultiSelectWithCheckbox from "~/hr-port/components/form/form-multi-select/form-multi-select-with-checkbox"
import FormRadio from "~/hr-port/components/form/form-radio/form-radio"
import FormSelect from "~/hr-port/components/form/form-select/form-select"
import FormSelectWithCheckbox from "~/hr-port/components/form/form-select/form-select-with-checkbox"
import FormSwitch from "~/hr-port/components/form/form-switch/form-switch"
import FormTextField from "~/hr-port/components/form/form-text-field/form-text-field"
import FormTextFieldWithCheckbox from "~/hr-port/components/form/form-text-field/form-text-field-with-checkbox"
import { FormFieldProps } from "~/hr-port/components/form/types"
import { ControlType } from "~/hr-port/constants"
import { useUploadDocumentsMutation } from "~/hr-port/features/documents/api/documents.query"
import {
  DynamicContextValue,
  useDynamicContext,
} from "~/hr-port/features/dynamic-form/components/dynamic-provider"
import { AddressField, Field } from "~/hr-port/features/dynamic-form/types"
import { getAddressSectionPropsFromAttribute } from "~/hr-port/features/dynamic-form/utils/attribute"
import { checkDependsOnRule } from "~/hr-port/features/dynamic-form/utils/rule"
import { employeeUploadDocumentConfig } from "~/hr-port/features/employee/constants"
import { isEmployee } from "~/hr-port/features/employee/utils"
import { companyUploadDocumentConfig } from "~/hr-port/features/profiles/constants"
import { cn } from "~/hr-port/utils/style"

import { useFieldsInfo } from "../../providers/FieldsInfoProvider"

const requestOptionsLookup = {
  employee: employeeUploadDocumentConfig,
  company: companyUploadDocumentConfig,
} satisfies Record<DynamicContextValue["type"], any>

export type FormDynamicFieldProps = {
  compareMode?: boolean
  disabled?: boolean
  /**
   * override the form field props, should be located at the bottom of each field
   */
  formFieldProps?: Partial<FormFieldProps>
  ignoreRules?: boolean
  isInDialog?: boolean
  /**
   * @description always view fields if they are in grid, override the `Enable`, `RequiredOnly` context
   */
  isInGrid?: boolean
  namePrefix?: string
  showRequiredOnly?: boolean
  vertical?: boolean
  viewOnly?: boolean
} & (Field | AddressField)
export default function FormDynamicField(props: FormDynamicFieldProps) {
  const {
    formFieldProps,
    isInGrid,
    disabled: forcedDisabled,
    ignoreRules = false,
    namePrefix = "",
    compareMode = false,
    extracted_attributes,
    extracted_rules,
  } = props
  const { t } = useTranslation()
  const { type: dynamicType, data: dynamicData } = useDynamicContext()
  const { mutateAsync } = useUploadDocumentsMutation()
  const { data: user } = useUserQuery()
  const { disableAll, visibleFieldMap, fieldMap } = useFieldsInfo()

  const extractedRules = useMemo(() => {
    if (ignoreRules) return {}
    return extracted_rules
  }, [ignoreRules, extracted_rules])

  const visibleByParentIds = useMemo(() => {
    const { visible_by } = extracted_attributes
    if (!visible_by) return []
    return visible_by.map((item) => item.key_parent)
  }, [extracted_attributes])

  const visibleByParentValues = useWatch({ name: visibleByParentIds })

  const requiredByParentIds = useMemo(() => {
    const { DEPENDS_ON } = extractedRules
    if (!DEPENDS_ON) return []
    const parentIds = []
    for (const rule of DEPENDS_ON) {
      const { operator: childOperator, value: childTargetValue } = rule
      if (childOperator === "not" && childTargetValue === null) {
        parentIds.push(rule.key_parent)
      }
    }
    return parentIds
  }, [extractedRules])

  const requiredByParentValues = useWatch({ name: requiredByParentIds })

  const requiredByParent = useMemo(() => {
    const { DEPENDS_ON } = extractedRules
    if (!DEPENDS_ON) return false
    const parentValuesMap = requiredByParentIds.reduce(
      (prev, id, index) => {
        prev[id] = requiredByParentValues[index]
        return prev
      },
      {} as Record<string, any>
    )
    for (const rule of DEPENDS_ON) {
      const parentCondition = rule.condition
      const isParentMatched = checkDependsOnRule({
        sourceField: fieldMap[rule.key_parent],
        sourceValue: parentValuesMap[rule.key_parent],
        operator: parentCondition.operator,
        targetValue: parentCondition.value,
      }).isCorrect
      if (isParentMatched) return true
    }
    return false
  }, [requiredByParentValues, requiredByParentIds, extractedRules, fieldMap])

  const isUneditableByRole = useMemo(() => {
    if (!user) return true
    const { uneditable_roles } = extracted_attributes
    if (!uneditable_roles) return false
    return user.roles.every((role) => uneditable_roles.includes(role))
  }, [user, extracted_attributes])

  // prettier-ignore
  const renderedComponent = useMemo(() => { // NOSONAR
    const {
      enabled,
      disabled: _disabled,
      prefix,
      suffix,
      options,
      service_path,
      path_file,
      type,
      formatter,
      label_checked,
      label_only,
      label_disable,
      visible_by,
      default_value,
      deduction_service,
      link_to,
      from_region_config,
      option_with_icon,
      inherited_field,
    } = extracted_attributes;

    const name = `${namePrefix}${props.id}`;
    const disabled = _disabled || isUneditableByRole || forcedDisabled || disableAll;
    const label = (props.label && props.i18n_label) ? t(props.i18n_label) : '';
    const placeholder = props.i18n_placeholder ? t(props.i18n_placeholder) : '';
    const label_tooltip = props.i18n_tooltip ? t(props.i18n_tooltip) : '';
    const button_name = props.i18n_button_name ? t(props.i18n_button_name) : '';

    const {
      REQUIRED: requiredFromRule,
      MAX_LENGTH,
      FILE_SIZE,
      FORMAT_FILE,
      MAX_VALUE,
    } = extractedRules;

    if (!isInGrid) {
      if (visible_by) {
        if (!ignoreRules && visible_by.some((item, index) => visibleByParentValues[index] !== item.value_parent)) return null;
      }
      if (visibleFieldMap?.[name] === false) return null;
    }

    const REQUIRED = requiredFromRule || requiredByParent;

    switch (props.control_type) {
      case ControlType.FIELD_TEXT: {

        if (!isInGrid) {
          if (!enabled) return null;
          if (!REQUIRED && props.showRequiredOnly) return null;
        }

        let inputType;
        if (type === 2) inputType = 'money';

        if (label_checked) {
          return (
            <FormTextFieldWithCheckbox
              disabled={disabled}
              prefix={prefix}
              suffix={suffix}
              placeholder={placeholder}
              name={name}
              label={label}
              required={REQUIRED}
              maxLength={MAX_LENGTH}
              label_tooltip={label_tooltip}
              label_only={label_only}
              label_disable={label_disable}
              formatter={formatter}
              defaultValue={default_value}
              deduction_service={deduction_service}
              link_to={link_to}
              maxValue={MAX_VALUE}
              vertical={props.vertical}
              type={inputType}
              isInGrid
            />
          );
        }

        return (
          <FormTextField
            prefix={prefix}
            suffix={suffix}
            placeholder={placeholder}
            transformValue={(value) => `${value} ${suffix ?? ''}`}
            name={name}
            label={label}
            required={REQUIRED}
            maxLength={MAX_LENGTH}
            vertical={props.vertical}
            disabled={disabled || props.viewOnly} // TODO: use viewOnly={props.viewOnly} instead for viewOnly mode
            tooltip={label_tooltip}
            type={inputType}
            defaultValue={default_value}
            isInGrid
            {...formFieldProps}
          />
        );
      }

      case ControlType.ADDRESS_SECTION: {
        const addressSectionProps = getAddressSectionPropsFromAttribute(
          props as AddressField,
          t,
          {
            viewOnly: props.viewOnly || disabled,
            namePrefix,
            ignoreRules,
          }
        );
        return (
          <FormAddressSection
            file_path={path_file!}
            service_path={service_path!}
            vertical={props.vertical}
            compareMode={compareMode}
            {...addressSectionProps}
            {...formFieldProps}
          />
        );
      }

      case ControlType.GRID: {
        return (
          <div
            className={cn({
              'col-span-2': !compareMode,
              'w-fit': compareMode,
            })}
          >
            <FormDataTable
              editable={!disabled && !props.viewOnly}
              gridColumns={(props as AddressField).grid_columns}
              emptyRowData={{}}
              name={name}
              buttonText={button_name}
              enableTopToolbar={!disabled}
              compareMode={compareMode}
            />
          </div>
        );
      }

      case ControlType.DROPDOWN_LIST: {
        if (!isInGrid) {
          if (!enabled) return null;
          if (!REQUIRED && props.showRequiredOnly) return null;
        }

        if (type === 2) {
          if (label_checked)
            return (
              <FormMultiSelectWithCheckbox
                name={name}
                label={label}
                options={options}
                disabled={disabled || props.viewOnly}
                required={REQUIRED}
                service_path={service_path}
                label_tooltip={label_tooltip}
                label_only={label_only}
                label_disable={label_disable}
                formatter={formatter}
                deduction_service={deduction_service}
                link_to={link_to}
                hierarchy_label={props.hierarchy_label}
                placeholder={placeholder}
                vertical={props.vertical}
                isInGrid
                {...formFieldProps}
              />
            );

          return (
            <FormMultiSelect
              name={name}
              label={label}
              options={options ?? []}
              disabled={disabled || props.viewOnly}
              required={REQUIRED}
              service_path={service_path}
              vertical={props.vertical}
              tooltip={label_tooltip}
              isInGrid
              {...formFieldProps}
            />
          );
        }

        if (label_checked)
          return (
            <FormSelectWithCheckbox
              name={name}
              label={label}
              options={Array.isArray(options) ? options : []}
              disabled={disabled || props.viewOnly}
              required={REQUIRED}
              service_path={service_path}
              label_tooltip={label_tooltip}
              label_only={label_only}
              label_disable={label_disable}
              formatter={formatter}
              deduction_service={deduction_service}
              link_to={link_to}
              hierarchy_label={props.hierarchy_label}
              placeholder={placeholder}
              vertical={props.vertical}
              from_region_config={from_region_config}
              isInGrid
              {...formFieldProps}
            />
          );

        return (
          <FormSelect
            name={name}
            label={label}
            options={Array.isArray(options) ? options : []}
            disabled={disabled || props.viewOnly}
            required={REQUIRED}
            service_path={service_path}
            optionWithIcon={option_with_icon}
            vertical={props.vertical}
            defaultValue={default_value}
            tooltip={label_tooltip}
            inherited_field={inherited_field}
            isInGrid
            {...formFieldProps}
          />
        );
      }

      case ControlType.RADIO_BUTTONS: {
        if (!isInGrid) {
          if (!enabled) return null;
          if (!REQUIRED && props.showRequiredOnly) return null;
        }

        return (
          <FormRadio
            name={name}
            label={label}
            options={Array.isArray(options) ? options : []}
            disabled={disabled || props.viewOnly}
            required={REQUIRED}
            defaultValue={`${default_value}`}
            vertical={props.vertical}
            tooltip={label_tooltip}
            isInGrid
            {...formFieldProps}
          />
        );
      }

      case ControlType.CALENDAR_PICKER: {
        if (!isInGrid) {
          if (!enabled) return null;
          if (!REQUIRED && props.showRequiredOnly) return null;
        }

        return (
          <FormCalendar
            name={name}
            label={label}
            disabled={disabled || props.viewOnly}
            required={REQUIRED}
            vertical={props.vertical}
            tooltip={label_tooltip}
            isInGrid
            {...formFieldProps}
          />
        );
      }

      case ControlType.TOGGLE: {
        if (!isInGrid) {
          if (!enabled) return null;
          if (!REQUIRED && props.showRequiredOnly) return null;
        }
        return (
          <FormSwitch
            name={name}
            label={label}
            vertical={props.vertical}
            disabled={disabled || props.viewOnly}
            tooltip={label_tooltip}
            isInGrid
            {...formFieldProps}
          />
        );
      }

      case ControlType.FILE_UPLOADER: {
        return (
          <FormFileUploader
            name={name}
            label={label}
            maxSize={FILE_SIZE ? Number(FILE_SIZE) : undefined}
            fileTypes={FORMAT_FILE}
            request={(info) => {
              const { file, onError, onProgress, onSuccess } = info;
              const requestOptions = requestOptionsLookup[dynamicType];

              mutateAsync({
                data: {
                  ...requestOptions,
                  employee_id: isEmployee(dynamicData)
                    ? dynamicData.employee_id.toString()
                    : undefined,
                  field_id: props.id.toString(),
                  file,
                },
                config: {
                  onUploadProgress: onProgress,
                },
              })
                .then((res) => {
                  onSuccess?.(res.data);
                })
                .catch(onError);
            }}
            isInGrid
            {...formFieldProps}
          />
        );
      }
      default:
        return null;
    }
  }, [
    extracted_attributes,
    t,
    props,
    extractedRules,
    isInGrid,
    requiredByParent,
    visibleByParentValues,
    formFieldProps,
    dynamicType,
    mutateAsync,
    dynamicData,
    isUneditableByRole,
    forcedDisabled,
    disableAll,
    ignoreRules,
    namePrefix,
    compareMode,
    visibleFieldMap,
  ]);

  return <>{renderedComponent}</>
}
