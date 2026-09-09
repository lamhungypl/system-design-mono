import { useCallback, useMemo } from "react"
import { FileWithPath } from "react-dropzone"
import { useController, useFormContext } from "react-hook-form"

import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "~/hr-port/components/base/form"
import FormFieldViewOnly from "~/hr-port/components/form/form-field-view-only/form-field-view-only"
import { FormFileData } from "~/hr-port/components/form/form-file-uploader/types"
import { convertFormValueToFiles } from "~/hr-port/components/form/form-file-uploader/utils"
import { FormFieldProps } from "~/hr-port/components/form/types"
import { useAppDialog } from "~/hr-port/components/ui/app-dialog/hooks/use-app-dialog"
import FileUploader, {
  FileUploaderProps,
} from "~/hr-port/components/ui/file-uploader/file-uploader"
import { UploadFile } from "~/hr-port/components/ui/file-uploader/types"
import { isImageUrl } from "~/hr-port/components/ui/file-uploader/utils"
import { ControlType } from "~/hr-port/constants"
import { previewDocument } from "~/hr-port/features/documents/api/documents.api"
import { openFileInNewTab } from "~/hr-port/features/documents/utils"

export type FormSwitchProps = FileUploaderProps & FormFieldProps

const FormFileUploader = (props: FormSwitchProps) => {
  const { name, viewOnly, ...rest } = props
  const { openAppDialog } = useAppDialog()
  const methods = useFormContext()
  const { control } = methods
  const {
    field: { value: formValue, onChange, ref },
  } = useController({ name, control })

  const innerValue = useMemo(
    () => convertFormValueToFiles(formValue),
    [formValue]
  )

  const handleDownload = useCallback(
    // prettier-ignore
    (values: UploadFile[]) => { // NOSONAR
      const fileToDownload = values?.[0];
      const fileName = fileToDownload?.name;

      const isRemoteFile = !fileToDownload.status;
      const isImage = isImageUrl(fileToDownload);

      if (isRemoteFile) {
        try {
          previewDocument({ id: fileToDownload.id }).then((res) => {
            const previewUrl = res.data;
            if (previewUrl) {
              if (isImage) {
                openAppDialog('AppPreviewDialog', { file: fileToDownload, previewUrl: previewUrl });
              } else {
                openFileInNewTab({ url: previewUrl, fileName });
              }
            }
          });
        } catch (e) {
          console.log('Logged error', e);
        }
      } else if (values.length > 0 && !!fileToDownload.originObj) {
        if (isImage) {
          openAppDialog('AppPreviewDialog', { file: fileToDownload });
        } else {
          openFileInNewTab({ file: fileToDownload.originObj, fileName: fileName });
        }
      }
    },
    [openAppDialog]
  )

  const transformValue = useCallback(
    (uploadInnerValue: FileWithPath[]) => {
      //TODO: view of multiple file values?
      const values = convertFormValueToFiles(uploadInnerValue)
      const fileName = values?.[0]?.name
      if (!fileName) return null
      return (
        <span
          className="cursor-pointer font-medium text-action-blue"
          onClick={() => {
            handleDownload(values)
          }}
        >
          {fileName}
        </span>
      )
    },
    [handleDownload]
  )

  if (viewOnly) {
    return <FormFieldViewOnly {...props} transformValue={transformValue} />
  }
  return (
    <FormField name={name}>
      <FormItem className="justify-start gap-3">
        <FormControl>
          <FileUploader
            {...rest}
            ref={ref}
            value={innerValue}
            onChange={async (files) => {
              const file = files[files.length - 1]
              if (file) {
                onChange([
                  Object.assign(file, {
                    controlType: ControlType.FILE_UPLOADER,
                  } satisfies Partial<FormFileData>),
                ])
              } else {
                onChange([])
              }
            }}
          />
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>
  )
}

export default FormFileUploader
