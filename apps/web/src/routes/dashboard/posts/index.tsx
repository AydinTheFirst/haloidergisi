import { Button, Input } from "@adn-ui/react";
import { Icon } from "@iconify/react";
import { Post, Category } from "@repo/db";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  ColumnDef,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { z } from "zod";

import { DataGrid } from "@/components/data-grid";
import useDebounce from "@/hooks/use-debounce";
import apiClient from "@/lib/api-client";
import { queryClient } from "@/lib/query-client";
import { QueryRes } from "@/types";

interface _Post extends Post {
  category?: Category;
}

const searchSchema = z.object({
  page: z.number().optional(),
  limit: z.number().optional(),
  q: z.string().optional(),
});

type SearchSchema = z.infer<typeof searchSchema>;

const StatusMap = {
  DRAFT: "Taslak",
  PUBLISHED: "Yayınlandı",
  ARCHIVED: "Arşivlendi",
};

export const Route = createFileRoute("/dashboard/posts/")({
  component: RouteComponent,
  validateSearch: (search): SearchSchema => searchSchema.parse(search),
});

function RouteComponent() {
  const { page = 1, limit = 10, q = "" } = Route.useSearch();

  const navigate = useNavigate({ from: Route.id });

  const [searchTerm, setSearchTerm] = useState(q || "");

  // 2. Senin hook'u kullan
  const debouncedSearch = useDebounce(searchTerm, 500);

  useEffect(() => {
    void navigate({
      search: (old) => ({
        ...old,
        q: debouncedSearch,
        page: 1,
      }),
      replace: true,
    });
  }, [debouncedSearch, navigate]);

  const { data: posts } = useQuery({
    queryKey: ["posts", { page, limit, q }],
    queryFn: async () => {
      const { data } = await apiClient.get<QueryRes<_Post>>("/posts", {
        params: { fields: JSON.stringify({ category: true }), page, limit, search: q },
      });
      return data;
    },
  });

  const onDelete = async (postId: string) => {
    if (!confirm("Bu postu silmek istediğinize emin misiniz?")) return;

    try {
      await apiClient.delete(`/posts/${postId}`);
      await queryClient.invalidateQueries({ queryKey: ["posts"] });
    } catch (error) {
      const resolved = apiClient.resolveApiError(error);
      toast.error(resolved.message, {
        description: resolved.error,
      });
    }
  };

  const columns: ColumnDef<_Post>[] = [
    {
      accessorKey: "id",
      header: "ID",
      cell: ({ getValue }) => <code>{getValue<string>().split("-")[0]}</code>,
    },
    {
      accessorKey: "status",
      header: "Durum",
      cell: ({ getValue }) => StatusMap[getValue<string>() as keyof typeof StatusMap] || "-",
    },
    {
      accessorKey: "title",
      header: "Başlık",
    },
    {
      accessorKey: "category.name",
      header: "Kategori",
      cell: ({ row }) => row.original.category?.name || "-",
    },
    {
      accessorKey: "createdAt",
      header: "Oluşturulma Tarihi",
      cell: ({ getValue }) => new Date(getValue<string>()).toLocaleDateString(),
    },
    {
      id: "actions",
      header: "İşlemler",
      cell: ({ row }) => {
        const item = row.original;
        return (
          <div className='space-x-4'>
            <button
              className='link text-danger'
              onClick={() => onDelete(item.id)}
            >
              <Icon icon='mdi:delete-outline' />
            </button>
            <Link
              to='/dashboard/posts/$postId'
              params={{ postId: String(item.id) }}
              className='link text-blue-600'
            >
              <Icon icon='mdi:pencil-outline' />
            </Link>
            <Link
              to='/posts/$postId'
              params={{ postId: String(item.slug) }}
              target='_blank'
              rel='noopener noreferrer'
              className='link'
            >
              <Icon icon='mdi:eye-outline' />
            </Link>
          </div>
        );
      },
    },
  ];

  const [sorting, setSorting] = useState<SortingState>([]);

  const table = useReactTable({
    data: posts?.items || [],
    columns,
    state: {
      sorting,
      pagination: {
        pageIndex: (page || 1) - 1,
        pageSize: limit || 10,
      },
    },
    manualPagination: true,
    pageCount: posts ? Math.ceil(posts.meta.total / (limit || 10)) : 0,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <section className='space-y-4'>
      <div className='flex items-center justify-between'>
        <Button render={<Link to='/dashboard/posts/new' />}>Yeni</Button>
        <div className='relative'>
          <Icon
            icon='mdi:magnify'
            className='text-muted-foreground absolute top-1/2 left-3 size-5 -translate-y-1/2'
          />
          <Input
            type='text'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder='Ara...'
            className='max-w-sm px-10'
          />
          <button
            className='absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer'
            onClick={() => setSearchTerm("")}
          >
            <Icon
              icon='mdi:close'
              className='size-5'
            />
          </button>
        </div>
      </div>
      <DataGrid table={table} />
    </section>
  );
}
