import { FileText } from "lucide-react"

import {
  AppDocsCSVIcon,
  AppDocsXLSXIcon,
} from "~/hr-port/assets/svgs/icons/Icon"

export enum FILE_TYPE {
  CSV = "CSV",
  JPEG = "JPEG",
  JPG = "JPG",
  PDF = "PDF",
  PNG = "PNG",
  XLSX = "Excel",
}

export const supportedFileTypes = [
  FILE_TYPE.CSV,
  FILE_TYPE.JPEG,
  FILE_TYPE.JPG,
  FILE_TYPE.PNG,
  FILE_TYPE.PDF,
  FILE_TYPE.XLSX,
]

export const fileSuffixIconList = [
  { icon: <FileText />, suffix: [".pdf"] },
  { icon: <AppDocsCSVIcon />, suffix: [".csv"] },
  { icon: <AppDocsXLSXIcon />, suffix: [".xlsx", ".xls"] },
]

export const MAX_SIZE_IMPORT_FILE = 25 * 1024 * 1024
