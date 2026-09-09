import AppDialog from "~/hr-port/components/ui/app-dialog/app-dialog"
import { type AppDialogOpenProps } from "~/hr-port/components/ui/app-dialog/types"

export type AppPreviewDialogProps = {
  file?: { name?: string }
  previewUrl?: string
  title?: string
} & AppDialogOpenProps

/**
 * PORT: stub of dynamic-web-app's src/components/ui/app-preview-dialog/app-preview-dialog.tsx.
 *
 * The original previews images and PDFs inline (react-pdf, IndexedDB caching, zoom and
 * rotate controls). File preview is not part of what this playground demonstrates, and
 * the file fields in the compare modal render read-only anyway, so this only keeps the
 * registry entry that form-file-uploader opens.
 *
 * To un-stub: copy the original file plus `hooks/useFilePreview` and add `react-pdf`.
 */
export default function AppPreviewDialog({
  file,
  title,
  ...dialogProps
}: AppPreviewDialogProps) {
  const fileName = file?.name
  return (
    <AppDialog title={title ?? fileName ?? "Preview"} {...dialogProps}>
      <div className="p-6 text-xs text-muted-foreground">
        File preview is stubbed in this port.
        {fileName ? (
          <span className="ml-1 font-medium">({fileName})</span>
        ) : null}
      </div>
    </AppDialog>
  )
}
