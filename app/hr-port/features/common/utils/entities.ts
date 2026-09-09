type FieldConfigFormat = {
  key: string
  label: string
  transformValue?: (value: any, entity?: any) => string
  /**
   * @field `itemObject[key]` or the transformed result
   */
  value: number | string
}

export type FieldConfig<T extends keyof any> = {
  [key in T]: FieldConfigFormat
}

export type FieldWithFormatConfig<
  T extends keyof any,
  F = FieldConfigFormat,
> = {
  [key in T]: F
}
