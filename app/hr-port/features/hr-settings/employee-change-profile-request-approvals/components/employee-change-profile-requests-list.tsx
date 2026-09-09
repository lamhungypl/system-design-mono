import { useQueryClient } from "@tanstack/react-query"
import { CellContext, createColumnHelper, Table } from "@tanstack/react-table"
// PORT: FilterProps comes from the port's own data-table types (see types.ts).
import { FilterProps } from "~/hr-port/components/ui/data-table/types"
import { useCallback, useEffect, useMemo, useRef } from "react"
import { useTranslation } from "react-i18next"

import { ReactComponent as Document } from "~/hr-port/assets/svgs/document.svg"
import { Button } from "~/hr-port/components/base/button"
import { useAppDialog } from "~/hr-port/components/ui/app-dialog/hooks/use-app-dialog"
import { COLUMN_ID } from "~/hr-port/components/ui/data-table/constants"
import DataTable, {
  AppTableProps,
} from "~/hr-port/components/ui/data-table/DataTable"
import ColumnsFiltersList from "~/hr-port/components/ui/data-table/filters/ColumnsFiltersList"
import FilterMultiSelect from "~/hr-port/components/ui/data-table/filters/FitlerMultiSelect"
import FilterSingleSelect from "~/hr-port/components/ui/data-table/filters/FitlerSingleSelect"
import GlobalFilterTextField from "~/hr-port/components/ui/data-table/filters/GlobalFilterTextField"
import useAppTableParams from "~/hr-port/components/ui/data-table/hooks/use-app-table-params"
import TruncatedText from "~/hr-port/components/ui/truncated-text/truncated-text"
import { EmitterEvent, QueryKey } from "~/hr-port/constants"
import { NON_BREAKING_SPACE } from "~/hr-port/features/common/constants"
import {
  useApproveOrRejectEmployeeChangeProfileRequestMutation,
  useEmployeeChangeProfileRequestListQuery,
} from "~/hr-port/features/hr-settings/employee-change-profile-request-approvals/api/employee-change-profile-request-approvals.query"
import EmployeeChangeProfileRequestToolbarActions from "~/hr-port/features/hr-settings/employee-change-profile-request-approvals/components/employee-change-profile-request-toolbar-actions"
import {
  EmployeeChangeProfileRequestListResponse,
  EmployeeProfileChangeRequestItem,
  REQUEST_APPROVAL_SEARCH_BY,
  REQUEST_APPROVAL_STATUS,
  SalaryMovementRequestListPayload,
} from "~/hr-port/features/hr-settings/request-approvals/api/request-approvals.types"
import RequestStatusButton from "~/hr-port/features/hr-settings/request-approvals/components/request-status-button"
import {
  requestApprovalSearchByOptions,
  requestApprovalStatusOptions,
} from "~/hr-port/features/hr-settings/request-approvals/constants"
import { toast } from "~/hr-port/hooks/lib/use-toast"
import { useSubscribeEvent } from "~/hr-port/hooks/use-subscribe-event"
import { convertToLocalTime } from "~/hr-port/utils/date"
import { cn } from "~/hr-port/utils/style"

import { ApproveOrRejectEmployeeChangeProfilePayload } from "../api/employee-change-profile-request-approvals.types"
import { employeeChangeProfileRequestApprovalKeys } from "../api/query-keys-factories"

const columnHelper = createColumnHelper<EmployeeProfileChangeRequestItem>()

