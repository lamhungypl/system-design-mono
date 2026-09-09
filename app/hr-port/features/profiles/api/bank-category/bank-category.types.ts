import { ApiResponse, ApiResult } from "~/hr-port/types/common"

export type GetBankCategoryData = () => Promise<GetBankCategoryDataResult>

export type GetBankCategoryDataResult = ApiResult<BankCategory[]>

export type GetBankCategoryDataResponse = ApiResponse<BankCategory[]>

export type BankCategory = {
  icon_file_path?: string
  key: string
  name: string
}
