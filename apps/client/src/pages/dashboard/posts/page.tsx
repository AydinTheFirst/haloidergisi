import type { Post } from "~/models/Post";
import type { PaginatedResponse } from "~/types";

import { Link, Pagination } from "@heroui/react";
import DataTable from "~/components/data-table";
import FilterDrawer from "~/components/filter-drawer";
import { http } from "~/lib/http";
import { useLoaderData, useNavigate, useSearchParams } from "react-router";

import type { Route } from "./+types/page";

export const clientLoader = async ({ request }: Route.LoaderArgs) => {
  const { searchParams } = new URL(request.url);

  const page = searchParams.get("page") || "1";
  const limit = searchParams.get("limit") || "10";
  searchParams.set("limit", limit);
  searchParams.set("offset", String((+page - 1) * +limit));
  searchParams.set("include", "category,reactions,comments");

  const { data: posts } = await http.get<PaginatedResponse<Post>>(
    "/posts/admin",
    {
      params: Object.fromEntries(searchParams.entries())
    }
  );

  return { posts };
};

export default function Posts() {
  const navigate = useNavigate();
  const { posts } = useLoaderData<typeof clientLoader>();

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [searchParams, setSearchParams] = useSearchParams();

  const columns = [
    { key: "title", label: "Başlık" },
    { key: "category", label: "Kategori" },
    { key: "comments", label: "Yorum Sayısı" },
    { key: "reactions", label: "Reaksiyon Sayısı" },
    { key: "updatedAt", label: "Güncellenme Tarihi" }
  ];

  const rows = posts.items.map((item) => ({
    category: item.category?.title || "-",
    comments: item.comments?.length || 0,
    key: item.id,
    reactions: item.reactions?.length || 0,
    title: item.title,
    updatedAt: new Date(item.updatedAt).toLocaleString()
  }));

  console.log("posts", posts.meta);

  return (
    <div className='grid gap-3'>
      <div className='grid grid-cols-1 gap-3 md:grid-cols-2'>
        <div>
          <h2 className='text-xl font-bold'>Dergiler</h2>
          <small className='text-muted'>
            ({posts.items.length}/{posts.meta.total}) item bulundu.
          </small>
        </div>
        <div className='flex items-end justify-end gap-2'>
          <Link
            color='foreground'
            href='/dashboard/posts/create'
          >
            Dergi Ekle
          </Link>
          <FilterDrawer />
        </div>
      </div>
      <DataTable
        columns={columns}
        items={rows}
        onRowAction={(key) => navigate(`/dashboard/posts/${key}`)}
      />
      <Pagination
        className='mx-auto'
        onChange={(page) =>
          setSearchParams((prev) => {
            prev.set("page", String(page));
            return prev;
          })
        }
        page={posts.meta.page}
        total={posts.meta.pageCount}
      />
    </div>
  );
}
