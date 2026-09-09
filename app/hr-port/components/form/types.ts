import { FormLayoutProps } from "./form-layout/form-layout"

export type FormFieldProps = {
  className?: string
  isInGrid?: boolean
  label?: string
  layoutProps?: FormLayoutProps
  name: string
  required?: boolean
  tooltip?: string
  vertical?: boolean
  viewOnly?: boolean
}

export type FieldAttribute = {
  id: number
  key: string
  value: {
    data: string[]
  }
}

export type FieldRule = {
  data: {
    data: any[]
  }
  id: number
  type: string
}
