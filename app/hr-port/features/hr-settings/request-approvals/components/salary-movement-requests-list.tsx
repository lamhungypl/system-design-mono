import { useQueryClient } from "@tanstack/react-query"
import { CellContext, createColumnHelper, Table } from "@tanstack/react-table"
// PORT: FilterProps comes from the port's own data-table types (see types.ts).
import { FilterProps } from "~/hr-port/components/ui/data-table/types"
import { useCallback, useEffect, useMemo, useRef } from "react"
import { useTranslation } from "react-i18next"
import { Link } from "react-router"

import { useUserQuery } from "~/hr-port/api/user/user.query"
import { Button } from "~/hr-port/components/base/button"
import { useAppDialog } from "~/hr-port/components/ui/app-dialog/hooks/use-app-dialog"
import InlineEditableTextField from "~/hr-port/components/ui/data-table/components/editable-cell/inline-editable-text-field"
import { COLUMN_ID } from "~/hr-port/components/ui/data-table/constants"
import DataTable, {
  AppTableProps,
} from "~/hr-port/components/ui/data-table/DataTable"
import ColumnsFiltersList from "~/hr-port/components/ui/data-table/filters/ColumnsFiltersList"
import { FilterCalendar } from "~/hr-port/components/ui/data-table/filters/FilterCalendar"
import FilterMultiSelect from "~/hr-port/components/ui/data-table/filters/FitlerMultiSelect"
import GlobalFilterTextField from "~/hr-port/components/ui/data-table/filters/GlobalFilterTextField"
import useAppTableParams from "~/hr-port/components/ui/data-table/hooks/use-app-table-params"
import PrivateCurrency from "~/hr-port/components/ui/private-currency/private-currency"
import TruncatedText from "~/hr-port/components/ui/truncated-text/truncated-text"
import {
  CurrencyByRegion,
  EmitterEvent,
  QueryKey,
  RoundingType,
} from "~/hr-port/constants"
import { NON_BREAKING_SPACE } from "~/hr-port/features/common/constants"
import { formatDateDisplay } from "~/hr-port/features/common/utils/datetime"
import { getPath } from "~/hr-port/features/common/utils/routers"
import { requestApprovalsQueryKeys } from "~/hr-port/features/hr-settings/request-approvals/api/query-keys-factories"
import { useSalaryMovementRequestListQuery } from "~/hr-port/features/hr-settings/request-approvals/api/request-approvals.query"
import {
  REQUEST_APPROVAL_STATUS,
  SalaryMovementRequestItem,
  SalaryMovementRequestListPayload,
  SalaryMovementRequestListResponse,
} from "~/hr-port/features/hr-settings/request-approvals/api/request-approvals.types"
import RequestStatusButton from "~/hr-port/features/hr-settings/request-approvals/components/request-status-button"
import SalaryMovementToolbarActions from "~/hr-port/features/hr-settings/request-approvals/components/salary-movement-toolbar-actions"
import { requestApprovalStatusOptions } from "~/hr-port/features/hr-settings/request-approvals/constants"
import { isFilterDateRangeValid } from "~/hr-port/features/hr-settings/request-approvals/utils"
import { hasPermissions } from "~/hr-port/features/permissions/utils"
import {
  useEditSalaryMovementRemarkMutation,
  useProcessSalaryMovementMutation,
} from "~/hr-port/features/profiles/api/salary-movement/salary-movement.query"
import { ProcessSalaryPayload } from "~/hr-port/features/profiles/api/salary-movement/salary-movement.types"
import { toast } from "~/hr-port/hooks/lib/use-toast"
import { useSubscribeEvent } from "~/hr-port/hooks/use-subscribe-event"
import useSyncAppLoading from "~/hr-port/hooks/use-sync-app-loading"
import { convertToLocalTime } from "~/hr-port/utils/date"
import { formatCurrency } from "~/hr-port/utils/money"
import { cn } from "~/hr-port/utils/style"

const columnHelper = createColumnHelper<SalaryMovementRequestItem>()

