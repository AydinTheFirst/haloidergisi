import {
  getKeyValue,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow
} from "@heroui/react";
import { useEffect } from "react";
import { useLoaderData, useNavigate } from "react-router";

import type { Post } from "@/types";
import type { PaginatedResponse } from "@/types/extended";

import http from "@/http";

export const clientLoader = async () => {
  const { data: posts } =
    await http.get<PaginatedResponse<Post>>("/posts?limit=100");
  return posts;
};

const ViewPosts = () => {
  const navigate = useNavigate();
  const posts = useLoaderData<typeof clientLoader>();

  useEffect(() => {
    if (!posts) return;
  }, [posts]);

  const handleRowAction = (key: React.Key) => {
    navigate(`/dashboard/posts/${key}`);
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

  const rows = posts.data.map((post) => ({
    key: post.id,
    title: post.title,
    updatedAt: new Date(post.updatedAt).toLocaleString()
  }));

  return (
    <section className='grid gap-5'>
      <div className='grid grid-cols-1 gap-3 md:grid-cols-2'>
        <div className='flex items-end justify-start gap-3'>
          <h2 className='text-2xl font-bold'>Dergiler</h2>
        </div>
      </div>

      <Table
        aria-label='Example table with dynamic content'
        isStriped
        onRowAction={handleRowAction}
        selectionMode='single'
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
    </section>
  );
};

export default ViewPosts;
