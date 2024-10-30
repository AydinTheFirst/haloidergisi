import { useHTTP } from "@/hooks";
import { ICategory } from "@/types";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  getKeyValue,
} from "@nextui-org/react";
import { Key } from "react";
import { useNavigate } from "react-router-dom";

export const CategoryTable = () => {
  const navigate = useNavigate();
  const { data: categories } = useHTTP<ICategory[]>("/categories");
  const { data: magazines } = useHTTP<any[]>("/magazines");

  if (!categories) return <div>Loading...</div>;

  const columns = [
    {
      key: "title",
      label: "NAME",
    },
    {
      key: "description",
      label: "DESC",
    },
    {
      key: "magazines",
      label: "MAGAZINES",
    },
  ];

  const rows = categories.map((category) => {
    const magazineCount = magazines?.filter(
      (magazine) => magazine.categoryId === category.id,
    ).length;
    return {
      key: category.id,
      id: category.id,
      title: category.title,
      description: category.description,
      magazines: magazineCount || 0,
    };
  });

  const handleRowAction = (key: Key) => {
    navigate(`/dashboard/categories/${key.toString()}`);
  };

  return (
    <div>
      <Table
        aria-label="Example static collection table"
        isStriped
        selectionMode="single"
        onRowAction={handleRowAction}
      >
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn key={column.key}>{column.label}</TableColumn>
          )}
        </TableHeader>
        <TableBody items={rows}>
          {(item) => (
            <TableRow key={item.key}>
              {(columnKey) => (
                <TableCell>{getKeyValue(item, columnKey)}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default CategoryTable;
