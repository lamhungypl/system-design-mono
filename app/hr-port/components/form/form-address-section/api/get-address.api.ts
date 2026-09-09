import { apiPrivate } from "~/hr-port/config/axios"

import { GetAddress, GetAddressResponse } from "./get-address.type"

export const getAddress: GetAddress = async ({ file_path, service_path }) => {
  try {
    const { data } = await apiPrivate.post<GetAddressResponse>(service_path, {
      path_file: file_path,
    })
    return data.data
  } catch (err: any) {
    if (err?.response?.data?.metadatas)
      return {
        errors: err.response.data.metadatas,
      }
    return null
  }
}
