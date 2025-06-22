import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  type TableProps,
  TableRow
} from "@heroui/react";

export interface Column {
  key: string;
  label: string;
}

export interface DataTableProps extends TableProps {
  columns: Column[];
  items: Row[];
}

export interface Row {
  [key: string]: React.ReactNode;
  key: string;
}

export default function DataTable({ columns, items, ...rest }: DataTableProps) {
  return (
    <div className='overflow-x-auto p-1'>
      <Table
        aria-label='Example table with dynamic content'
        isStriped
        selectionMode='single'
        {...rest}
      >
        <TableHeader>
          {columns.map((column) => (
            <TableColumn key={column.key}>{column.label}</TableColumn>
          ))}
        </TableHeader>
        <TableBody emptyContent='Veri yok'>
          {items.map((row) => (
            <TableRow key={row.key}>
              {columns.map((column) => (
                <TableCell key={column.key}>{row[column.key] ?? "-"}</TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
