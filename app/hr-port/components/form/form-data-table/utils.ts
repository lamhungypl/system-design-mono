import { FieldErrors } from "react-hook-form"

export const isGridError = (error: unknown): error is FieldErrors<any>[] => {
  return Array.isArray(error)
}
