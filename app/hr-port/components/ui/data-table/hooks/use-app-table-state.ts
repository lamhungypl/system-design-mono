import type {
  ColumnFiltersState,
  PaginationState,
  RowData,
  SortingState,
  TableOptions,
} from "@tanstack/react-table"
import { useControllableValue } from "ahooks"
import React, { SetStateAction, useCallback } from "react"
import { useSearchParams } from "react-router"

import { PER_PAGE_COUNT } from "~/hr-port/components/ui/data-table/constants"
import useParsedStateParams from "~/hr-port/components/ui/data-table/hooks/use-parsed-state-params"
import {
  generateSortParams,
  hasFilter,
} from "~/hr-port/components/ui/data-table/utils"
import { alphabeticalSort } from "~/hr-port/features/common/utils"
import { isFilterKey } from "~/hr-port/features/common/utils/routers"

const UNCONTROLLED_VALUE_PROP_NAME = "UNCONTROLLED_VALUE"

/**
 *  @param options table options
 *  @returns init core table state
 */
// prettier-ignore
export const useAppTableState = <T extends RowData>(options?: Partial<TableOptions<T>>) => { // NOSONAR
  const defaultValues = options?.meta?.defaultValues;
  const {
    globalFilter: defaultGlobalFilter,
    columnFilters: defaultColumnFilters,
    sorting: defaultSorting,
    pagination: defaultPagination,
  } = defaultValues || {};
   
  const [, setSearchParams] = useSearchParams();
  const {
    globalFilter: parsedGlobalFilter,
    columnFilters: parsedFilters,
    sorting: parsedSortParam,
    pagination: parsedPagination,
  } = useParsedStateParams();
  const { pageIndex: parsedPageIndex, pageSize: parsedPageSize } = parsedPagination ?? {};

  const syncWithLocation = options?.meta?.syncWithLocation;

  const initGlobalFilter = options?.initialState?.globalFilter || defaultGlobalFilter;
  const initColumnFilters = options?.initialState?.columnFilters || defaultColumnFilters;
  const initSorting = options?.initialState?.sorting || defaultSorting;
  const initPageIndex =
    options?.initialState?.pagination?.pageIndex || defaultPagination?.pageIndex;
  const initPageSize = options?.initialState?.pagination?.pageSize || defaultPagination?.pageSize;

  const [columnFilters, setColumnFilters] = useControllableValue(
    syncWithLocation
      ? {
          value: parsedFilters || defaultColumnFilters,
        }
      : undefined,
    {
      defaultValue: syncWithLocation
        ? parsedFilters || initColumnFilters || []
        : initColumnFilters || [],
      valuePropName: syncWithLocation ? 'value' : UNCONTROLLED_VALUE_PROP_NAME,
    }
  );

  const [globalFilter, setGlobalFilter] = useControllableValue(
    syncWithLocation
      ? {
          value: parsedGlobalFilter || defaultGlobalFilter,
        }
      : undefined,
    {
      defaultValue: syncWithLocation
        ? parsedGlobalFilter || initGlobalFilter || ''
        : initGlobalFilter || '',
      valuePropName: syncWithLocation ? 'value' : UNCONTROLLED_VALUE_PROP_NAME,
    }
  );
  const [sorting, setSorting] = useControllableValue(
    syncWithLocation
      ? {
          value: parsedSortParam || defaultSorting,
        }
      : undefined,
    {
      defaultValue: syncWithLocation ? parsedSortParam || initSorting || [] : initSorting || [],
      valuePropName: syncWithLocation ? 'value' : UNCONTROLLED_VALUE_PROP_NAME,
    }
  );

  const [pagination, setPagination] = useControllableValue<PaginationState>(
    syncWithLocation
      ? {
          value: {
            pageIndex: parsedPageIndex || defaultPagination?.pageIndex,
            pageSize: parsedPageSize || defaultPagination?.pageSize,
          },
        }
      : undefined,
    {
      defaultValue: syncWithLocation
        ? {
            pageSize: parsedPageSize || initPageSize || PER_PAGE_COUNT,
            pageIndex: parsedPageIndex || initPageIndex || 0,
          }
        : {
            pageSize: initPageSize || PER_PAGE_COUNT,
            pageIndex: initPageIndex || 0,
          },
      valuePropName: syncWithLocation ? 'value' : UNCONTROLLED_VALUE_PROP_NAME,
    }
  );

  const onGlobalFilterChange = useCallback<React.Dispatch<SetStateAction<string>>>(
    (updater) => {
      setGlobalFilter(updater);
      if (syncWithLocation) {
        const nextValue = typeof updater === 'function' ? updater(globalFilter) : updater;
        setSearchParams((prev) => {
          if (nextValue) {
            prev.set('search', nextValue);
          } else {
            prev.delete('search');
          }
          prev.sort();
          return prev;
        });
      }
    },
    [globalFilter, setGlobalFilter, setSearchParams, syncWithLocation]
  );

  const onPaginationChange = useCallback<React.Dispatch<SetStateAction<PaginationState>>>(
    (updater) => {
      setPagination(updater);
      if (syncWithLocation) {
        const nextValue = typeof updater === 'function' ? updater(pagination) : updater;
        const nextPage = nextValue.pageIndex + 1;
        const nextSize = nextValue.pageSize;
        setSearchParams((prev) => {
          if (nextPage > 1) {
            prev.set('page', nextPage.toString());
          } else {
            prev.delete('page');
          }

          if (nextSize !== PER_PAGE_COUNT) {
            prev.set('size', nextSize.toString());
          } else {
            prev.delete('size');
          }
          prev.sort();
          return prev;
        });
      }
    },
    [pagination, setPagination, setSearchParams, syncWithLocation]
  );

  const onSortingChange = useCallback<React.Dispatch<SetStateAction<SortingState>>>(
    (updater) => {
      setSorting(updater);
      if (syncWithLocation) {
        const nextValue = typeof updater === 'function' ? updater(sorting) : updater;
        const nextSortParam = generateSortParams(nextValue);
        setSearchParams((prev) => {
          if (nextSortParam) {
            prev.set('sort', nextSortParam);
          } else {
            prev.delete('sort');
          }
          prev.sort();
          return prev;
        });
      }
    },
    [setSorting, syncWithLocation, sorting, setSearchParams]
  );

  const onColumnFiltersChange = useCallback<React.Dispatch<SetStateAction<ColumnFiltersState>>>(
    (updater) => {
      setColumnFilters(updater);
      if (syncWithLocation) {
        const nextValue = typeof updater === 'function' ? updater(columnFilters) : updater;
        console.log('nextValue', nextValue);

        setSearchParams((prev) => {
          //NOTE: reset all filter params before set new filter
          Array.from(prev.keys()).forEach((key) => {
            if (isFilterKey(key)) {
              prev.delete(key);
            }
          });

          if (hasFilter(nextValue)) {
            nextValue.forEach((columnFilter) => {
              if (isFilterKey(columnFilter.id)) {
                if (Array.isArray(columnFilter.value)) {
                  columnFilter.value.sort(alphabeticalSort).forEach((value) => {
                    prev.append(columnFilter.id, value.toString());
                  });
                } else {
                  prev.set(columnFilter.id, (columnFilter.value as any)?.toString()); // NOSONAR
                }
              }
            });
          }
          prev.sort();
          return prev;
        });
      }
    },
    [columnFilters, setColumnFilters, setSearchParams, syncWithLocation]
  );

  return {
    columnFilters,
    globalFilter,
    sorting,
    pagination,
    setColumnFilters: onColumnFiltersChange,
    setGlobalFilter: onGlobalFilterChange,
    setSorting: onSortingChange,
    setPagination: onPaginationChange,
  };
};
