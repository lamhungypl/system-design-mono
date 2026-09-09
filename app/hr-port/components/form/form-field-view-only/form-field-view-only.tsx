import { ReactNode } from "react"
import { useFormContext, useWatch } from "react-hook-form"

import {
  FormControl,
  FormField,
  FormItem,
} from "~/hr-port/components/base/form"
import { FormFieldProps } from "~/hr-port/components/form/types"
import TruncatedText from "~/hr-port/components/ui/truncated-text/truncated-text"
import { cn } from "~/hr-port/utils/style"

export type FormFieldViewOnlyProps = {
  required?: boolean
  transformValue?: (value: any) => ReactNode
} & FormFieldProps
const FormFieldViewOnly = (props: FormFieldViewOnlyProps) => {
  const { name, label, required, transformValue, isInGrid } = props

  const methods = useFormContext()
  const { control } = methods
  const value = useWatch({ name, control })

  if (isInGrid) {
    return (
      <TruncatedText
        text={transformValue?.(value) ?? value}
        className="line-clamp-1"
      />
    )
  }

  return (
    <FormField name={name}>
      <div>
        <FormItem className="gap-3">
          {label && (
            <span
              className={cn(
                "w-[19%] text-xs font-medium break-words text-[#5F656A]",
                {
                  "red-asterisk": required,
                }
              )}
            >
              {label}
            </span>
          )}
          <FormControl className="flex-1">
            <span className="text-xs font-normal text-foreground">
              {transformValue?.(value) ?? value}
            </span>
          </FormControl>
        </FormItem>
      </div>
    </FormField>
  )
}

export default FormFieldViewOnly
