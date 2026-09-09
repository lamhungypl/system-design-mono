import { apiPrivate } from "~/hr-port/config/axios"
import {
  GetBankCategoryData,
  GetBankCategoryDataResponse,
} from "~/hr-port/features/profiles/api/bank-category/bank-category.types"

export const getBankCategoryData: GetBankCategoryData = async () => {
  try {
    const { data } = await apiPrivate.get<GetBankCategoryDataResponse>(
      `hr/employee/bank-info/list`
    )
    return data.data
  } catch (err: any) {
    if (err?.response?.data?.metadatas)
      return {
        errors: err.response.data.metadatas,
      }

    return null
  }
}
