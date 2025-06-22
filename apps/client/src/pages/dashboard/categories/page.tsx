import type { Category } from "~/models/Category";
import type { PaginatedResponse } from "~/types";

import { Link, Pagination } from "@heroui/react";
import DataTable from "~/components/data-table";
import { http } from "~/lib/http";
import { useLoaderData, useNavigate, useSearchParams } from "react-router";

export const clientLoader = async ({ request }: { request: Request }) => {
  const { searchParams } = new URL(request.url);

  const page = searchParams.get("page") || "1";
  const limit = searchParams.get("limit") || "10";

  searchParams.set("limit", limit);
  searchParams.set("offset", String((+page - 1) * +limit));
  searchParams.set("include", "posts");

  const { data: categories } = await http.get<PaginatedResponse<Category>>(
    "/categories",
    {
      params: Object.fromEntries(searchParams.entries())
    }
  );

  return { categories };
};

export default function CategoriesList() {
  const { categories } = useLoaderData<typeof clientLoader>();
  const navigate = useNavigate();
  const [, setSearchParams] = useSearchParams();

  const columns = [
    { key: "title", label: "Kategori Adı" },
    { key: "description", label: "Açıklama" },
    { key: "postCount", label: "Gönderi Sayısı" },
    { key: "updatedAt", label: "Güncellenme Tarihi" }
  ];

  const rows = categories.items.map((item) => ({
    description: item.description || "-",
    key: item.id,
    postCount: item.posts?.length || 0,
    title: item.title,
    updatedAt: new Date(item.updatedAt).toLocaleString()
  }));

  return (
    <div className='grid gap-3'>
      <div className='flex items-center justify-between'>
        <h2 className='text-xl font-bold'>Kategoriler</h2>
        <Link
          color='foreground'
          href='/dashboard/categories/create'
        >
          Kategori Ekle
        </Link>
      </div>

      <DataTable
        columns={columns}
        items={rows}
        onRowAction={(key) => navigate(`/dashboard/categories/${key}`)}
      />

      <Pagination
        className='mx-auto'
        onChange={(page) => {
          setSearchParams((prev) => {
            prev.set("page", String(page));
            return prev;
          });
        }}
        page={categories.meta.page}
        total={categories.meta.pageCount}
      />
    </div>
  );
}
