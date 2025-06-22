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

  const { data: news } = await http.get<PaginatedResponse<Post>>("/news", {
    params: Object.fromEntries(searchParams.entries())
  });

  return { news };
};

export default function News() {
  const navigate = useNavigate();
  const { news } = useLoaderData<typeof clientLoader>();

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [searchParams, setSearchParams] = useSearchParams();

  const columns = [
    { key: "title", label: "Başlık" },
    { key: "updatedAt", label: "Güncellenme Tarihi" }
  ];

  const rows = news.items.map((item) => ({
    key: item.id,
    title: item.title,
    updatedAt: new Date(item.updatedAt).toLocaleString()
  }));

  return (
    <div className='grid gap-3'>
      <div className='grid grid-cols-1 gap-3 md:grid-cols-2'>
        <div>
          <h2 className='text-xl font-bold'>Haberler</h2>
          <small className='text-muted'>
            ({news.items.length}/{news.meta.total}) item bulundu.
          </small>
        </div>
        <div className='flex items-end justify-end gap-2'>
          <Link
            color='foreground'
            href='/dashboard/news/create'
          >
            Haber Ekle
          </Link>

          <FilterDrawer />
        </div>
      </div>
      <DataTable
        columns={columns}
        items={rows}
        onRowAction={(key) => navigate(`/dashboard/news/${key}`)}
      />
      <Pagination
        className='mx-auto'
        onChange={(page) =>
          setSearchParams((prev) => {
            prev.set("page", String(page));
            return prev;
          })
        }
        page={news.meta.page}
        total={news.meta.pageCount}
      />
    </div>
  );
}
