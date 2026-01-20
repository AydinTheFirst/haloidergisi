import { Pagination } from "@heroui/react";
import { useLoaderData, useNavigate, useSearchParams } from "react-router";

import type { Comment } from "~/models/Comment";
import type { PaginatedResponse } from "~/types";

import DataTable from "~/components/data-table";
import FilterDrawer from "~/components/filter-drawer";
import { http } from "~/lib/http";

export const clientLoader = async ({ request }: { request: Request }) => {
  const { searchParams } = new URL(request.url);
  const page = searchParams.get("page") || "1";
  const limit = searchParams.get("limit") || "10";

  searchParams.set("limit", limit);
  searchParams.set("offset", String((+page - 1) * +limit));
  searchParams.set("include", "post,user");

  const { data: comments } = await http.get<PaginatedResponse<Comment>>("admin/comments", {
    params: Object.fromEntries(searchParams.entries()),
  });

  return { comments };
};

export default function CommentsList() {
  const { comments } = useLoaderData<typeof clientLoader>();
  const navigate = useNavigate();
  const [, setSearchParams] = useSearchParams();

  const columns = [
    { key: "content", label: "İçerik" },
    { key: "post", label: "Bağlı Olduğu Post" },
    { key: "user", label: "Kullanıcı" },
    { key: "createdAt", label: "Tarih" },
  ];

  const rows = comments.items.map((comment) => ({
    content: comment.content,
    createdAt: new Date(comment.createdAt).toLocaleString(),
    key: comment.id,
    post: comment.post?.title || "-",
    user: comment.user?.username || "-",
  }));

  return (
    <div className="grid gap-3">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Yorumlar</h2>
        <div className="flex justify-end">
          <FilterDrawer />
        </div>
      </div>

      <DataTable
        columns={columns}
        items={rows}
        onRowAction={(key) => navigate(`/dashboard/comments/${key}`)}
      />

      <Pagination
        className="mx-auto"
        onChange={(page) => {
          setSearchParams((prev) => {
            prev.set("page", String(page));
            return prev;
          });
        }}
        page={comments.meta.page}
        total={comments.meta.pageCount}
      />
    </div>
  );
}
