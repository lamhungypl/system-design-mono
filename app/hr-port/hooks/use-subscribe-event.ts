import { useCallback, useEffect } from "react"

import { emitter } from "~/hr-port/lib/emitter"

export function useSubscribeEvent<EventType extends string>(
  event: EventType,
  callback: (data: any) => void
) {
  const unsubscribe = useCallback(() => {
    emitter.off(event, callback)
  }, [event, callback])

  useEffect(() => {
    emitter.on(event, callback)

    return unsubscribe
  }, [event, callback, unsubscribe])

  return unsubscribe
}
