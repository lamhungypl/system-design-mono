"use client"

import { DemoBlock } from "~/components/ui/demo-block"

import BasicDemo from "~/components/data-table/demos/basic"
import basicCode from "~/components/data-table/demos/basic.tsx?raw"

import SizesDemo from "~/components/data-table/demos/sizes"
import sizesCode from "~/components/data-table/demos/sizes.tsx?raw"

import BorderedDemo from "~/components/data-table/demos/bordered"
import borderedCode from "~/components/data-table/demos/bordered.tsx?raw"

import SortingDemo from "~/components/data-table/demos/sorting"
import sortingCode from "~/components/data-table/demos/sorting.tsx?raw"

import FilteringDemo from "~/components/data-table/demos/filtering"
import filteringCode from "~/components/data-table/demos/filtering.tsx?raw"

import PaginationDemo from "~/components/data-table/demos/pagination"
import paginationCode from "~/components/data-table/demos/pagination.tsx?raw"

import RowSelectionDemo from "~/components/data-table/demos/row-selection"
import rowSelectionCode from "~/components/data-table/demos/row-selection.tsx?raw"

import ExpandableDemo from "~/components/data-table/demos/expandable"
import expandableCode from "~/components/data-table/demos/expandable.tsx?raw"

import LoadingEmptyDemo from "~/components/data-table/demos/loading-empty"
import loadingEmptyCode from "~/components/data-table/demos/loading-empty.tsx?raw"

import InfiniteLoadingDemo from "~/components/data-table/demos/infinite-loading"
import infiniteLoadingCode from "~/components/data-table/demos/infinite-loading.tsx?raw"

import StickyHeaderInfiniteDemo from "~/components/data-table/demos/sticky-header-infinite"
import stickyHeaderInfiniteCode from "~/components/data-table/demos/sticky-header-infinite.tsx?raw"

import FixedColumnsDemo from "~/components/data-table/demos/fixed-columns"
import fixedColumnsCode from "~/components/data-table/demos/fixed-columns.tsx?raw"

import ColumnReorderDemo from "~/components/data-table/demos/column-reorder"
import columnReorderCode from "~/components/data-table/demos/column-reorder.tsx?raw"

import FilterFormDemo from "~/components/data-table/demos/filter-form"
import filterFormCode from "~/components/data-table/demos/filter-form.tsx?raw"

import CollapsibleFiltersDemo from "~/components/data-table/demos/collapsible-filters"
import collapsibleFiltersCode from "~/components/data-table/demos/collapsible-filters.tsx?raw"

import RowGroupingDemo from "~/components/data-table/demos/row-grouping"
import rowGroupingCode from "~/components/data-table/demos/row-grouping.tsx?raw"

import InlineEditDemo from "~/components/data-table/demos/inline-edit"
import inlineEditCode from "~/components/data-table/demos/inline-edit.tsx?raw"

import QueryUrlParamsDemo from "~/components/data-table/demos/query-url-params"
import queryUrlParamsCode from "~/components/data-table/demos/query-url-params.tsx?raw"

