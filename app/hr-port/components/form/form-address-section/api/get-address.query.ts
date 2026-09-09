import { useQuery } from "@tanstack/react-query"

import { QueryKey } from "~/hr-port/constants"
import { QueryOptions } from "~/hr-port/types/react-query"

import { getAddress } from "./get-address.api"
import { GetAddressResult } from "./get-address.type"

export function useAddressQuery(
  { file_path, service_path }: { file_path: string; service_path: string },
  options?: QueryOptions<GetAddressResult>
) {
  const query = useQuery({
    queryKey: [QueryKey.ADDRESS, service_path, file_path],
    queryFn: () => getAddress({ file_path, service_path }),
    ...options,
  })

  return query
}