const EmployeeChangeDataRequestList = () => {
  const { t } = useTranslation()
  const queryClient = useQueryClient()
  const { openAppDialog } = useAppDialog()
  const { tableProps, queryParams } = useAppTableParams<
    EmployeeProfileChangeRequestItem,
    SalaryMovementRequestListPayload
  >({
    meta: {
      syncWithLocation: true,
    },
  })
  const tableRef = useRef<Table<EmployeeProfileChangeRequestItem>>(null)

  const {
    data: response,
    isFetching: isFetchingEmployeeChangeProfileRequestList,
  } =
    useEmployeeChangeProfileRequestListQuery<EmployeeChangeProfileRequestListResponse>(
      queryParams
    )

  const { mutateAsync: approveOrRejectEmployeeChangeProfile } =
    useApproveOrRejectEmployeeChangeProfileRequestMutation()

  useSubscribeEvent(
    EmitterEvent.EMPLOYEE_CHANGE_PROFILE_REQUEST_PROCESS,
    (data: ApproveOrRejectEmployeeChangeProfilePayload) => {
      tableRef.current?.setRowSelection((prev) => {
        const nextSelections = { ...prev }
        data.items.forEach((item) => {
          delete nextSelections[item.id]
        })
        return nextSelections
      })
    }
  )

  useEffect(() => {
    response?.data?.content?.forEach((item) => {
      queryClient.setQueryData(
        employeeChangeProfileRequestApprovalKeys.details(item.id),
        item
      )
    })
  }, [queryClient, response])

  const handleApproveOrRejectRequest = useCallback(
    async (
      row: EmployeeProfileChangeRequestItem,
      _columnId: string,
      value: any
    ) => {
      const actionType = value ? "approved" : "rejected"

      await approveOrRejectEmployeeChangeProfile(
        {
          is_approved: !!value,
          items: [{ id: row.id, last_modified_at: row.last_modified_at }],
        },
        {
          onSuccess: () => {
            toast({
              title: t(`common.toast_messages.success.title`),
              description: t(
                `common.toast_messages.success.approval.employee_change_request.${actionType}`
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
    [approveOrRejectEmployeeChangeProfile, t]
  )

  const columns = useMemo(() => {
    type CellProps<T = string> = CellContext<
      EmployeeProfileChangeRequestItem,
      T
    >

    const renderChangeDataCell = ({ row }: CellProps) => {
      return (
        <span
          className="cursor-pointer"
          onClick={() => {
            openAppDialog("EmployeeChangeProfileCompareDialog", {
              id: row.original.id,
            })
          }}
        >
          <Document />
        </span>
      )
    }

    const renderChangeDataFilter = ({ table, column }: FilterProps) => {
      return (
        <FilterSingleSelect
          column={column}
          table={table}
          title={t(
            "hr_request_approvals.employee_change_profile.filters.search_by_name_of"
          )}
          options={requestApprovalSearchByOptions(t)}
          allowClear={false}
        />
      )
    }

    const renderStatusCell = ({
      getValue,
    }: CellProps<EmployeeProfileChangeRequestItem["status"]>) => {
      const status = getValue()
      return status ? <RequestStatusButton status={status} /> : ""
    }

    const renderStatusFilter = ({ table, column }: FilterProps) => {
      return (
        <FilterMultiSelect
          column={column}
          table={table}
          title={t("hr_request_approvals.employee_change_profile.table.status")}
          options={requestApprovalStatusOptions(t)}
        />
      )
    }

    const renderApproversCell = ({
      getValue,
    }: CellProps<EmployeeProfileChangeRequestItem["approvers"]>) => {
      const value = getValue()
      return (
        <TruncatedText
          className="line-clamp-1 text-xs break-all"
          text={value?.join(", ")}
        />
      )
    }

    const renderCreatedAtCell = ({
      getValue,
    }: CellProps<EmployeeProfileChangeRequestItem["created_at"]>) => {
      const value = getValue()

      return <span className="text-xs">{convertToLocalTime(value)}</span>
    }

    const renderModifiedByCell = ({
      getValue,
    }: CellProps<EmployeeProfileChangeRequestItem["modified_by"]>) => {
      const value = getValue()
      return (
        <TruncatedText
          className="line-clamp-1 text-xs break-all"
          text={value}
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
                  await handleApproveOrRejectRequest(
                    row.original,
                    column.id,
                    true
                  )
                },
                mutationFilter: {
                  mutationKey: [
                    QueryKey.APPROVE_OR_REJECT_EMPLOYEE_CHANGE_PROFILE_REQUEST,
                  ],
                },
                title: t("common.dialog_confirm.title"),
                description: t("common.dialog_confirm.description.approve"),
              })
            }}
          >
            {t("hr_request_approvals.employee_change_profile.action.approve")}
          </Button>
          <Button
            className={cn("h-5 min-h-5 min-w-[60px] border-none text-xxs")}
            variant="destructive"
            disabled={disabled}
            onClick={() => {
              openAppDialog("AppConfirmRequestDialog", {
                onSubmit: async () => {
                  row.toggleSelected(false)
                  await handleApproveOrRejectRequest(
                    row.original,
                    column.id,
                    false
                  )
                },
                mutationFilter: {
                  mutationKey: [
                    QueryKey.APPROVE_OR_REJECT_EMPLOYEE_CHANGE_PROFILE_REQUEST,
                  ],
                },
                title: t("common.dialog_confirm.title"),
                description: t("common.dialog_confirm.description.reject"),
              })
            }}
          >
            {t("hr_request_approvals.employee_change_profile.action.reject")}
          </Button>
        </div>
      )
    }

    return [
      columnHelper.accessor("code", {
        header: t("hr_request_approvals.employee_change_profile.table.code"),
        size: 100,
        enableSorting: true,
      }),
      columnHelper.accessor("name", {
        header: t(
          "hr_request_approvals.employee_change_profile.table.employee_name"
        ),
        enableSorting: true,
        size: 180,
      }),
      columnHelper.accessor("change_data", {
        header: t(
          "hr_request_approvals.employee_change_profile.table.change_data"
        ),
        cell: renderChangeDataCell,
      }),
      columnHelper.display({
        id: "search_by",
        meta: {
          isHidden: true,
          Filter: renderChangeDataFilter,
        },
      }),
      columnHelper.accessor("status", {
        header: t("hr_request_approvals.employee_change_profile.table.status"),
        size: 200,
        maxSize: 200,
        cell: renderStatusCell,
        meta: {
          Filter: renderStatusFilter,
        },
      }),
      columnHelper.accessor("approvers", {
        header: t(
          "hr_request_approvals.employee_change_profile.table.approver"
        ),
        cell: renderApproversCell,
      }),
      columnHelper.accessor("created_at", {
        header: t(
          "hr_request_approvals.employee_change_profile.table.created_at"
        ),
        enableSorting: true,
        cell: renderCreatedAtCell,
        size: 180,
      }),
      columnHelper.accessor("modified_by", {
        header: t(
          "hr_request_approvals.employee_change_profile.table.modified_by"
        ),
        size: 200,
        maxSize: 200,
        cell: renderModifiedByCell,
      }),
      columnHelper.accessor("modified_at", {
        header: t(
          "hr_request_approvals.employee_change_profile.table.modified_at"
        ),
        cell: renderCreatedAtCell,
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
      }),
    ]
  }, [handleApproveOrRejectRequest, openAppDialog, t])

  const renderTopToolbar = useCallback<
    NonNullable<
      AppTableProps<EmployeeProfileChangeRequestItem>["renderTopToolbar"]
    >
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
                placeholder={
                  queryParams.search_by === REQUEST_APPROVAL_SEARCH_BY.EMPLOYEE
                    ? t("common.placeholder.search_code_name")
                    : t("common.placeholder.search_name")
                }
                title={NON_BREAKING_SPACE}
              />
            </div>
            <ColumnsFiltersList table={table} />
          </div>
          <div
            className={cn("flex items-center justify-between gap-2", {
              hidden: false,
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
            <EmployeeChangeProfileRequestToolbarActions
              selectedKeys={selectedKeys}
            />
          </div>
        </div>
      )
    },
    [t, queryParams]
  )

  return (
    <DataTable
      {...tableProps}
      isLoading={isFetchingEmployeeChangeProfileRequestList}
      ref={tableRef}
      renderTopToolbar={renderTopToolbar}
      columns={columns}
      data={response?.data?.content ?? []}
      getRowId={(row) => row.id}
      enablePagination
      rowCount={response?.data?.total_elements ?? 0}
      pageCount={response?.data?.total_pages ?? 0}
      enableRowSelection={(row) => {
        return ![
          REQUEST_APPROVAL_STATUS.APPROVED,
          REQUEST_APPROVAL_STATUS.REJECTED,
        ].includes(row.original.status)
      }}
      initialState={{
        columnPinning: {
          left: ["code"],
          right: [COLUMN_ID.ACTION],
        },
        sorting: [{ id: "created_at", desc: true }],
      }}
      enablePaginationSticky
    />
  )
}

export default EmployeeChangeDataRequestList
