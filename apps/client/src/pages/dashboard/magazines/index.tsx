import { useHTTP } from "@/hooks";
import { useNavigate } from "react-router-dom";
import { ICategory, IMagazine } from "@/types";
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

export const MagazineTable = () => {
  const navigate = useNavigate();
  const { data: magazines } = useHTTP<IMagazine[]>("/magazines");
  const { data: categories } = useHTTP<ICategory[]>("/categories");

  if (!magazines) return <div>Loading...</div>;

  /*   const deleteOne = async (id: string) => {
    const ok = window.confirm("Are you sure you want to delete this magazine?");
    if (!ok) return;

    try {
      await http.delete(`/magazines/${id}`);
      toast.success("Magazine deleted");
      location.reload();
    } catch (error) {
      httpError(error);
    }
  }; */

  const columns = [
    {
      key: "title",
      label: "NAME",
    },
    {
      key: "categoryId",
      label: "CATEGORY",
    },
    {
      key: "timestamp",
      label: "DATE",
    },
    {
      key: "status",
      label: "STATUS",
    },
  ];

  const rows = magazines.map((magazine) => {
    const category = categories?.find((c) => c.id === magazine.categoryId);
    return {
      key: magazine.id,
      id: magazine.id,
      title: magazine.title,
      categoryId: category ? category.title : "N/A",
      timestamp: new Date(Number(magazine.timestamp)).toLocaleDateString(),
      status: magazine.status.toUpperCase(),
    };
  });

  const handleRowAction = (key: Key) => {
    navigate(`/dashboard/magazines/${key}`);
  };

  return (
    <>
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
    </>
  );
};

export default MagazineTable;
