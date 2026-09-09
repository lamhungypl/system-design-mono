import React, {
  PropsWithChildren,
  ReactNode,
  Suspense,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react"

import { dialogRegister } from "~/hr-port/components/ui/app-dialog/constants"
import { useAppDialog } from "~/hr-port/components/ui/app-dialog/hooks/use-app-dialog"

type AppDialogID = string
const AppModalContext = React.createContext<AppDialogID | null>(null)

export const useAppModalContext = () => useContext(AppModalContext)

type Props = {
  dialogId: string
}
export const AppModalProvider = ({
  dialogId,
  children,
}: PropsWithChildren<Props>) => {
  return (
    <AppModalContext.Provider value={dialogId}>
      {children}
    </AppModalContext.Provider>
  )
}

const AppDialogBaseContainer = () => {
  const allDialogEntities = useAppDialog((store) => store.entities)
  const elements = useMemo(
    () => Object.values(allDialogEntities),
    [allDialogEntities]
  )
  const { closeAppDialog: closeAppDialog } = useAppDialog()

  return (
    <Suspense fallback={<div />}>
      {elements.map(({ name, compProps, id }) => {
        const Component = dialogRegister[name]
        return (
          <AppModalProvider dialogId={id} key={id}>
            <DialogComponentWrapepr>
              {({ open, close }) => (
                <Component
                  {...(compProps as any)}
                  open={open}
                  setOpen={(value: boolean) => {
                    if (value === false) {
                      close()
                      setTimeout(() => {
                        closeAppDialog(name)
                      }, 200)
                    }
                  }}
                />
              )}
            </DialogComponentWrapepr>
          </AppModalProvider>
        )
      })}
    </Suspense>
  )
}

export default AppDialogBaseContainer

type DialogComponentWrapperProps = {
  children: ({ close, open }: { close: () => void; open: boolean }) => ReactNode
}

const DialogComponentWrapepr = ({ children }: DialogComponentWrapperProps) => {
  const [open, setOpen] = useState(true)

  const close = useCallback(() => {
    setOpen(false)
  }, [])

  return children({ close, open })
}
