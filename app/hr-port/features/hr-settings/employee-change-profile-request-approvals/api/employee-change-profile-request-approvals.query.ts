import {
  useMutation,
  UseMutationOptions,
  useQuery,
} from "@tanstack/react-query"

import { EmitterEvent, QueryKey } from "~/hr-port/constants"
import { approveOrRejectEmployeeChangeProfileRequest } from "~/hr-port/features/hr-settings/employee-change-profile-request-approvals/api/employee-change-profile-request-approvals.api"
import {
  ApproveOrRejectEmployeeChangeProfilePayload,
  ApproveOrRejectEmployeeChangeProfileResponse,
} from "~/hr-port/features/hr-settings/employee-change-profile-request-approvals/api/employee-change-profile-request-approvals.types"
import {
  employeeChangeProfileRequestApprovalKeys,
  employeeChangeProfileRequestApprovalsQueryOptions,
  EmployeeChangeProfileRequestDetailsQueryOptions,
  EmployeeChangeProfileRequestListQueryOptions,
  EmployeeChangeProfileRequestTotalQueryOptions,
} from "~/hr-port/features/hr-settings/employee-change-profile-request-approvals/api/query-keys-factories"
import { EmployeeChangeProfileRequestListPayload } from "~/hr-port/features/hr-settings/request-approvals/api/request-approvals.types"
import { emitter } from "~/hr-port/lib/emitter"

import { requestApprovalsQueryKeys } from "../../request-approvals/api/query-keys-factories"

export const useEmployeeChangeProfileRequestListQuery = <T>(
  payload: EmployeeChangeProfileRequestListPayload,
  options?: EmployeeChangeProfileRequestListQueryOptions<T>
) => {
  return useQuery(
    employeeChangeProfileRequestApprovalsQueryOptions.list(payload, options)
  )
}

export const useEmployeeChangeProfileRequestTotalQuery = <T>(
  options?: EmployeeChangeProfileRequestTotalQueryOptions<T>
) => {
  return useQuery(
    employeeChangeProfileRequestApprovalsQueryOptions.totalAwaiting(options)
  )
}

export const useEmployeeChangeProfileRequestDetailsQuery = (
  id: string,
  options?: EmployeeChangeProfileRequestDetailsQueryOptions
) => {
  return useQuery(
    employeeChangeProfileRequestApprovalsQueryOptions.changeRequestDetails(
      id,
      options
    )
  )
}

export const useApproveOrRejectEmployeeChangeProfileRequestMutation = (
  options?: Partial<
    UseMutationOptions<
      ApproveOrRejectEmployeeChangeProfileResponse,
      any,
      ApproveOrRejectEmployeeChangeProfilePayload
    >
  >
) => {
  return useMutation({
    ...options,
    mutationKey: [
      QueryKey.APPROVE_OR_REJECT_EMPLOYEE_CHANGE_PROFILE_REQUEST,
      ...(options?.mutationKey ?? []),
    ],
    mutationFn: approveOrRejectEmployeeChangeProfileRequest,
    // PORT: @tanstack/react-query 5.9x passes (data, variables, onMutateResult,
    // context) to mutation callbacks; the source was written against the 3-arg
    // signature, so the args are forwarded as a tuple instead of by name.
    onSuccess: (...args) => {
      const variables = args[1]
      emitter.emit(
        EmitterEvent.EMPLOYEE_CHANGE_PROFILE_REQUEST_PROCESS,
        variables
      )
      options?.onSuccess?.(...args)
    },
    meta: {
      ...options?.meta,
      invalidates: [
        employeeChangeProfileRequestApprovalKeys.lists(),
        employeeChangeProfileRequestApprovalKeys.totalAwaiting(),
        requestApprovalsQueryKeys.totalAwaiting(),
      ],
    },
  })
}
