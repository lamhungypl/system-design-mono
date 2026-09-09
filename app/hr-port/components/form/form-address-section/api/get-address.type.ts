import { ApiResponse, ApiResult } from "~/hr-port/types/common"

export type GetAddress = (params: {
  file_path: string
  service_path: string
}) => Promise<GetAddressResult>

export type GetAddressResult = ApiResult<Region[]>

export type GetAddressResponse = ApiResponse<Region[]>

export type Region = {
  id: string
  label: string
  provinces: Province[]
}

export type Province = {
  districts: District[]
  id: string
  label: string
  region_id: string
}

export type District = {
  id: string
  label: string
  province_id: string
  sub_districts: SubDistrict[]
}

export type SubDistrict = {
  district_id: string
  id: string
  label: string
}
