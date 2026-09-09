import { CellContext, ColumnDef } from "@tanstack/react-table"
import { Fragment, useMemo, useState } from "react"
import { useFieldArray, useFormContext } from "react-hook-form"
import { useTranslation } from "react-i18next"

import { ReactComponent as AddCircle } from "~/hr-port/assets/svgs/add-circle-3.svg"
import { ReactComponent as DeleteCircle } from "~/hr-port/assets/svgs/delete-circle.svg"
import { AppEditIcon, AppTrashIcon } from "~/hr-port/assets/svgs/icons/Icon"
import { Button } from "~/hr-port/components/base/button"
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/hr-port/components/base/form"
import AddEditDataTableItemDialog, {
  AddEditDataTableItemDialogProps,
} from "~/hr-port/components/form/form-data-table/add-data-table-item-dialog"
import { isGridError } from "~/hr-port/components/form/form-data-table/utils"
import { FormFieldProps } from "~/hr-port/components/form/types"
import { useAppDialog } from "~/hr-port/components/ui/app-dialog/hooks/use-app-dialog"
import { COLUMN_ID } from "~/hr-port/components/ui/data-table/constants"
import DataTable, {
  AppTableProps,
} from "~/hr-port/components/ui/data-table/DataTable"
import IconButton from "~/hr-port/components/ui/icon-button/icon-button"
import { gridFieldArrayKey } from "~/hr-port/features/dynamic-form/constants"
import {
  Field,
  GridValue,
  GridValues,
} from "~/hr-port/features/dynamic-form/types"
import {
  newDataIdPrefix,
  oldDataIdPrefix,
} from "~/hr-port/features/hr-settings/employee-change-profile-request-approvals/constant"
import FormDynamicField from "~/hr-port/features/profiles/components/form-dynamic-field/form-dynamic-field"
import {
  invisibleIdPrefix,
  tempNullIdPrefix,
} from "~/hr-port/features/profiles/constants"
import { toast } from "~/hr-port/hooks/lib/use-toast"
import { cn } from "~/hr-port/utils/style"
/**
 * Type of data is the type of fieldArray items
 */
type Data = GridValue & Record<typeof gridFieldArrayKey, string>

type Props = {
  buttonText?: string
  compareMode?: boolean
  editable?: boolean
  emptyRowData: Record<string, any>
  gridColumns?: Field[]
} & FormFieldProps &
  Partial<AppTableProps<Data>>

