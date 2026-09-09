import { ErrorMessage } from "@hookform/error-message"
import { zodResolver } from "@hookform/resolvers/zod"
import { useControllableValue } from "ahooks"
import { memo, ReactNode, useCallback, useRef, useState } from "react"
import { ControllerRenderProps, FormProvider, useForm } from "react-hook-form"
import { z } from "zod"

import { FormField, FormFieldController } from "~/hr-port/components/base/form"
import EditView from "~/hr-port/components/ui/inline-edit/edit-view"
import ReadView from "~/hr-port/components/ui/inline-edit/read-view"

export type InlineEditCommonProps = {
  defaultValue: any
  editable?: boolean
  editButtonLabel?: string
  editLabel?: string
  hideActionButtons?: boolean
  isRequired?: boolean
  label?: ReactNode
  onCancel?: () => void
  readViewFitContainerWidth?: boolean
  startWithEditViewOpen?: boolean
  testId?: string
  tooltip?: ReactNode
  validate?: z.ZodTypeAny
}

const getSchema = (validate?: z.ZodTypeAny) => {
  return z.object({ inlineEdit: validate ?? z.any() })
}

type FormValues = z.infer<ReturnType<typeof getSchema>>

export type InlineEditProps = {
  editView: (fieldProps: ControllerRenderProps) => React.ReactNode
  isEditing?: boolean
  onConfirm: (value: any) => void
  onEdit?: () => void
  readView: (props?: {
    onResetValue?: () => void
    setIsEditing?: () => void
  }) => React.ReactNode
} & InlineEditCommonProps

const InlineEdit = (props: InlineEditProps) => {
  const {
    editable = true,
    startWithEditViewOpen = false,
    onConfirm: onConfirmProp,
    onCancel: onCancelProp,
    onEdit: onEditProp,
    editView: renderEditView,
    readView: renderReadView,
    tooltip,
    validate,
  } = props
  const buttonRef = useRef<HTMLButtonElement>(null)
  const [isResetValue, setIsResetValue] = useState(false)
  const methods = useForm({
    mode: "onBlur",
    resolver: zodResolver(getSchema(validate)),
  })
  const {
    formState: { errors },
  } = methods
  const [isEditing, setEditingState] = useControllableValue(props, {
    valuePropName: "isEditing",
    defaultValuePropName: "startWithEditViewOpen",
    defaultValue: startWithEditViewOpen,
  })

  const onCancel = useCallback(() => {
    setEditingState(false)
    if (isResetValue) {
      methods.setValue("inlineEdit", props.defaultValue)
    }
    onCancelProp?.()
  }, [onCancelProp, setEditingState, methods, props.defaultValue, isResetValue])

  const onEdit = useCallback(() => {
    if (editable) {
      setEditingState(true)
      onEditProp?.()
    }
  }, [editable, setEditingState, onEditProp])

  const onConfirm = useCallback(
    (value: string) => {
      setEditingState(false)
      onConfirmProp?.(value)
    },
    [onConfirmProp, setEditingState]
  )

  const onResetValue = useCallback(() => {
    setIsResetValue(true)
    methods.reset({ inlineEdit: "" })
  }, [methods])

  return (
    <FormProvider {...methods}>
      <form
        autoComplete="off"
        noValidate
        onSubmit={methods.handleSubmit((values: FormValues) => {
          onConfirm(values.inlineEdit)
        })}
        className="w-full flex-1"
      >
        {isEditing ? (
          <FormFieldController
            name="inlineEdit"
            key="edit-view"
            render={({ field: fieldProps }) => {
              return (
                <>
                  <button hidden ref={buttonRef} type="submit" />
                  <EditView
                    onCancel={() => {
                      methods.reset()
                      onCancel()
                    }}
                    onSubmit={() => {
                      buttonRef.current?.click()
                    }}
                  >
                    <div className="relative">
                      {renderEditView?.(fieldProps)}
                      <ErrorMessage
                        errors={errors}
                        name="inlineEdit"
                        render={({ message }) => (
                          <p className="text-xxs text-action-red">{message}</p>
                        )}
                      />
                    </div>
                  </EditView>
                </>
              )
            }}
          />
        ) : (
          <FormField name="inlineEdit" key="read-view">
            <ReadView
              editable={editable}
              onEditRequested={onEdit}
              readView={renderReadView({ setIsEditing: onEdit, onResetValue })}
              tooltip={tooltip}
            />
          </FormField>
        )}
      </form>
    </FormProvider>
  )
}

export default memo(InlineEdit)
