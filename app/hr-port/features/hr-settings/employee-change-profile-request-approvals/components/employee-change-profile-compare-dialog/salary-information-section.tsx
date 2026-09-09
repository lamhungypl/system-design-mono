import { useMemo } from "react"
import { useTranslation } from "react-i18next"

import FormRadio from "~/hr-port/components/form/form-radio/form-radio"
import FormSelect from "~/hr-port/components/form/form-select/form-select"
import FormTextField from "~/hr-port/components/form/form-text-field/form-text-field"
import Untouchable from "~/hr-port/components/ui/untouchable/Untouchable"
import { useBankCategoryDataQuery } from "~/hr-port/features/profiles/api/bank-category/bank-category.query"
import usePaymentMethodOptions from "~/hr-port/hooks/use-payment-method-options"
import { SelectOption } from "~/hr-port/types/common"
import { isData } from "~/hr-port/utils/object"

import { newDataIdPrefix, oldDataIdPrefix } from "../../constant"
import { SalaryInfo } from "./section-details"

export default function SalaryInformationSection({
  newSalaryInfo,
  oldSalaryInfo,
}: {
  newSalaryInfo?: SalaryInfo | null
  oldSalaryInfo?: SalaryInfo | null
}) {
  const { t } = useTranslation()
  const paymentMethodOptions = usePaymentMethodOptions()
  const { data: bankCategoryData } = useBankCategoryDataQuery()
  const isPaymentMethodChanged =
    oldSalaryInfo?.payment_method !== newSalaryInfo?.payment_method
  const isBankAccountChanged =
    oldSalaryInfo?.bank_account !== newSalaryInfo?.bank_account
  const isBankNoChanged = oldSalaryInfo?.bank_no !== newSalaryInfo?.bank_no
  const bankCategories = useMemo(() => {
    if (!isData(bankCategoryData)) return []
    return bankCategoryData.map(
      (item) =>
        ({
          ...item,
          label: item.name,
          value: item.key.toString(),
        }) satisfies SelectOption
    )
  }, [bankCategoryData])
  return (
    <div>
      <div
        className="grid items-center gap-x-4 gap-y-2"
        style={{
          gridTemplateColumns: "150px 1fr 1fr ",
        }}
      >
        {isPaymentMethodChanged && (
          <>
            <div className="text-xs break-words">
              {t(`employee_profile.salary_information.payment_method`)}
            </div>
            <Untouchable>
              <FormRadio
                options={paymentMethodOptions}
                name={`${oldDataIdPrefix}payment_method`}
              />
            </Untouchable>
            <Untouchable>
              <FormRadio
                options={paymentMethodOptions}
                name={`${newDataIdPrefix}payment_method`}
              />
            </Untouchable>
          </>
        )}
        {isBankAccountChanged && (
          <>
            <div className="text-xs break-words">
              {t(`employee_profile.salary_information.bank_account`)}
            </div>
            <Untouchable>
              <FormSelect
                name={`${oldDataIdPrefix}bank_account`}
                className="border-action-red whitespace-normal"
                options={bankCategories}
                optionWithIcon
              />
            </Untouchable>
            <Untouchable>
              <FormSelect
                name={`${newDataIdPrefix}bank_account`}
                className="border-action-green whitespace-normal"
                options={bankCategories}
                optionWithIcon
              />
            </Untouchable>
          </>
        )}
        {isBankNoChanged && (
          <>
            <div className="text-xs break-words">
              {t(`employee_profile.salary_information.bank_no`)}
            </div>
            <Untouchable>
              <FormTextField
                name={`${oldDataIdPrefix}bank_no`}
                className="border-action-red"
              />
            </Untouchable>
            <Untouchable>
              <FormTextField
                name={`${newDataIdPrefix}bank_no`}
                className="border-action-green"
              />
            </Untouchable>
          </>
        )}
      </div>
    </div>
  )
}
