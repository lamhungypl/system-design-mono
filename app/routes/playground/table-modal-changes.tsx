import { useState } from "react"
import { useTranslation } from "react-i18next"

import { Tabs } from "~/components/ui/tabs"
import { PrivateCurrencyProvider } from "~/hr-port/components/ui/private-currency/private-currency"
import EmployeeChangeDataRequestList from "~/hr-port/features/hr-settings/employee-change-profile-request-approvals/components/employee-change-profile-requests-list"
import SalaryMovementRequestsList from "~/hr-port/features/hr-settings/request-approvals/components/salary-movement-requests-list"

/**
 * Port of dynamic-web-app's HR "Request Approvals" screen
 * (src/app/routes/app/hr/request-approvals/*).
 *
 * The source splits the two lists across child routes behind a sidebar-route nav and
 * permission gates; here they are two tabs so both are reachable in one place. The list
 * components themselves — and the compare modal one of them opens — are the copied
 * originals, unmodified.
 */
type TabKey = "employee_change_profile" | "salary_movement"

export default function TableModalChangesPage() {
  const { t } = useTranslation()
  const [activeKey, setActiveKey] = useState<TabKey>("employee_change_profile")

  return (
    <PrivateCurrencyProvider>
      <div className="flex h-full flex-col p-8">
        <header>
          <h1 className="text-xl font-semibold">Table + change modal</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            The HR request-approval tables from <code>dynamic-web-app</code>,
            and the side-by-side employee-data diff modal behind the document
            icon in the <em>Changed data</em> column.
          </p>
        </header>

        <div className="mt-6">
          <Tabs
            activeKey={activeKey}
            onChange={(key) => setActiveKey(key as TabKey)}
            items={[
              {
                key: "employee_change_profile",
                label: t(
                  "hr_request_approvals.employee_change_profile.title.list"
                ),
              },
              {
                key: "salary_movement",
                label: t("hr_request_approvals.salary_movement.title.list"),
              },
            ]}
          />
        </div>

        <div className="mt-2 min-h-0 flex-1">
          {activeKey === "employee_change_profile" ? (
            <EmployeeChangeDataRequestList />
          ) : (
            <SalaryMovementRequestsList />
          )}
        </div>
      </div>
    </PrivateCurrencyProvider>
  )
}
