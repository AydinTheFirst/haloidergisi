import { Icon } from "@iconify/react";
import { useNavigate } from "@tanstack/react-router";
import { flexRender, Table as ReactTable } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import Pagination from "./pagination";

interface DataGridProps<T> {
  table: ReactTable<T>;
}

export function DataGrid<T>({ table }: DataGridProps<T>) {
  const navigate = useNavigate();

  return (
    <div className='space-y-4'>
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
                  <Button
                    onClick={header.column.getToggleSortingHandler()}
                    size='sm'
                    variant='ghost'
                  >
                    {flexRender(header.column.columnDef.header, header.getContext())}
                    <span className='size-4'>
                      {{
                        asc: <Icon icon='mdi:chevron-up' />,
                        desc: <Icon icon='mdi:chevron-down' />,
                      }[header.column.getIsSorted() as string] ?? null}
                    </span>
                  </Button>
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.map((row) => (
            <TableRow key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))}
          {table.getRowModel().rows.length === 0 && (
            <TableRow>
              <TableCell
                colSpan={table.getAllColumns().length}
                className='py-4 text-center'
              >
                No data found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <div className='grid grid-cols-3 items-center gap-4 border-t py-4'>
        <div className='flex justify-start' />

        <div className='flex justify-center'>
          <Pagination
            currentPage={table.getState().pagination.pageIndex + 1}
            totalPages={table.getPageCount()}
          />
        </div>
        <div className='flex justify-end gap-2'>
          <Select
            value={table.getState().pagination.pageSize.toString()}
            onValueChange={(value) =>
              // @ts-ignore
              navigate({ search: (old) => ({ ...old, limit: Number(value), page: 1 }) })
            }
          >
            <SelectTrigger className='h-10 w-30'>
              <SelectValue placeholder={table.getState().pagination.pageSize} />
            </SelectTrigger>
            <SelectContent>
              {[10, 20, 50].map((pageSize) => (
                <SelectItem
                  key={pageSize}
                  value={pageSize.toString()}
                >
                  {pageSize} göster
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
