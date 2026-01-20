import { Pagination } from "@heroui/react";
import { useLoaderData, useNavigate, useSearchParams } from "react-router";

import type { Reaction } from "~/models/Reaction";
import type { PaginatedResponse } from "~/types";

import DataTable from "~/components/data-table";
import { http } from "~/lib/http";

export const clientLoader = async ({ request }: { request: Request }) => {
  const { searchParams } = new URL(request.url);
  const page = searchParams.get("page") || "1";
  const limit = searchParams.get("limit") || "10";

  searchParams.set("limit", limit);
  searchParams.set("offset", String((+page - 1) * +limit));
  searchParams.set("include", "user,post");

  const { data: reactions } = await http.get<PaginatedResponse<Reaction>>("/admin/reactions", {
    params: Object.fromEntries(searchParams.entries()),
  });

  return { reactions };
};

export default function ReactionsList() {
  const { reactions } = useLoaderData<typeof clientLoader>();
  const navigate = useNavigate();
  const [, setSearchParams] = useSearchParams();

  const columns = [
    { key: "type", label: "Tepki" },
    { key: "user", label: "Kullanıcı" },
    { key: "post", label: "Post" },
    { key: "createdAt", label: "Tarih" },
  ];

  const rows = reactions.items.map((reaction) => ({
    createdAt: new Date(reaction.createdAt).toLocaleString(),
    key: reaction.id,
    post: reaction.post?.title || "-",
    type: reaction.type,
    user: reaction.user?.username || "-",
  }));

  return (
    <div className="grid gap-3">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Reaksiyonlar</h2>
      </div>

      <DataTable
        columns={columns}
        items={rows}
        onRowAction={(key) => navigate(`/dashboard/reactions/${key}`)}
      />

      <Pagination
        className="mx-auto"
        onChange={(page) => {
          setSearchParams((prev) => {
            prev.set("page", String(page));
            return prev;
          });
        }}
        page={reactions.meta.page}
        total={reactions.meta.pageCount}
      />
    </div>
  );
}
