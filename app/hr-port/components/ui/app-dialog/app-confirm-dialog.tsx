import AppDialog, {
  AppDialogProps,
} from "~/hr-port/components/ui/app-dialog/app-dialog"
import { cn } from "~/hr-port/utils/style"

type Props = AppDialogProps

const AppConfirmDialog = (props: Props) => {
  const { slotProps, ...rest } = props
  return (
    <AppDialog
      {...rest}
      slotProps={{
        ...slotProps,
        header: {
          ...slotProps?.header,
          className: cn(
            "border-b border-solid border-[#f1f1f1]",
            slotProps?.header?.className
          ),
        },
        description: {
          ...slotProps?.description,
          className: cn(
            "mb-3 font-bold text-foreground",
            slotProps?.description?.className
          ),
        },
      }}
    ></AppDialog>
  )
}

export default AppConfirmDialog
