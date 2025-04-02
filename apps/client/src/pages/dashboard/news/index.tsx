import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/react";
import {
  ColumnDef,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { LucideArrowUpDown } from "lucide-react";
import React, { useState } from "react";
import useSWR from "swr";

import { News } from "@/types";

export default function ViewNews() {
  const [sorting, setSorting] = useState<SortingState>([]);

  const { data: news } = useSWR<News[]>("/news");

  const columns = React.useMemo(() => {
    return [
      {
        accessorKey: "title",
        header: ({ column }) => (
          <button
            className="flex items-center gap-1"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Başlık <LucideArrowUpDown className="h-4 w-4" />
          </button>
        ),
      },
      {
        accessorKey: "createdAt",
        header: "Tarih",
      },
    ] as ColumnDef<News>[];
  }, []);

  const table = useReactTable({
    columns,
    data: news ?? [],
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    state: { sorting },
  });

  return (
    <Table
      aria-label="Example table with sorting"
      isStriped
      selectionMode="single"
    >
      <TableHeader>
        {table.getHeaderGroups().map((headerGroup) => (
          <React.Fragment key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <TableColumn key={header.id}>
                {header.isPlaceholder
                  ? null
                  : header.column.columnDef.header instanceof Function
                    ? header.column.columnDef.header(header.getContext())
                    : header.column.columnDef.header}
              </TableColumn>
            ))}
          </React.Fragment>
        ))}
      </TableHeader>
      <TableBody>
        {table.getRowModel().rows.map((row) => (
          <TableRow key={row.id}>
            {row.getVisibleCells().map((cell) => (
              <TableCell key={cell.id}>{cell.getValue()?.toString()}</TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
