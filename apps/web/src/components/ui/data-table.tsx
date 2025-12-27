'use client';

import * as React from 'react';
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { ChevronDown, ChevronsUpDown, ChevronUp, Settings2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  isLoading?: boolean;
  searchKey?: string;
  searchPlaceholder?: string;
  pageSize?: number;
  showColumnToggle?: boolean;
  showPagination?: boolean;
  onRowClick?: (row: TData) => void;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  isLoading = false,
  searchKey,
  searchPlaceholder = 'Search...',
  pageSize = 10,
  showColumnToggle = true,
  showPagination = true,
  onRowClick,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
    initialState: {
      pagination: {
        pageSize,
      },
    },
  });

  if (isLoading) {
    return <DataTableSkeleton columnCount={columns.length} />;
  }

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex items-center justify-between gap-4">
        {searchKey && (
          <Input
            placeholder={searchPlaceholder}
            value={(table.getColumn(searchKey)?.getFilterValue() as string) ?? ''}
            onChange={(event) => table.getColumn(searchKey)?.setFilterValue(event.target.value)}
            className="max-w-sm bg-white/[0.04] border-white/[0.08] text-white placeholder:text-white/30 focus:ring-amber-500/50"
          />
        )}
        <div className="flex items-center gap-2 ml-auto">
          {Object.keys(rowSelection).length > 0 && (
            <span className="text-sm text-white/50">
              {Object.keys(rowSelection).length} selected
            </span>
          )}
          {showColumnToggle && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-9 border-white/[0.1] bg-white/[0.02] text-white/70 hover:bg-white/[0.06] hover:text-white">
                  <Settings2 className="mr-2 h-4 w-4" />
                  Columns
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[160px] bg-[#151515] border-white/[0.1]">
                {table
                  .getAllColumns()
                  .filter((column) => column.getCanHide())
                  .map((column) => {
                    return (
                      <DropdownMenuCheckboxItem
                        key={column.id}
                        className="capitalize text-white/70 focus:bg-white/[0.08] focus:text-white"
                        checked={column.getIsVisible()}
                        onCheckedChange={(value) => column.toggleVisibility(!!value)}
                      >
                        {column.id.replace(/_/g, ' ')}
                      </DropdownMenuCheckboxItem>
                    );
                  })}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="rounded-lg border border-white/[0.08] bg-white/[0.02] overflow-hidden">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="hover:bg-transparent border-white/[0.08]">
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="bg-white/[0.04] text-white/60 first:rounded-tl-lg last:rounded-tr-lg border-white/[0.08]">
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                  className={cn(
                    'border-white/[0.06] hover:bg-white/[0.04] data-[state=selected]:bg-white/[0.06]',
                    onRowClick && 'cursor-pointer'
                  )}
                  onClick={() => onRowClick?.(row.original)}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="text-white/80">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow className="border-white/[0.06]">
                <TableCell colSpan={columns.length} className="h-24 text-center text-white/50">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <p>No results found.</p>
                    {searchKey && Boolean(table.getColumn(searchKey)?.getFilterValue()) && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => table.getColumn(searchKey)?.setFilterValue('')}
                        className="text-white/60 hover:text-white hover:bg-white/[0.06]"
                      >
                        Clear search
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {showPagination && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-white/40">
            Showing {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1} to{' '}
            {Math.min(
              (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
              table.getFilteredRowModel().rows.length
            )}{' '}
            of {table.getFilteredRowModel().rows.length} results
          </p>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="border-white/[0.1] bg-white/[0.02] text-white/70 hover:bg-white/[0.06] hover:text-white disabled:opacity-40"
            >
              Previous
            </Button>
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, table.getPageCount()) }, (_, i) => {
                const pageIndex = table.getState().pagination.pageIndex;
                const pageCount = table.getPageCount();
                let pageNumber: number;

                if (pageCount <= 5) {
                  pageNumber = i;
                } else if (pageIndex < 3) {
                  pageNumber = i;
                } else if (pageIndex > pageCount - 4) {
                  pageNumber = pageCount - 5 + i;
                } else {
                  pageNumber = pageIndex - 2 + i;
                }

                return (
                  <Button
                    key={pageNumber}
                    variant={pageIndex === pageNumber ? 'default' : 'outline'}
                    size="sm"
                    className={cn(
                      "h-8 w-8 p-0",
                      pageIndex === pageNumber
                        ? "bg-amber-500 text-black hover:bg-amber-400"
                        : "border-white/[0.1] bg-white/[0.02] text-white/70 hover:bg-white/[0.06] hover:text-white"
                    )}
                    onClick={() => table.setPageIndex(pageNumber)}
                  >
                    {pageNumber + 1}
                  </Button>
                );
              })}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="border-white/[0.1] bg-white/[0.02] text-white/70 hover:bg-white/[0.06] hover:text-white disabled:opacity-40"
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

