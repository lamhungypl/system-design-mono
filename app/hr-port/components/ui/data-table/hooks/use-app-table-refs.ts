import { Table } from "@tanstack/react-table"
import { useRef } from "react"

/**
 *
 *  @returns refs to table anatomies: container, table, thead, ....
 */
export const useAppTableRefs = (): Table<unknown>["refs"] => {
  const lastRowRef = useRef<HTMLDivElement | null>(null)
  const scrollAreaRef = useRef<HTMLDivElement | null>(null)
  const tableContainerRef = useRef<HTMLDivElement | null>(null)
  const topToolbarRef = useRef<HTMLDivElement | null>(null)
  const paginationRef = useRef<HTMLDivElement | null>(null)
  return {
    lastRowRef,
    scrollAreaRef,
    tableContainerRef,
    topToolbarRef,
    paginationRef,
  }
}
