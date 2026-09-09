import { saveAs } from "file-saver"

export const fileSaveAs = (data: Blob | string, filename?: string) => {
  saveAs(data, filename)
}

export const openFileInNewTab = (info: {
  file?: Blob
  fileName?: string
  url?: string
}) => {
  const { file, url: fileUrl } = info
  const url = fileUrl ?? (file ? window.URL.createObjectURL(file) : "")

  if (!url) {
    return
  }
  window.open(url, "_blank")
}
