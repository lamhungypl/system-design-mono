import { useMemo } from "react"
import { useTranslation } from "react-i18next"

import { PaymentMethodOptions } from "~/hr-port/constants"

export default function usePaymentMethodOptions() {
  const { t } = useTranslation()

  const options = useMemo(() => {
    return PaymentMethodOptions.map((option) => ({
      ...option,
      label: t(`common.${option.label}`),
    }))
  }, [t])

  return options
}
