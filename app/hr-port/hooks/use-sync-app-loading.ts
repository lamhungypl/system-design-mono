import { useEffect, useRef } from "react"

import useAppLoading from "~/hr-port/stores/use-app-loading"

type Props = {
  loading: boolean
}
const useSyncAppLoading = (props: Props) => {
  const { loading } = props
  const { setIsAppLoading } = useAppLoading()
  const prevLoading = useRef(false)

  useEffect(() => {
    if (prevLoading.current !== loading) {
      setIsAppLoading(loading)
      prevLoading.current = loading
    }
  }, [loading, setIsAppLoading])

  useEffect(() => {
    return () => {
      if (prevLoading.current) setIsAppLoading(false)
    }
  }, [setIsAppLoading])
}

export default useSyncAppLoading