const FormDataTable = (props: Props) => {
  const {
    name,
    label,
    gridColumns,
    buttonText: itemText,
    editable,
    compareMode,
    ...tableProps
  } = props
  const { t } = useTranslation()
  const { openAppDialog } = useAppDialog()
  const methods = useFormContext()
  const {
    control,
    getValues,
    formState: { errors },
  } = methods
  const { fields, remove, update, prepend } = useFieldArray({
    name,
    control,
    keyName: gridFieldArrayKey,
  })

  const isNewData = useMemo(() => {
    return compareMode && name.includes(newDataIdPrefix)
  }, [name, compareMode])

  const oldData = useMemo(() => {
    if (!compareMode) return null
    if (!isNewData) return null
    const oldDataId = `${oldDataIdPrefix}${name.replace(newDataIdPrefix, "")}`
    return getValues(oldDataId) as GridValues
  }, [compareMode, getValues, isNewData, name])

  const newData = useMemo(() => {
    if (!compareMode) return null
    if (isNewData) return null
    const newDataId = `${newDataIdPrefix}${name.replace(oldDataIdPrefix, "")}`
    return getValues(newDataId) as GridValues
  }, [compareMode, getValues, isNewData, name])

  const columnSettings = useMemo(() => {
    const columnSettings: Field[] = gridColumns || []
    return columnSettings
  }, [gridColumns])

  const [addEditDialogProps, setAddEditDialogProps] =
    useState<AddEditDataTableItemDialogProps>({
      open: false,
      columnSettings,
      onSubmit: () => {},
      title: "",
      setOpen: (open: boolean) => {
        setAddEditDialogProps((prev) => ({ ...prev, open }))
      },
    })

  const columnsFromSettings = useMemo(() => {
    return columnSettings.map((item, index) => {
      const renderHeader = () => (
        <p className="text-xs font-bold text-foreground">
          {t(item.i18n_label)}
        </p>
      )
      const renderCell = ({ row }: CellContext<Data, unknown>) => {
        if (!compareMode)
          return (
            <FormDynamicField
              key={item.id}
              {...item}
              isInGrid
              formFieldProps={{
                viewOnly: true,
                name: `${name}.${row.index}.${item.id}`,
                label: "",
              }}
            />
          )

        if (!isNewData) {
          const isInvisibleRow =
            row.original.entity_data_id.includes(invisibleIdPrefix)
          if (isInvisibleRow)
            return (
              <div className="pointer-events-none opacity-0">
                invisible cell
              </div>
            )
          const isDelete = !!newData?.[row.index]?.delete_flg
          const isUpdate =
            !isDelete &&
            newData?.[row.index]?.[item.id] !== row.original[item.id]
          return (
            <div
              className={cn({
                "edited-cell": isUpdate,
              })}
            >
              <FormDynamicField
                key={item.id}
                {...item}
                isInGrid
                formFieldProps={{
                  viewOnly: true,
                  name: `${name}.${row.index}.${item.id}`,
                  label: "",
                }}
              />
            </div>
          )
        }
        const isAddNew = row.original.entity_data_id.includes(tempNullIdPrefix)
        const isDelete = !!row.original.delete_flg
        const isUpdate =
          !isAddNew &&
          !isDelete &&
          oldData?.[row.index]?.[item.id] !== row.original[item.id]
        return (
          <div
            className={cn({
              "text-action-green": isAddNew,
              "text-action-red": isDelete,
              "edited-cell": isUpdate,
            })}
          >
            <FormDynamicField
              key={item.id}
              {...item}
              isInGrid
              formFieldProps={{
                viewOnly: true,
                name: `${name}.${row.index}.${item.id}`,
                label: "",
              }}
            />
          </div>
        )
      }

      return {
        id: item.id.toString() || `item.id-${index}`,
        maxSize: 250,
        header: renderHeader,
        cell: renderCell,
      } satisfies ColumnDef<Data>
    })
  }, [columnSettings, name, compareMode, oldData, isNewData, newData, t])

  const columns = useMemo<ColumnDef<Data>[]>(() => {
    const renderCompareStatusCell = ({ row }: CellContext<Data, unknown>) => {
      const isAddNew = row.original.entity_data_id.includes(tempNullIdPrefix)
      const isDelete = !!row.original.delete_flg
      return (
        <div>
          {isAddNew && <AddCircle />}
          {isDelete && <DeleteCircle />}
        </div>
      )
    }

    const renderActionCell = ({ row }: CellContext<Data, unknown>) => {
      const rowValues = getValues(`${name}.${row.index}`)
      return (
        <div className="flex justify-center">
          <div className="grid grid-cols-[repeat(2,1.5rem)]">
            <IconButton
              onClick={() => {
                openAppDialog("AppConfirmDeleteDialog", {
                  onSubmit: () => {
                    remove(row.index)
                  },
                })
              }}
            >
              <AppTrashIcon />
            </IconButton>
            <IconButton
              onClick={() => {
                setAddEditDialogProps((prev) => ({
                  ...prev,
                  open: true,
                  title: t(`common.dynamic_table.edit`, { itemText }),
                  defaultValues: rowValues,
                  onSubmit: (values?: Record<string, any>) => {
                    update(row.index, { ...row.original, ...values })
                  },
                }))
              }}
            >
              <AppEditIcon />
            </IconButton>
          </div>
        </div>
      )
    }

    const renderActionHeader = () => (
      <div className="flex-1 text-center">
        {t("common.table.columns.action")}
      </div>
    )

    return [
      ...(compareMode && isNewData
        ? [
            {
              id: COLUMN_ID.COMPARE_STATUS,
              maxSize: 32,
              cell: renderCompareStatusCell,
            } satisfies ColumnDef<Data>,
          ]
        : []),
      ...columnsFromSettings,
      ...(editable
        ? [
            {
              id: COLUMN_ID.ACTION,
              size: 120,
              header: renderActionHeader,
              cell: renderActionCell,
            } satisfies ColumnDef<Data>,
          ]
        : []),
    ]
  }, [
    columnsFromSettings,
    editable,
    remove,
    getValues,
    name,
    itemText,
    openAppDialog,
    update,
    t,
    compareMode,
    isNewData,
  ])

  const topToolbar = useMemo(() => {
    if (!editable) return null
    return (
      <Button
        variant="action"
        onClick={() => {
          setAddEditDialogProps((prev) => ({
            ...prev,
            open: true,
            title: t("common.dynamic_table.add", {
              itemText,
            }),
            onSubmit: (values) => {
              prepend(values)
              toast({
                variant: "success",
                title: t("common.toast_messages.success.title"),
                description: t("common.toast_messages.success.added"),
              })
            },
          }))
        }}
      >
        {t("common.dynamic_table.add", { itemText })}
      </Button>
    )
  }, [itemText, editable, prepend, t])

  return (
    <>
      <FormField name={name}>
        {isGridError(errors[name])
          ? errors[name].map((rowItemError, index) => {
              const allRowItemMsg = Object.entries(rowItemError ?? {}).map(
                ([, fieldError]) => fieldError?.message
              )
              return (
                // prettier-ignore
                <Fragment key={index}> {/* NOSONAR */}
                {allRowItemMsg.map((msg, index) => (
                  <FormMessage key={index}>{msg?.toString()}</FormMessage> // NOSONAR
                ))}
              </Fragment>
              )
            })
          : null}
        <FormItem>
          {label && <FormLabel>{label}</FormLabel>}
          <FormControl>
            <DataTable
              {...tableProps}
              initialState={{
                columnPinning: {
                  right: [COLUMN_ID.ACTION],
                },
              }}
              topToolbar={topToolbar}
              columns={columns}
              data={(fields as Data[]) || []}
              getRowId={(row) => row.fieldId}
            />
          </FormControl>
        </FormItem>
      </FormField>
      <AddEditDataTableItemDialog {...addEditDialogProps} />
    </>
  )
}

export default FormDataTable
