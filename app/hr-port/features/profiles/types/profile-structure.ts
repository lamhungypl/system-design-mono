import { Field, FieldMap } from "~/hr-port/features/dynamic-form/types"
import { ApiResponse, ApiResult } from "~/hr-port/types/common"

export type GetCompanyStructure = () => Promise<GetStructureResult>
export type GetEmployeeStructure = () => Promise<GetStructureResult>

export type ProfileStructure = {
  id: number
  label: string
  section_infos: SectionInfo[]
} & ProfileStructureMetadata

export type ProfileStructureMetadata = {
  extracted_fields: Field[]
  field_map: FieldMap
}

export type GetStructureResult = ApiResult<ProfileStructure>

export type GetStructureResponse = ApiResponse<ProfileStructure>

export type SectionInfo = {
  subsection_infos: SubSectionInfo[]
} & SubSectionInfo

export type SubSectionInfo = {
  fields: Field[]
  id: number | string
  label: string
  sort_order: number
  title: string
}