// Sortable Header Component
interface DataTableColumnHeaderProps<TData, TValue> extends React.HTMLAttributes<HTMLDivElement> {
  column: import('@tanstack/react-table').Column<TData, TValue>;
  title: string;
}

export function DataTableColumnHeader<TData, TValue>({
  column,
  title,
  className,
}: DataTableColumnHeaderProps<TData, TValue>) {
  if (!column.getCanSort()) {
    return <div className={cn(className)}>{title}</div>;
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      className={cn('-ml-3 h-8 data-[state=open]:bg-accent', className)}
      onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
    >
      {title}
      {column.getIsSorted() === 'desc' ? (
        <ChevronDown className="ml-2 h-4 w-4" />
      ) : column.getIsSorted() === 'asc' ? (
        <ChevronUp className="ml-2 h-4 w-4" />
      ) : (
        <ChevronsUpDown className="ml-2 h-4 w-4" />
      )}
    </Button>
  );
}

// Selection Checkbox Component
export function DataTableRowCheckbox<TData>({
  row,
}: {
  row: import('@tanstack/react-table').Row<TData>;
}) {
  return (
    <Checkbox
      checked={row.getIsSelected()}
      onCheckedChange={(value) => row.toggleSelected(!!value)}
      aria-label="Select row"
      onClick={(e) => e.stopPropagation()}
    />
  );
}

export function DataTableHeaderCheckbox<TData>({
  table,
}: {
  table: import('@tanstack/react-table').Table<TData>;
}) {
  return (
    <Checkbox
      checked={
        table.getIsAllPageRowsSelected() ||
        (table.getIsSomePageRowsSelected() && 'indeterminate')
      }
      onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
      aria-label="Select all"
    />
  );
}

// Loading Skeleton
function DataTableSkeleton({ columnCount }: { columnCount: number }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Skeleton className="h-9 w-[250px] bg-white/[0.06]" />
        <Skeleton className="h-9 w-[100px] bg-white/[0.06]" />
      </div>
      <div className="rounded-lg border border-white/[0.08] bg-white/[0.02]">
        <div className="border-b border-white/[0.08] bg-white/[0.04] px-4 py-3">
          <div className="flex gap-4">
            {Array.from({ length: columnCount }).map((_, i) => (
              <Skeleton key={i} className="h-4 w-24 bg-white/[0.06]" />
            ))}
          </div>
        </div>
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="border-b border-white/[0.06] px-4 py-4 last:border-0">
            <div className="flex gap-4">
              {Array.from({ length: columnCount }).map((_, j) => (
                <Skeleton key={j} className="h-4 w-24 bg-white/[0.06]" />
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-[200px] bg-white/[0.04]" />
        <div className="flex gap-2">
          <Skeleton className="h-9 w-20 bg-white/[0.06]" />
          <Skeleton className="h-9 w-20 bg-white/[0.06]" />
        </div>
      </div>
    </div>
  );
}
