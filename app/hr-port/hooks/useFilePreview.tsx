import { useEffect, useMemo, useState } from "react"

import { fileSuffixIconList } from "~/hr-port/components/ui/file-uploader/constants"
import { UploadFile } from "~/hr-port/components/ui/file-uploader/types"

type Props = {
  file: UploadFile
  previewUrl?: string
}
export const useFilePreview = (props: Props) => {
  const { file, previewUrl: previewUrlProp } = props
  const [preview, setPreview] = useState("")

  const previewIcon = useMemo(() => {
    return (
      fileSuffixIconList.find((item) =>
        item.suffix.includes(file.name.slice(file.name.lastIndexOf(".")))
      )?.icon ?? null
    )
  }, [file.name])

  useEffect(() => {
    let objectUrl = ""
    if (file.url) {
      objectUrl = file.url
    } else if (file.originObj) {
      objectUrl = URL.createObjectURL(file.originObj)
    }
    setPreview(objectUrl)

    return () => URL.revokeObjectURL(objectUrl)
  }, [file])

  return { preview: previewUrlProp || preview, previewIcon }
}
