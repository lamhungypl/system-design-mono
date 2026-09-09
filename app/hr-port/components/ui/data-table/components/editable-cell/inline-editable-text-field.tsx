import { useComposedRefs } from "@radix-ui/react-compose-refs"
import React, {
  Fragment,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react"
import { ControllerRenderProps } from "react-hook-form"

import AppInput, {
  AppInputProps,
} from "~/hr-port/components/ui/app-input/app-input"
import InlineEdit, {
  InlineEditCommonProps,
  InlineEditProps,
} from "~/hr-port/components/ui/inline-edit/inline-edit"
import PrivateCurrency from "~/hr-port/components/ui/private-currency/private-currency"
import TruncatedText from "~/hr-port/components/ui/truncated-text/truncated-text"
import { cn } from "~/hr-port/utils/style"

export type InlineEditableTextfieldProps = {
  disableEdit?: boolean
  onConfirm: (value: string) => void
  readViewValue:
    | string
    | ((props?: {
        onResetValue?: () => void
        setIsEditing?: () => void
      }) => React.ReactNode)
  slotProps?: {
    readView?: React.ComponentProps<"div">
  }
} & AppInputProps &
  InlineEditCommonProps

const InlineEditableTextField = (props: InlineEditableTextfieldProps) => {
  const {
    defaultValue,
    readViewValue,
    onCancel: onCancelProp,
    onConfirm,
    slotProps,
    type,
    validate,
    ...rest
  } = props

  const renderEditView = useCallback(
    (field: ControllerRenderProps) => {
      return (
        <InlineEditViewInput
          {...props}
          {...field}
          className="w-full max-w-full"
        />
      )
    },
    [props]
  )

  const renderReadView = useMemo(() => {
    return typeof readViewValue === "function"
      ? (props: Parameters<InlineEditProps["readView"]>[0]) =>
          readViewValue(props)
      : () => {
          const Wrapper = type === "money" ? PrivateCurrency : Fragment
          return (
            <div
              {...slotProps?.readView}
              className={cn(
                "line-clamp-1 w-full max-w-full",
                slotProps?.readView?.className
              )}
            >
              <TruncatedText
                text={<Wrapper>{readViewValue}</Wrapper>}
                className="line-clamp-1"
              />
            </div>
          )
        }
  }, [readViewValue, slotProps?.readView, type])

  return (
    <InlineEdit
      {...rest}
      validate={validate}
      onCancel={onCancelProp}
      defaultValue={defaultValue}
      onConfirm={(value) => {
        onConfirm?.(value)
      }}
      editView={renderEditView}
      readView={renderReadView}
    />
  )
}

const InlineEditViewInput = React.forwardRef<
  HTMLInputElement,
  AppInputProps & ControllerRenderProps & InlineEditableTextfieldProps
>((props, ref) => {
  const inputRef = useRef<HTMLInputElement>(null)
  const combinedRef = useComposedRefs(ref, inputRef)
  const [selectOnMount, setSelectOnMount] = useState(false)

  useEffect(() => {
    if (!selectOnMount) {
      const inputEl = inputRef.current
      inputEl?.select()
      setSelectOnMount(true)
    }
  }, [selectOnMount])

  return (
    <AppInput
      {...props}
      ref={combinedRef}
      onClick={(e) => e.preventDefault()}
    />
  )
})
export default InlineEditableTextField
