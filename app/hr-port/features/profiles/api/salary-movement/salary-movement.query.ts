import {
  DefaultError,
  useMutation,
  UseMutationOptions,
  useQuery,
} from "@tanstack/react-query"

import { EmitterEvent, QueryKey } from "~/hr-port/constants"
import { employeeChangeProfileRequestApprovalKeys } from "~/hr-port/features/hr-settings/employee-change-profile-request-approvals/api/query-keys-factories"
import { requestApprovalsQueryKeys } from "~/hr-port/features/hr-settings/request-approvals/api/query-keys-factories"
import { emitter } from "~/hr-port/lib/emitter"
import { QueryOptions } from "~/hr-port/types/react-query"

import {
  editSalaryMovementRemark,
  getRequestChangeSalaryInfo,
  processSalaryMovement,
} from "./salary-movement.api"
import {
  EditSalaryMovementRemarkPayload,
  EditSalaryMovementRemarkResponse,
  GetRequestChangeSalaryResult,
  ProcessSalaryPayload,
  ProcessSalaryResponse,
} from "./salary-movement.types"

export const useRequestChangeSalaryQuery = (
  employeeId: string | number,
  options?: QueryOptions<GetRequestChangeSalaryResult>
) => {
  return useQuery({
    queryKey: ["request-change-salary", employeeId],
    queryFn: () => getRequestChangeSalaryInfo(employeeId),
    ...options,
  })
}

export const useProcessSalaryMovementMutation = (
  options?: Partial<
    UseMutationOptions<ProcessSalaryResponse, any, ProcessSalaryPayload>
  >
) => {
  return useMutation({
    ...options,
    mutationKey: [QueryKey.SALARY_MOVEMENT, ...(options?.mutationKey ?? [])],
    mutationFn: processSalaryMovement,
    // PORT: @tanstack/react-query 5.9x passes (data, variables, onMutateResult,
    // context) to mutation callbacks; the source was written against the 3-arg
    // signature, so the args are forwarded as a tuple instead of by name.
    onSuccess: (...args) => {
      const variables = args[1]
      emitter.emit(EmitterEvent.SALARY_MOVEMENT_PROCESS, variables)
      options?.onSuccess?.(...args)
    },
    meta: {
      ...options?.meta,
      invalidates: [
        requestApprovalsQueryKeys.lists(),
        requestApprovalsQueryKeys.totalAwaiting(),
        employeeChangeProfileRequestApprovalKeys.totalAwaiting(),
      ],
    },
  })
}

export const useEditSalaryMovementRemarkMutation = (
  options?: Partial<
    UseMutationOptions<
      EditSalaryMovementRemarkResponse,
      DefaultError,
      EditSalaryMovementRemarkPayload
    >
  >
) => {
  return useMutation({
    ...options,
    mutationFn: editSalaryMovementRemark,
    meta: {
      ...options?.meta,
      invalidates: [requestApprovalsQueryKeys.lists()],
    },
  })
}
