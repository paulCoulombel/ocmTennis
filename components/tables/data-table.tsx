"use client";

import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import clsx from "clsx";
import { useState } from "react";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  noResultMessage: string;
  fixedFirstColumn?: boolean;
  rowClassName?: string;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  noResultMessage,
  fixedFirstColumn,
  rowClassName,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnFiltersChange: setColumnFilters,
    state: {
      sorting,
      columnFilters,
    },
    rowCount: data.length,
    initialState: {
      pagination: {
        pageIndex: 0,
        pageSize: data.length,
      },
    },
  });

  return (
    <div className="rounded-md border border-neutral-600 bg-neutral-800 shadow-lg">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id} className="border-neutral-600">
              {headerGroup.headers.map((header, index) => {
                return (
                  <TableHead
                    className={clsx(
                      {
                        "sticky left-0 z-10": fixedFirstColumn && index === 0,
                      },
                      "bg-neutral-700 text-neutral-200 font-semibold border-r border-neutral-600/50",
                    )}
                    key={header.id}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row, indexRow) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
                className={clsx(
                  "border-neutral-600 hover:bg-neutral-700/50 text-neutral-200 transition-colors",
                  rowClassName,
                )}
              >
                {row.getVisibleCells().map((cell, indexCell) => (
                  <TableCell
                    className={clsx(
                      {
                        "sticky left-0 z-10":
                          fixedFirstColumn && indexCell === 0,
                      },
                      "bg-neutral-800 border-r border-neutral-600/30",
                      {
                        "bg-neutral-700/50": indexRow % 2 !== 0,
                      },
                    )}
                    key={cell.id}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow className="border-neutral-600">
              <TableCell
                colSpan={columns.length}
                className="h-24 text-center text-neutral-300 bg-neutral-800"
              >
                {noResultMessage}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
