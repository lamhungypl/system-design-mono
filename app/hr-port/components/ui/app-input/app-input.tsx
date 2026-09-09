import { Cross2Icon } from "@radix-ui/react-icons"
import clsx from "clsx"
import { forwardRef, ReactNode, useState } from "react"

import { Input, InputProps } from "~/hr-port/components/base/input"
import {
  NumberInput,
  NumberInputProps,
} from "~/hr-port/components/ui/app-input/number-input"
import { cn } from "~/hr-port/utils/style"

import { MoneyInput, MoneyInputProps } from "./money-input"

export type AppInputProps = {
  allowClear?: boolean
  defaultValue?: string
  maxValue?: number
  prefix?: ReactNode
  suffix?: ReactNode
  type?: InputProps["type"] | "money"
  value?: string
  wrapperClassName?: string
} & MoneyInputProps &
  NumberInputProps &
  Omit<InputProps, "prefix" | "type" | "value" | "defaultValue">

// prettier-ignore
export const AppInput = forwardRef<HTMLInputElement, AppInputProps>((props, ref) => { // NOSONAR
  const {
    wrapperClassName,
    className,
    prefix,
    suffix,
    allowClear,
    defaultValue,
    onChange: parentOnChange,
    value: parentValue,
    type,
    ...rest
  } = props;

  const isControlled = parentValue !== undefined;
  const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue || '');

  const value = isControlled ? parentValue : uncontrolledValue;

  return (
    <div className={cn('relative flex-1', clsx(wrapperClassName))}>
      {!!prefix && (
        <span className='absolute left-3 top-1/2 inline-flex h-4 w-4 -translate-y-1/2 items-center text-inherit'>
          {prefix}
        </span>
      )}
      {type === 'money' && (
        <MoneyInput
          ref={ref}
          maxLength={255}
          {...rest}
          className={cn(
            'text-xs',
            clsx({
              'pl-9': !!prefix,
              'pr-9': !!suffix || (allowClear && !!value),
              'pr-12': !!suffix && allowClear && !!value,
            }),
            className
          )}
          value={value}
          onChange={(e) => {
            if (parentOnChange) parentOnChange(e);
            if (!isControlled) setUncontrolledValue(e.target.value);
          }}
        />
      )}
      {type === 'number' && (
        <NumberInput
          ref={ref}
          maxLength={255}
          {...rest}
          className={cn(
            'text-xs',
            clsx({
              'pl-9': !!prefix,
              'pr-9': !!suffix || (allowClear && !!value),
              'pr-12': !!suffix && allowClear && !!value,
            }),
            className
          )}
          value={value}
          onChange={(e) => {
            if (parentOnChange) parentOnChange(e);
            if (!isControlled) setUncontrolledValue(e.target.value);
          }}
        />
      )}
      {type !== 'money' && type !== 'number' && (
        <Input
          maxLength={255}
          {...rest}
          ref={ref}
          className={cn(
            'text-xs',
            clsx({
              'pl-9': !!prefix,
              'pr-9': !!suffix || (allowClear && !!value),
              'pr-12': !!suffix && allowClear && !!value,
            }),
            className
          )}
          value={value}
          onChange={(e) => {
            if (parentOnChange) parentOnChange(e);
            if (!isControlled) setUncontrolledValue(e.target.value);
          }}
          type={type}
        />
      )}
      <div
        className={cn(
          'absolute right-3 top-1/2 inline-flex -translate-y-1/2 items-center text-xs text-inherit',
          'gap-1'
        )}
      >
        {allowClear && !!value && (
          <Cross2Icon
            className='h-4 w-4 cursor-pointer text-muted-foreground'
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => {
              if (parentOnChange) parentOnChange({ target: { value: '' } } as any);
              if (!isControlled) setUncontrolledValue('');
            }}
          />
        )}
        {!!suffix && <span>{suffix}</span>}
      </div>
    </div>
  );
});
AppInput.displayName = "AppInput"
export default AppInput