export default function DataTableDemo() {
  return (
    <div className="p-8 space-y-6">
      <header>
        <h1 className="text-xl font-semibold">Data Table</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          A feature-rich table with sorting, filtering, pagination, row selection, and
          row expansion. Each demo shows the same feature two ways — via the monolithic{" "}
          <code>{"<DataTable />"}</code> facade and via the composition parts
          (<code>DataTable.Root / Container / Table / Header / Body / Pagination</code>).
        </p>
      </header>

      <DemoBlock
        title="Basic"
        description="Minimal columns plus data. Both APIs render an identical table."
        code={basicCode}
      >
        <BasicDemo />
      </DemoBlock>

      <DemoBlock
        title="Sizes"
        description="small / middle / large — changes cell padding and font size via the size prop."
        code={sizesCode}
      >
        <SizesDemo />
      </DemoBlock>

      <DemoBlock
        title="Bordered"
        description="Adds vertical cell borders when bordered is passed."
        code={borderedCode}
      >
        <BorderedDemo />
      </DemoBlock>

      <DemoBlock
        title="Sorting"
        description="Pass sorter on a column to make it sortable. Click the header arrows to toggle asc / desc / off."
        code={sortingCode}
      >
        <SortingDemo />
      </DemoBlock>

      <DemoBlock
        title="Filtering"
        description="Columns with a filters array get a filter icon that opens a multi-select popover."
        code={filteringCode}
      >
        <FilteringDemo />
      </DemoBlock>

      <DemoBlock
        title="Pagination"
        description="Pass a pagination config (or false to disable). Defaults to page size 10 with a size changer."
        code={paginationCode}
      >
        <PaginationDemo />
      </DemoBlock>

      <DemoBlock
        title="Row selection"
        description="Pass rowSelection to add a checkbox column. Supports controlled selectedRowKeys + onChange."
        code={rowSelectionCode}
      >
        <RowSelectionDemo />
      </DemoBlock>

      <DemoBlock
        title="Expandable rows"
        description="Pass expandable.expandedRowRender to add an expand column with a nested detail panel."
        code={expandableCode}
      >
        <ExpandableDemo />
      </DemoBlock>

      <DemoBlock
        title="Loading and empty"
        description="loading shows a spinner overlay; an empty dataSource renders the locale.emptyText slot."
        code={loadingEmptyCode}
      >
        <LoadingEmptyDemo />
      </DemoBlock>

      <DemoBlock
        title="Infinite loading"
        description="An IntersectionObserver sentinel triggers onLoadMore when it scrolls into view. Pass hasMore, loading, onLoadMore via the infinite prop."
        code={infiniteLoadingCode}
      >
        <InfiniteLoadingDemo />
      </DemoBlock>

      <DemoBlock
        title="Sticky header + infinite scroll"
        description="Set scroll.y (monolith) or scrollY (composition) to turn the container into a scroll viewport — the header auto-sticks to the top."
        code={stickyHeaderInfiniteCode}
      >
        <StickyHeaderInfiniteDemo />
      </DemoBlock>

      <DemoBlock
        title="Column freezing"
        description="Mark columns with fixed: 'left' or 'right' — they stay pinned during horizontal scroll via CSS position:sticky."
        code={fixedColumnsCode}
      >
        <FixedColumnsDemo />
      </DemoBlock>

      <DemoBlock
        title="Column reorder"
        description="Drag a column header onto another to reorder. The columnOrder state is controlled; the onColumnReorder callback gives you source+target ids."
        code={columnReorderCode}
      >
        <ColumnReorderDemo />
      </DemoBlock>

      <DemoBlock
        title="Filter toolbar as form"
        description="The toolbar is a plain form with its own draft state. Data only updates when the user clicks Apply."
        code={filterFormCode}
      >
        <FilterFormDemo />
      </DemoBlock>

      <DemoBlock
        title="Collapsible filter toolbar"
        description="A self-contained toolbar that can collapse to save vertical space. Badges surface how many filters are active while collapsed."
        code={collapsibleFiltersCode}
      >
        <CollapsibleFiltersDemo />
      </DemoBlock>

      <DemoBlock
        title="Row grouping"
        description="Pass grouping={[columnId]} to aggregate rows by a field. Group headers are collapsible — click the chevron to expand/hide the group."
        code={rowGroupingCode}
      >
        <RowGroupingDemo />
      </DemoBlock>

      <DemoBlock
        title="Inline edit cell"
        description="Cells render custom components via the column.render hook. Click text to edit in place; Role uses a select."
        code={inlineEditCode}
      >
        <InlineEditDemo />
      </DemoBlock>

      <DemoBlock
        title="TanStack Query + URL params"
        description="useQuery drives the data (mocked queryFn). Filters and pagination live in ?role=&status=&page=&size= — reload the page and state persists."
        code={queryUrlParamsCode}
      >
        <QueryUrlParamsDemo />
      </DemoBlock>
    </div>
  )
}