const SalaryMovementRequestsList = () => {
  const { t } = useTranslation()
  const queryClient = useQueryClient()
  const { openAppDialog } = useAppDialog()
  const { tableProps, queryParams } = useAppTableParams<
    SalaryMovementRequestItem,
    SalaryMovementRequestListPayload
  >({
    meta: {
      syncWithLocation: true,
    },
  })
  const tableRef = useRef<Table<SalaryMovementRequestItem>>(null)

  const { data: userInfo } = useUserQuery()

  const hasApprovePermission = useMemo(() => {
    return hasPermissions(userInfo?.permission_map, ["APPROVE_SALARY_MOVEMENT"])
  }, [userInfo?.permission_map])

  // queryParams is not typed to include the date-range filter columns.
  const dateFilterParams = queryParams as typeof queryParams & {
    from_date: string
    to_date: string
  }

  const { data: response, isFetching: isFetchingSalaryMovementRequestList } =
    useSalaryMovementRequestListQuery<SalaryMovementRequestListResponse>(
      queryParams,
      {
        // PORT: the source relies on a `@ts-expect-error` above a single-line call to
        // reach the untyped date filter params. Prettier reflows that call, which moves
        // the property accesses out from under the directive, so the widening is done
        // with an explicit cast instead.
        enabled: isFilterDateRangeValid(
          dateFilterParams?.from_date,
          dateFilterParams?.to_date
        ),
      }
    )

  const { mutateAsync: processSalaryMovement } =
    useProcessSalaryMovementMutation()
  const {
    mutateAsync: editSalaryMovementRemark,
    isPending: isPendingEditSalaryMovementRemark,
  } = useEditSalaryMovementRemarkMutation()

  useSubscribeEvent(
    EmitterEvent.SALARY_MOVEMENT_PROCESS,
    (data: ProcessSalaryPayload) => {
      tableRef.current?.setRowSelection((prev) => {
        const nextSelections = { ...prev }
        data.process_salaries.forEach((item) => {
          delete nextSelections[item.request_change_salary_id]
        })
        return nextSelections
      })
    }
  )

  useSyncAppLoading({
    loading: isPendingEditSalaryMovementRemark,
  })

  useEffect(() => {
    response?.data?.content?.forEach((item) => {
      queryClient.setQueryData(requestApprovalsQueryKeys.details(item.id), item)
    })
  }, [queryClient, response])

  const handleEditRemark = useCallback(
    async (row: SalaryMovementRequestItem, _columnId: string, value: any) => {
      await editSalaryMovementRemark({
        id: row.id,
        remark: value,
        last_modified_at: row.last_modified_at,
      })
    },
    [editSalaryMovementRemark]
  )

  const handleProcessSalary = useCallback(
    async (row: SalaryMovementRequestItem, _columnId: string, value: any) => {
      const { remark = "", effective_date } = row
      const actionType = value ? "approval" : "reject"

      await processSalaryMovement(
        {
          approved: !!value,
          process_salaries: [
            {
              effective_date,
              remark,
              request_change_salary_id: Number(row.id),
            },
          ],
        },
        {
          onSuccess: () => {
            const numberSuccess = ""

            toast({
              title: t(`common.toast_messages.success.title`),
              description: t(
                `common.toast_messages.success.${actionType}.salary.information.message`,
                {
                  n: numberSuccess,
                }
              ),
              variant: "success",
            })
          },
          onError: (err) => {
            toast({
              variant: "destructive",
              title: t("common.toast_messages.error.title"),
              description: t(`${err.response.data.metadatas[0].message}`),
            })
          },
        }
      )
    },
    [processSalaryMovement, t]
  )

  const columns = useMemo(() => {
    type CellProps<T = string> = CellContext<SalaryMovementRequestItem, T>

    const renderEmployeeNameCell = (props: CellProps) => {
      const rowData = props.row.original
      const searchParams = new URLSearchParams()
      searchParams.set("sectionId", "salary_info")
      const url = `${getPath("employeeProfile", rowData.employee_id.toString())}?${searchParams.toString()}`
      return (
        <TruncatedText
          className="line-clamp-1 text-xs"
          text={
            <Link to={url} target="_blank" className="hover:underline">
              {rowData.employee_name}
            </Link>
          }
        />
      )
    }

    const renderEffectiveDateCell = ({
      getValue,
    }: CellProps<SalaryMovementRequestItem["effective_date"]>) => {
      const value = getValue()
      return <span className="text-xs">{formatDateDisplay(value)}</span>
    }

    const renderSalaryCell = ({
      getValue,
    }: CellProps<SalaryMovementRequestItem["salary"]>) => {
      const value = getValue() || 0
      return (
        <PrivateCurrency>
          <span className="text-xs">
            {formatCurrency(value.toString(), {
              currency: CurrencyByRegion.THB,
              roundingType: RoundingType.NO_ADJUST,
            })}
          </span>
        </PrivateCurrency>
      )
    }

    const renderStatusCell = ({
      getValue,
    }: CellProps<SalaryMovementRequestItem["status"]>) => {
      const status = getValue()
      return status ? <RequestStatusButton status={status} /> : ""
    }

    const renderStatusFilter = ({ table, column }: FilterProps) => {
      return (
        <FilterMultiSelect
          column={column}
          table={table}
          title={t("hr_request_approvals.salary_movement.table.status")}
          options={requestApprovalStatusOptions(t)}
        />
      )
    }

    const renderCreatedByCell = ({
      getValue,
    }: CellProps<SalaryMovementRequestItem["created_by"]>) => {
      const value = getValue()
      return (
        <TruncatedText
          className="line-clamp-1 text-xs break-all"
          text={value}
        />
      )
    }

    const renderApproverCell = ({
      getValue,
    }: CellProps<SalaryMovementRequestItem["approver"]>) => {
      const value = getValue()
      return (
        <TruncatedText
          className="line-clamp-1 text-xs break-all"
          text={value}
        />
      )
    }

    const renderFromDateFilter = ({ column, table }: FilterProps) => {
      return (
        <FilterCalendar
          column={column}
          table={table}
          title={t("hr_request_approvals.salary_movement.table.effective_date")}
          placeholder={t("common.placeholder.start_date")}
        />
      )
    }

    const renderToDateFilter = ({ column, table }: FilterProps) => {
      return (
        <FilterCalendar
          column={column}
          table={table}
          title={NON_BREAKING_SPACE}
          placeholder={t("common.placeholder.end_date")}
        />
      )
    }

    const renderCreatedAtCell = ({
      getValue,
    }: CellProps<SalaryMovementRequestItem["created_at"]>) => {
      const value = getValue()

      return <span className="text-xs">{convertToLocalTime(value)}</span>
    }

    const renderApprovedByCell = ({
      getValue,
    }: CellProps<SalaryMovementRequestItem["approved_by"]>) => {
      const value = getValue()
      return (
        <TruncatedText
          className="line-clamp-1 text-xs break-all"
          text={value}
        />
      )
    }

    const renderRemarkCell = ({
      getValue,
      row,
      column,
    }: CellProps<SalaryMovementRequestItem["remark"]>) => {
      const value = getValue()

      const disabled = [
        REQUEST_APPROVAL_STATUS.APPROVED,
        REQUEST_APPROVAL_STATUS.REJECTED,
      ].includes(row.original.status)

      return (
        <InlineEditableTextField
          editable={!disabled}
          onConfirm={(value) => {
            if (!disabled) {
              handleEditRemark(row.original, column.id, value)
            }
          }}
          readViewValue={value}
          defaultValue={value}
          tooltip={value}
        />
      )
    }

    const renderActionCell = ({ row, column }: CellProps<unknown>) => {
      const disabled = [
        REQUEST_APPROVAL_STATUS.APPROVED,
        REQUEST_APPROVAL_STATUS.REJECTED,
      ].includes(row.original.status)
      return (
        <div className="flex flex-col gap-1">
          <Button
            className={cn("h-5 min-h-5 min-w-[60px] border-none text-xxs")}
            variant="success"
            disabled={disabled}
            onClick={() => {
              openAppDialog("AppConfirmRequestDialog", {
                onSubmit: async () => {
                  row.toggleSelected(false)
                  await handleProcessSalary(row.original, column.id, true)
                },
                mutationFilter: { mutationKey: [QueryKey.SALARY_MOVEMENT] },
                title: t("common.dialog_confirm.title"),
                description: t("common.dialog_confirm.description.approve"),
              })
            }}
          >
            {t("hr_request_approvals.salary_movement.action.approve")}
          </Button>
          <Button
            className={cn("h-5 min-h-5 min-w-[60px] border-none text-xxs")}
            variant="destructive"
            disabled={disabled}
            onClick={() => {
              openAppDialog("AppConfirmRequestDialog", {
                onSubmit: async () => {
                  row.toggleSelected(false)
                  await handleProcessSalary(row.original, column.id, false)
                },
                mutationFilter: { mutationKey: [QueryKey.SALARY_MOVEMENT] },
                title: t("common.dialog_confirm.title"),
                description: t("common.dialog_confirm.description.reject"),
              })
            }}
          >
            {t("hr_request_approvals.salary_movement.action.reject")}
          </Button>
        </div>
      )
    }

    return [
      columnHelper.accessor("employee_code", {
        header: t("hr_request_approvals.salary_movement.table.code"),
        size: 100,
        enableSorting: true,
      }),
      columnHelper.accessor("employee_name", {
        header: t("hr_request_approvals.salary_movement.table.employee_name"),
        enableSorting: true,
        cell: renderEmployeeNameCell,
        size: 180,
      }),
      columnHelper.accessor("salary_prev", {
        header: t("hr_request_approvals.salary_movement.table.previous_salary"),
        cell: renderSalaryCell,
      }),
      columnHelper.accessor("salary", {
        header: t("hr_request_approvals.salary_movement.table.new_salary"),
        cell: renderSalaryCell,
      }),
      columnHelper.accessor("effective_date", {
        header: t("hr_request_approvals.salary_movement.table.effective_date"),
        cell: renderEffectiveDateCell,
      }),
      columnHelper.accessor("status", {
        header: t("hr_request_approvals.salary_movement.table.status"),
        size: 200,
        maxSize: 200,
        cell: renderStatusCell,

        meta: {
          Filter: renderStatusFilter,
        },
      }),
      columnHelper.accessor("created_by", {
        header: t("hr_request_approvals.salary_movement.table.requester"),
        cell: renderCreatedByCell,
      }),
      columnHelper.accessor("approver", {
        header: t("hr_request_approvals.salary_movement.table.approver"),
        cell: renderApproverCell,
      }),
      columnHelper.display({
        id: "from_date",
        meta: {
          isHidden: true,
          Filter: renderFromDateFilter,
        },
      }),
      columnHelper.display({
        id: "to_date",
        meta: {
          isHidden: true,
          Filter: renderToDateFilter,
        },
      }),
      columnHelper.accessor("created_at", {
        header: t("hr_request_approvals.salary_movement.table.created_at"),
        enableSorting: true,
        cell: renderCreatedAtCell,
        size: 180,
      }),
      columnHelper.accessor("approved_by", {
        header: t(
          "hr_request_approvals.salary_movement.table.approved_rejected_by"
        ),
        size: 200,
        maxSize: 200,
        cell: renderApprovedByCell,
      }),
      columnHelper.accessor("approved_at", {
        header: t("hr_request_approvals.salary_movement.table.approval_time"),
        cell: renderCreatedAtCell,
      }),
      columnHelper.accessor("remark", {
        header: t("hr_request_approvals.salary_movement.table.remark"),
        size: 150,
        maxSize: 150,
        cell: renderRemarkCell,
      }),
      columnHelper.display({
        id: COLUMN_ID.ACTION,
        header: () => (
          <div className="flex-1 text-center">
            {t("common.table.columns.action")}
          </div>
        ),
        size: 120,
        cell: renderActionCell,
        meta: {
          isHidden: !hasApprovePermission,
        },
      }),
    ]
  }, [
    handleEditRemark,
    handleProcessSalary,
    openAppDialog,
    t,
    hasApprovePermission,
  ])

  const renderTopToolbar = useCallback<
    NonNullable<AppTableProps<SalaryMovementRequestItem>["renderTopToolbar"]>
  >(
    ({ table }) => {
      const state = table.getState()
      const { rowSelection, columnFilters, globalFilter } = state
      const selectedKeys = Object.keys(rowSelection).filter(
        (key) => rowSelection[key]
      )
      const selectedCount = selectedKeys.length
      const globalFilterCount = globalFilter ? 1 : 0
      const filterCount = columnFilters.length + globalFilterCount

      return (
        <div className={cn("my-4 flex flex-col gap-3")}>
          <div className="grid flex-1 flex-grow grid-cols-[repeat(auto-fit,_220px)] items-start gap-2">
            <div className="col-start-1 col-end-3">
              <GlobalFilterTextField
                table={table}
                wrapperClassName=""
                allowClear
                placeholder={t("common.placeholder.search_code_name")}
                title={NON_BREAKING_SPACE}
              />
            </div>
            <ColumnsFiltersList table={table} />
          </div>
          <div
            className={cn("flex items-center justify-between gap-2", {
              hidden: !hasApprovePermission,
            })}
          >
            <div>
              <span className="text-xs font-bold text-gray-700">
                {t("common.table.selected", {
                  count: selectedCount,
                })}
              </span>
              <Button
                variant="link"
                onClick={() => {
                  table.resetColumnFilters()
                  table.resetGlobalFilter()
                }}
                className="hover:no-underline"
              >
                <span
                  className={cn("text-xs", {
                    "text-action-blue": !!filterCount,
                    "text-[#BFBFBF]": !filterCount,
                  })}
                >
                  {filterCount
                    ? t("common.table.reset_filters", { count: filterCount })
                    : t("common.table.reset_filters_no_count")}
                </span>
              </Button>
            </div>
            <SalaryMovementToolbarActions selectedKeys={selectedKeys} />
          </div>
        </div>
      )
    },
    [t, hasApprovePermission]
  )

  return (
    <DataTable
      key={`${hasApprovePermission}`}
      {...tableProps}
      isLoading={isFetchingSalaryMovementRequestList}
      ref={tableRef}
      renderTopToolbar={renderTopToolbar}
      columns={columns}
      data={response?.data?.content ?? []}
      getRowId={(row) => row.id}
      enablePagination
      rowCount={response?.data?.total_elements ?? 0}
      pageCount={response?.data?.total_pages ?? 0}
      enableRowSelection={
        hasApprovePermission
          ? (row) => {
              return ![
                REQUEST_APPROVAL_STATUS.APPROVED,
                REQUEST_APPROVAL_STATUS.REJECTED,
              ].includes(row.original.status)
            }
          : undefined
      }
      initialState={{
        columnPinning: {
          left: ["employee_code"],
          right: [COLUMN_ID.ACTION],
        },
      }}
      onColumnFiltersChange={(updater) => {
        const newColumnFiltersValue =
          updater instanceof Function
            ? updater(tableProps.state?.columnFilters ?? [])
            : updater

        const startDateValue = newColumnFiltersValue.find(
          (item) => item.id === "from_date"
        )?.value as string
        const endDateValue = newColumnFiltersValue.find(
          (item) => item.id === "to_date"
        )?.value as string

        if (isFilterDateRangeValid(startDateValue, endDateValue)) {
          tableProps.onColumnFiltersChange?.(updater)
        } else {
          toast({
            variant: "destructive",
            title: t("common.toast_messages.error.title"),
            description: t("common.validation.date.gte", {
              start: t(
                "hr_request_approvals.salary_movement.validation.date.gte_start"
              ),
              end: t(
                "hr_request_approvals.salary_movement.validation.date.gte_end"
              ),
            }),
          })
        }
      }}
      enablePaginationSticky
    />
  )
}

export default SalaryMovementRequestsList
