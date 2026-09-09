import { ApiResult, MetadataError, SelectOption } from "~/hr-port/types/common"

export type GetSelectOptionsParams<T extends Record<string, any>> = {
  data: T[]
  fallbackLabelAccessor?: keyof T | string
  labelAccessor?: keyof T | string
  valueAccessor?: keyof T | string
}

export const getSelectOptions = <T extends Record<string, any>>({
  data,
  labelAccessor = "label",
  valueAccessor = "value",
  fallbackLabelAccessor,
}: GetSelectOptionsParams<T>) => {
  return data.map(
    (item) =>
      ({
        ...item,
        value: `${item[valueAccessor]}`,
        label: `${item[labelAccessor] ?? (fallbackLabelAccessor ? item[fallbackLabelAccessor] : "")}`,
      }) satisfies SelectOption
  )
}

export function isData<T>(data: ApiResult<T>): data is T {
  return (
    data !== null &&
    data !== undefined &&
    !(typeof data === "object" && "errors" in data)
  )
}

export function isMetadataError<T>(
  data: ApiResult<T>
): data is { errors: MetadataError[] } {
  return (
    data !== null &&
    data !== undefined &&
    typeof data === "object" &&
    "errors" in data
  )
}

/**
 * Converts an array into a map using specified key and optional value getters
 *
 * @template T - Type of items in the input array (defaults to object)
 * @template K - Type of values in the resulting map (defaults to any)
 *
 * @param arr - The input array to convert into a map
 * @param keyGetter - Either a property key of T or a function that derives a key from an item
 * @param valueGetter - Optional function to transform the values in the resulting map
 *
 * @returns A record/object where keys are determined by keyGetter and values are either
 *          the original items or transformed by valueGetter if provided
 *
 * @example
 * // Using a property key
 * const users = [{ id: 1, name: 'John' }, { id: 2, name: 'Jane' }];
 * const userMap = getMapFromArray(users, 'id');
 * // Result: { '1': { id: 1, name: 'John' }, '2': { id: 2, name: 'Jane' } }
 *
 * @example
 * // Using value transformer
 * const users = [{ id: 1, name: 'John' }, { id: 2, name: 'Jane' }];
 * const nameMap = getMapFromArray(users,
 *   'id',
 *   user => user.name
 * );
 * // Result: { '1': 'John', '2': 'Jane' }
 */
export function getMapFromArray<T = object>(
  arr: T[],
  keyGetter: keyof T | ((item: T) => any)
): Record<string, T>

export function getMapFromArray<T = object, K = any>(
  arr: T[],
  keyGetter: keyof T | ((item: T) => any),
  valueGetter: (item: T) => K
): Record<string, K>

export function getMapFromArray<T = object, K = any>(
  arr: T[],
  keyGetter: keyof T | ((item: T) => any),
  valueGetter?: (item: T) => K
) {
  return arr.reduce(
    (prev, item) => {
      const key =
        typeof keyGetter === "function" ? keyGetter(item) : item[keyGetter]
      if (typeof valueGetter === "function") prev[key] = valueGetter(item)
      else prev[key] = item
      return prev
    },
    {} as Record<string, T | K>
  )
}

export type Primitive = number | string | symbol

export function getMapFromPrimitiveArray<T extends Primitive>(
  arr: T[]
): Record<T, T>

export function getMapFromPrimitiveArray<T extends Primitive, K = any>(
  arr: T[],
  valueGetter: (item: T) => K
): Record<T, K>

export function getMapFromPrimitiveArray<T extends Primitive, K = any>(
  arr: T[],
  valueGetter?: (item: T) => K
) {
  return arr.reduce(
    (prev, item) => {
      if (typeof valueGetter === "function") prev[item] = valueGetter(item)
      else prev[item] = item
      return prev
    },
    {} as Record<T, T | K>
  )
}
