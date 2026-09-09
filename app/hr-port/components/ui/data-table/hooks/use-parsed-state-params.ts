import { useMemo } from "react"
import { useLocation } from "react-router"

import { queryStringToTableState } from "~/hr-port/components/ui/data-table/utils"

const useParsedStateParams = () => {
  const location = useLocation()
  const parsedState = useMemo(
    () => queryStringToTableState(location.search),
    [location.search]
  )
  return parsedState
}

export default useParsedStateParams
