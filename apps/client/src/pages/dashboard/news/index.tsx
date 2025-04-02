import {
  getKeyValue,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow
} from "@heroui/react";
import { Key } from "react";
import { useNavigate } from "react-router";
import useSWR from "swr";

import { News } from "@/types";

export default function ViewNews() {
  const navigate = useNavigate();
  const { data: news } = useSWR<News[]>("/news");

  const handleRowAction = (key: Key) => {
    navigate(`/dashboard/news/${key}`);
  };

  const columns = [
    {
      key: "title",
      label: "Başlık"
    },
    {
      key: "updatedAt",
      label: "Son Güncelleme"
    }
  ];

  const rows = news?.map((post) => ({
    key: post.id,
    title: post.title,
    updatedAt: new Date(post.updatedAt).toLocaleString()
  }));

  return (
    <Table
      aria-label='Example table with dynamic content'
      isStriped
      onRowAction={handleRowAction}
      selectionMode='single'
    >
      <TableHeader columns={columns}>
        {(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}
      </TableHeader>
      <TableBody
        emptyContent='No data found'
        items={rows || []}
      >
        {(item) => (
          <TableRow key={item.key}>
            {(columnKey) => (
              <TableCell>{getKeyValue(item, columnKey)}</TableCell>
            )}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
