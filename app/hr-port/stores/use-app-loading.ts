import { create } from "zustand"

import { env } from "~/hr-port/config/env"

export type UseAppLoading = {
  isAppLoading: boolean
  isPendingSync: boolean
  reset: () => void
  setIsAppLoading: (isLoading: boolean) => void
  setIsPendingSync: (isPendingSync: boolean) => void
}

const count = {
  value: 0,
}

const useAppLoading = create<UseAppLoading>((set) => ({
  isAppLoading: false,
  isPendingSync: false,
  setIsPendingSync: (isPendingSync: boolean) => {
    set({ isPendingSync })
  },
  setIsAppLoading: (isLoading) => {
    if (env.DEBUG_MODE) console.log("loading-count-prev", count)
    if (isLoading) count.value++
    else count.value--
    if (count.value < 0) count.value = 0

    if (env.DEBUG_MODE) console.log("loading-count-new", count)
    set({
      isAppLoading: count.value > 0,
    })
  },
  reset: () => {
    set({ isAppLoading: false, isPendingSync: false })
  },
}))

export default useAppLoading
