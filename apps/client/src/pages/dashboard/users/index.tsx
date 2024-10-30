import { useHTTP } from "@/hooks";
import { IUser } from "@/types";
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

export const UsersTable = () => {
  const navigate = useNavigate();
  const { data: users } = useHTTP<IUser[]>("/users");

  if (!users) return <div>Loading...</div>;

  const columns = [
    {
      key: "displayName",
      label: "NAME",
    },
    {
      key: "role",
      label: "ROLE",
    },
    {
      key: "isAdmin",
      label: "ADMIN",
    },
  ];

  const rows = users.map((user) => {
    return {
      key: user.id,
      id: user.id,
      displayName: user.displayName,
      role: user.role,
      isAdmin: user.isAdmin ? "Yes" : "No",
    };
  });

  const handleRowAction = (key: Key) => {
    navigate(`/dashboard/users/${key.toString()}`);
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

export default UsersTable;
