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

interface PoolRankingTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  noResultMessage: string;
}

export function PoolRankingTable<TData extends { fromClub: boolean }, TValue>({
  columns,
  data,
  noResultMessage,
}: PoolRankingTableProps<TData, TValue>) {
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
  });

  return (
    <div className="rounded-md border border-slate-600 bg-slate-800 shadow-lg">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id} className="border-slate-600">
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead
                    className="bg-slate-700 text-slate-200 font-semibold border-r border-slate-600/50"
                    key={header.id}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
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
                  "border-slate-600 transition-colors text-slate-200",
                  {
                    "bg-yellow-500/20 border-l-4 border-yellow-500":
                      row.original.fromClub,
                    "hover:bg-slate-700/30": !row.original.fromClub,
                    "hover:bg-yellow-500/20": row.original.fromClub,
                  }
                )}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell
                    className="bg-transparent border-r border-slate-600/30"
                    key={cell.id}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow className="border-slate-600">
              <TableCell
                colSpan={columns.length}
                className="h-24 text-center text-slate-300 bg-slate-800"
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
