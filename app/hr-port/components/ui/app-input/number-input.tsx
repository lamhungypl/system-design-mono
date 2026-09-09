import { ChangeEvent, FocusEvent, forwardRef, useMemo, useState } from "react"

import { useRegionSettingQuery } from "~/hr-port/api/region-setting/region-setting.query"
import { Input, InputProps } from "~/hr-port/components/base/input"
import { formatNumber, FormatNumberOptions } from "~/hr-port/utils/money"
import { isData } from "~/hr-port/utils/object"

export type NumberInputProps = {
  defaultValue?: string
  formatNumberOptions?: FormatNumberOptions
  maxValue?: number
  value?: string
} & Omit<InputProps, "prefix" | "type" | "value" | "defaultValue">

const decimalNumberRegex = /^\d*\.?\d*$/
const numberRegex = /^\d*$/

// prettier-ignore
export const NumberInput = forwardRef<HTMLInputElement, NumberInputProps>((props, ref) => { // NOSONAR
  const {
    defaultValue,
    onChange: parentOnChange,
    value: parentValue,
    onBlur: parentOnBlur,
    maxLength,
    maxValue,
    formatNumberOptions,
    ...rest
  } = props;

  const { precision: parentPrecision } = formatNumberOptions ?? {};

  const { data: regionSettingMap } = useRegionSettingQuery();

  const settings = useMemo(() => {
    if (!isData(regionSettingMap))
      return {
        roundingType: null,
        precision: 2,
      };

    return {
      roundingType: regionSettingMap.rounding_mode,
      precision: regionSettingMap.rounding_scale,
    };
  }, [regionSettingMap]);

  const precision = useMemo(() => {
    return parentPrecision === undefined ? settings.precision : parentPrecision;
  }, [parentPrecision, settings.precision]);

  const isControlled = parentValue !== undefined;

  const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue || '');
  const value = isControlled ? parentValue : uncontrolledValue;

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (maxLength !== undefined && value.length > maxLength) return;
    if (precision && !decimalNumberRegex.test(value)) return;
    if (!precision && !numberRegex.test(value)) return;

    parentOnChange?.(e);
    if (!isControlled) setUncontrolledValue(value);
  };

  const onBlur = (e: FocusEvent<HTMLInputElement, Element>) => {
    parentOnBlur?.(e);

    let finalValue = value;
    if (value === '.') finalValue = '0';

    if (maxValue !== undefined && finalValue)
      finalValue = Math.min(Number(finalValue), maxValue).toString();

    const transformedValue = formatNumber(finalValue, {
      ...formatNumberOptions,
      precision,
    });

    e.target.value = transformedValue;
    parentOnChange?.(e);
    parentOnBlur?.(e);
    if (!isControlled) setUncontrolledValue(transformedValue);
  };

  return <Input ref={ref} value={value} onChange={onChange} onBlur={onBlur} {...rest} />;
});
