import { Button } from "@adn-ui/react";
import { Select } from "@adn-ui/react";
import { Icon } from "@iconify/react";
import { useNavigate } from "@tanstack/react-router";
import { flexRender, Table } from "@tanstack/react-table";

import Pagination from "./pagination";

interface DataGridProps<T> extends React.ComponentProps<"table"> {
  table: Table<T>;
}

export function DataGrid<T>({ table, ...props }: DataGridProps<T>) {
  const navigate = useNavigate();

  return (
    <div className='space-y-4'>
      <div className='table-container'>
        <table {...props}>
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id}>
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
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
                ))}
              </tr>
            ))}
            {table.getRowModel().rows.length === 0 && (
              <tr>
                <td
                  colSpan={table.getAllColumns().length}
                  className='py-4 text-center'
                >
                  No data found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className='grid grid-cols-3 items-center gap-4 border-t py-4'>
        <div className='flex justify-start'>{/* Placeholder for any additional content */}</div>

        <div className='flex justify-center'>
          <Pagination
            currentPage={table.getState().pagination.pageIndex + 1}
            totalPages={table.getPageCount()}
          />
        </div>
        <div className='flex justify-end'>
          <Select
            value={table.getState().pagination.pageSize}
            onChange={(e) =>
              // @ts-ignore
              navigate({ search: (old) => ({ ...old, limit: Number(e.target.value), page: 1 }) })
            }
            className='h-10 max-w-xs'
          >
            {[10, 20, 50].map((pageSize) => (
              <option
                key={pageSize}
                value={pageSize}
              >
                {pageSize} göster
              </option>
            ))}
          </Select>
        </div>
      </div>
    </div>
  );
}
