import {
  ChangeEvent,
  FocusEvent,
  forwardRef,
  useEffect,
  useMemo,
  useState,
} from "react"

import { useRegionSettingQuery } from "~/hr-port/api/region-setting/region-setting.query"
import { Input, InputProps } from "~/hr-port/components/base/input"
import {
  formatCurrency,
  FormatCurrencyOptions,
  reverseFormatCurrency,
} from "~/hr-port/utils/money"
import { isData } from "~/hr-port/utils/object"

export type MoneyInputProps = {
  defaultValue?: string
  formatCurrencyOptions?: FormatCurrencyOptions
  maxValue?: number
  value?: string
} & Omit<InputProps, "prefix" | "type" | "value" | "defaultValue">

const decimalNumberRegex = /^\d*\.?\d*$/

// prettier-ignore
export const MoneyInput = forwardRef<HTMLInputElement, MoneyInputProps>((props, ref) => { // NOSONAR
  const {
    defaultValue,
    onChange: parentOnChange,
    value: parentValue,
    onBlur: parentOnBlur,
    maxLength,
    maxValue,
    formatCurrencyOptions,
    ...rest
  } = props;

  const { roundingType: parentRoundingType, precision: parentPrecision } =
    formatCurrencyOptions ?? {};

  const { data: regionSettingMap } = useRegionSettingQuery();

  const settings = useMemo(() => {
    if (!isData(regionSettingMap))
      return {
        roundingType: null,
        precision: undefined,
      };

    return {
      roundingType: regionSettingMap.rounding_mode,
      precision: regionSettingMap.rounding_scale,
    };
  }, [regionSettingMap]);

  const roundingType = useMemo(() => {
    return parentRoundingType === undefined ? settings.roundingType : parentRoundingType;
  }, [parentRoundingType, settings.roundingType]);

  const precision = useMemo(() => {
    return parentPrecision === undefined ? settings.precision : parentPrecision;
  }, [parentPrecision, settings.precision]);

  const isControlled = parentValue !== undefined;

  const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue || '');
  const value = isControlled ? parentValue : uncontrolledValue;
  const [displayedValue, setDisplayedValue] = useState('');

  const [isFocus, setIsFocus] = useState(false);

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (maxLength !== undefined && value.length > maxLength) return;
    if (!decimalNumberRegex.test(value)) return;

    parentOnChange?.(e);
    if (!isControlled) setUncontrolledValue(value);
  };

  const onBlur = (e: FocusEvent<HTMLInputElement, Element>) => {
    parentOnBlur?.(e);
    setIsFocus(false);

    let finalValue = value;
    if (value === '.') finalValue = '0';

    if (maxValue !== undefined && finalValue)
      finalValue = Math.min(Number(finalValue), maxValue).toString();

    const formattedValue = formatCurrency(finalValue, {
      ...formatCurrencyOptions,
      roundingType,
      precision,
      maskString: undefined,
    });

    const transformedValue = reverseFormatCurrency(formattedValue);
    e.target.value = transformedValue;
    parentOnChange?.(e);
    parentOnBlur?.(e);
    if (!isControlled) setUncontrolledValue(transformedValue);
  };

  useEffect(() => {
    const formattedValue = formatCurrency(value, {
      ...formatCurrencyOptions,
      roundingType,
      precision,
    });
    setDisplayedValue(formattedValue);
  }, [value, roundingType, precision, formatCurrencyOptions]);

  return (
    <Input
      ref={ref}
      onFocus={() => setIsFocus(true)}
      value={isFocus ? value : displayedValue}
      onChange={onChange}
      onBlur={onBlur}
      // onKeyDown={(e) => {
      //   const key = e.key;
      //   const isAllowed = allowedCharacterRegex.test(key) || allowedNavigationKeys.includes(key);
      //   if (!isAllowed) {
      //     e.preventDefault();
      //   }
      // }}
      {...rest}
    />
  );
});
