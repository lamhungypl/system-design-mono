import { http, HttpResponse } from "msw"

import { env } from "~/hr-port/config/env"
import { type EntityData } from "~/hr-port/features/profiles/types/profile-data"

import { employeeProfileHandlers } from "./generated/employee-profile"
import { homeHandlers } from "./generated/home"
import { requestApprovalHandlers } from "./generated/request-approval"

/**
 * PORT: focused subset of dynamic-web-app's src/lib/mocks/handlers.ts (13k lines).
 *
 * Only the endpoints /playground/table-modal-changes touches are served:
 *   - generated/employee-profile  → /hr/employee/profile/get-structure (drives every
 *                                   field the compare modal renders), bank-info,
 *                                   region-setting, admin/account
 *   - generated/request-approval  → change-data-request list/count, salary-movement
 *                                   list/total
 *   - generated/home              → csrf-token, check-onboarding/status (user info)
 *   - the change-data-request detail handler below, copied verbatim from the source:
 *     it is the diff fixture the modal exists to show.
 */
const baseUrl = (path: string) => `${env.API_URL}${path}`

// Helpers for the employee change-data-request (diff) mock below.
const changeRequestField = (
  field_id: number,
  field_value_id: number,
  value: string
): EntityData => ({
  field_id,
  grid_data: [],
  values: [{ field_value_id, value }],
})

/** One grid row. `entity_data_id: null` marks a row added by the request. */
const changeRequestGridRow = (
  entity_data_id: number | null,
  cells: Record<number, string>,
  delete_flg = false
) => ({
  entity_data_id,
  delete_flg,
  field_values: Object.entries(cells).map(([field_id, value]) => ({
    field_id: Number(field_id),
    values: [{ field_value_id: null, value }],
  })),
})

const changeRequestGrid = (
  field_id: number,
  grid_data: ReturnType<typeof changeRequestGridRow>[]
): EntityData => ({
  field_id,
  grid_data,
  values: [],
})

const changeRequestEmployeeInfo = (entity_data: EntityData[]) => ({
  name: "123b 123b",
  code: "123b",
  department: null,
  position: null,
  company_email: null,
  personal_email: null,
  employee_id: 49431,
  entity_data_id: 154032,
  last_modified_at: "2025-09-12T06:17:14.334501",
  work_date: "1999-01-01",
  entity_data,
})

// Powers EmployeeChangeProfileCompareDialog (the side-by-side diff) at
// /hr/request-approvals/employee-change-profile — click the document icon on a row.
// The list mock in generated/request-approval.ts returns a single request, id 1184.
// old_data mirrors the /hr/employee/profile/get-data mock; new_data changes first_name,
// work_location, employment_date, phone and the bank details, so the Employee Information,
// Contact Information and Salary Information tabs each have something to show.
const changeDataRequestDetailHandler = http.get(
  baseUrl("/hr/employee/change-data-request/detail/:id"),
  () => {
    const unchangedFields = [
      changeRequestField(31271, 1577667, "123b"), // last_name
      changeRequestField(31272, 1577668, "123b"), // employee_no
      changeRequestField(31274, 1577669, "1"), // gender
      changeRequestField(31290, 1577672, "Phuongdtt"), // employment_type
    ]

    // grid_work_experience (31314): columns are from (31315), to (31316),
    // company_name (31317), position (31318), salary (31319).
    // Row 300001 is edited, 300002 is deleted, and a third row is added — the three
    // grid states the compare dialog can render.
    const workExperienceRow1 = {
      31315: "2015-01-01",
      31316: "2018-12-31",
      31317: "ABC Co., Ltd.",
      31318: "Developer",
    }
    const workExperienceRow2 = {
      31315: "2019-01-01",
      31316: "2022-06-30",
      31317: "XYZ Corp.",
      31318: "Senior Developer",
      31319: "45000",
    }
    const oldWorkExperience = changeRequestGrid(31314, [
      changeRequestGridRow(300001, { ...workExperienceRow1, 31319: "30000" }),
      changeRequestGridRow(300002, workExperienceRow2),
    ])
    const newWorkExperience = changeRequestGrid(31314, [
      // edited: salary 30000 -> 35000
      changeRequestGridRow(300001, { ...workExperienceRow1, 31319: "35000" }),
      // deleted: same values, flagged. The row must still be sent, or the two tables
      // fall out of alignment — the dialog pairs rows by index, not by id.
      changeRequestGridRow(300002, workExperienceRow2, true),
      // added: null entity_data_id
      changeRequestGridRow(null, {
        31315: "2022-07-01",
        31316: "2025-01-31",
        31317: "Gem Corp.",
        31318: "Tech Lead",
        31319: "60000",
      }),
    ])

    return HttpResponse.json({
      status: true,
      data: {
        old_data: {
          employee_info: changeRequestEmployeeInfo([
            changeRequestField(31270, 1577666, "123b"), // first_name
            ...unchangedFields,
            changeRequestField(31286, 1577670, "ha_div1"), // work_location
            changeRequestField(31287, 1577671, "1999-01-01"), // employment_date
            changeRequestField(31293, 1577673, "0900000001"), // phone
            oldWorkExperience,
          ]),
          salary_info: {
            payment_method: "BANK",
            bank_no: "1234567890",
            bank_account_info: {
              key: "ttb",
              name: "TTB",
              icon_file_path: "",
            },
          },
        },
        new_data: {
          employee_info: changeRequestEmployeeInfo([
            changeRequestField(31270, 1577666, "th11"), // first_name
            ...unchangedFields,
            changeRequestField(31286, 1577670, "ha_div2"), // work_location
            changeRequestField(31287, 1577671, "2025-01-01"), // employment_date
            changeRequestField(31293, 1577673, "0912345678"), // phone
            newWorkExperience,
          ]),
          salary_info: {
            payment_method: "BANK",
            bank_no: "9876543210",
            bank_account_info: {
              key: "kasikornbank",
              name: "KASIKORNBANK",
              icon_file_path: "",
            },
          },
        },
      },
      metadatas: null,
    })
  }
)

/**
 * PORT: write endpoints the source's HAR-generated mocks never captured. Without them
 * MSW passes the request through to the (non-existent) API and the confirm dialog spins
 * forever. Each returns the envelope the query layer expects, so approve / reject
 * complete and the success toast fires.
 */
const successEnvelope = {
  status: true,
  data: {},
  metadatas: [
    {
      title: "common.success.title",
      message: "common.success.message",
      params: [],
    },
  ],
}

const writeHandlers = [
  // Employment profile change requests — approve / reject (is_approved in the body).
  http.put(baseUrl("/hr/employee/change-data-request/approve"), () =>
    HttpResponse.json(successEnvelope)
  ),
  // Salary movement requests — approve / reject.
  http.put(baseUrl("/hr/employee/profile/process-salary"), () =>
    HttpResponse.json(successEnvelope)
  ),
  http.post(baseUrl("/hr/employee/salary-movement/update-remark"), () =>
    HttpResponse.json(successEnvelope)
  ),
]

export const handlers = [
  ...employeeProfileHandlers,
  ...requestApprovalHandlers,
  ...homeHandlers,
  changeDataRequestDetailHandler,
  ...writeHandlers,
]
