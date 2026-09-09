import { FieldWithFormatConfig } from "~/hr-port/features/common/utils/entities"

export const uniqArrayBy = <TData extends Record<string, any>>(
  arr: TData[],
  key: keyof TData & string
) => {
  const hashedList = new Map<string, TData>(
    Object.entries(
      arr.reduce(
        (hash, current) => {
          hash[key] = current
          return hash
        },
        {} as Record<string, TData>
      )
    )
  )
  return Array.from(hashedList.values())
}

export const uniqArray = <T extends number | string>(arr: T[]) => {
  const valueSet = new Set(arr)
  return Array.from(valueSet.values())
}

export const alphabeticalSort = (a: string, b: string) => {
  return a.localeCompare(b)
}

export const sortByKeys = <T extends Record<string, any>>(
  keys: Array<keyof T>
) => {
  return (a: T, b: T) => {
    return keys.reduce((acc, key) => {
      return acc || a?.[key]?.localeCompare?.(b?.[key])
    }, 0)
  }
}

export const narrowArray = <T, U>(value: T[] | U): value is T[] => {
  return Array.isArray(value)
}

export const convertObjectToKeyValueMapping = <
  T extends Record<string, any>,
  F extends Record<string, any>,
>(
  obj: T,
  valueName = "value" as keyof F,
  labelName = "label" as keyof F
) => {
  return Object.entries(obj).reduce(
    (configs, [key]) => {
      configs[key as keyof T] = {
        [valueName]: key,
        [labelName]: obj[key],
      } as F
      return configs
    },
    {} as FieldWithFormatConfig<keyof T, F>
  )
}

/**
 * @description convert an object to array of its keys subsequence
 *
 * @param obj
 * @param keys
 * @param options passing explicit name to get TS infer the correct option type (F), otherwise F = Record<string,any>
 *
 * @returns An array of objects where each object contains the key and value from the source object,
 *          mapped to the specified labelKey and valueKey properties
 *
 * @example
 * ```typescript
 * // Basic usage with default keys (value/label)
 * const colors = {
 *   red: '#FF0000',
 *   blue: '#0000FF'
 * };
 *
 * convertObjectToArrayOption(colors, ['red', 'blue']);
 * // Result:
 * // [
 * //   { value: 'red', label: '#FF0000' },
 * //   { value: 'blue', label: '#0000FF' }
 * // ]
 *
 * // Usage with custom keys
 * convertObjectToArrayOption(
 *   colors,
 *   ['red', 'blue'],
 *   { valueKey: 'code', labelKey: 'color' }
 * );
 * // Result:
 * // [
 * //   { code: 'red', color: '#FF0000' },
 * //   { code: 'blue', color: '#0000FF' }
 * // ]
 */
export const convertObjectToArrayOption = <
  T extends Record<string, any>,
  F extends Record<string, any>,
>(
  obj: T,
  keys: Array<keyof T>,

  options?: {
    labelKey: keyof F
    valueKey: keyof F
  }
) => {
  const valueName = options?.valueKey || "value"
  const labelName = options?.labelKey || "label"
  const configs = convertObjectToKeyValueMapping(obj, valueName, labelName)

  return keys.map((el) => configs[el]).filter(Boolean)
}
