import { nanoid } from "nanoid"
import { create } from "zustand"

import {
  DialogName,
  DialogProps,
} from "~/hr-port/components/ui/app-dialog/constants"
import { AppDialogOpenProps } from "~/hr-port/components/ui/app-dialog/types"
import { uniqArray } from "~/hr-port/features/common/utils"
import { EntityState, RequiredKeys } from "~/hr-port/types/common"

type RegisteredDialogPayload<Name extends DialogName = DialogName> = {
  compProps: DialogProps[Name]
  id: string
  name: Name
}

type SimpleDialogProps<T> = Omit<T, keyof AppDialogOpenProps>
/**
 *
 * @inspiration [Make a function argument optional](https://stackoverflow.com/questions/74535001/make-a-function-argument-optional-if-the-inferred-type-is-an-empty-object/74535478#74535478)
 */
type OpenDialogParams<Name extends DialogName> =
  RequiredKeys<SimpleDialogProps<DialogProps[Name]>> extends never
    ? [name: Name, props?: SimpleDialogProps<DialogProps[Name]>]
    : [name: Name, props: SimpleDialogProps<DialogProps[Name]>]

type AppDialogStore = {
  closeAppDialog: (id: string) => void
  openAppDialog: <Name extends DialogName>(
    ...args: OpenDialogParams<Name>
  ) => void
} & EntityState<RegisteredDialogPayload>

export const useAppDialog = create<AppDialogStore>((set) => ({
  names: [],
  entities: {},
  closeAppDialog: (shouldClosedName) => {
    set((state) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { [shouldClosedName]: shouldRemovedItem, ...restEntities } =
        state.entities
      return {
        names: state.names.filter((name) => name !== shouldClosedName),
        entities: restEntities,
      }
    })
  },
  openAppDialog: <Name extends DialogName>(...args: OpenDialogParams<Name>) => {
    const name = args[0]
    const compProps = args[1]
    const id = nanoid()
    set((state) => {
      const nextEntities = {
        ...state.entities,
        [name]: { compProps, name, id },
      } as typeof state.entities // NOSONAR
      return {
        names: uniqArray(state.names.concat(name)),
        entities: nextEntities,
      }
    })
  },
}))
