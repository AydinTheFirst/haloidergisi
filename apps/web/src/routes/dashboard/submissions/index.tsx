import { Icon } from "@iconify/react";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ColumnDef,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { useState } from "react";
import { z } from "zod";

import { DataGrid } from "@/components/data-grid";
import apiClient from "@/lib/api-client";
import { Article, ArticleStatus } from "@/types";

const searchSchema = z.object({
  status: z.string().optional(),
  callId: z.string().optional(),
});

export const Route = createFileRoute("/dashboard/submissions/")({
  component: RouteComponent,
  validateSearch: (search) => searchSchema.parse(search),
});

function RouteComponent() {
  const { status, callId } = Route.useSearch();
  const [sorting, setSorting] = useState<SortingState>([]);

  const { data: submissions } = useQuery({
    queryKey: ["submissions", { status, callId }],
    queryFn: async () => {
      const { data } = await apiClient.get<Article[]>("/articles", {
        params: { status, callId },
      });
      return data;
    },
  });

  const columns: ColumnDef<Article>[] = [
    {
      accessorKey: "title",
      header: "Yazı Başlığı",
      cell: ({ row }) => (
        <Link
          to='/dashboard/submissions/$articleId'
          params={{ articleId: row.original.id }}
          className='font-medium hover:underline'
        >
          {row.original.title}
        </Link>
      ),
    },
    {
      id: "author",
      header: "Yazar",
      cell: ({ row }) => row.original.author?.profile?.name || row.original.author?.email,
    },
    {
      id: "call",
      header: "İlan",
      cell: ({ row }) => row.original.call?.title,
    },
    {
      accessorKey: "status",
      header: "Durum",
      cell: ({ getValue }) => {
        const val = getValue<ArticleStatus>();
        const colors: Record<ArticleStatus, string> = {
          PENDING: "bg-yellow-100 text-yellow-800",
          REVIEWING: "bg-blue-100 text-blue-800",
          APPROVED: "bg-green-100 text-green-800",
          REJECTED: "bg-red-100 text-red-800",
          REVISION_REQ: "bg-purple-100 text-purple-800",
        };
        return (
          <span className={`rounded-full px-2 py-1 text-xs font-semibold ${colors[val]}`}>
            {val}
          </span>
        );
      },
    },
    {
      accessorKey: "createdAt",
      header: "Gönderim Tarihi",
      cell: ({ getValue }) => new Date(getValue<string>()).toLocaleDateString(),
    },
    {
      id: "actions",
      header: "İşlemler",
      cell: ({ row }) => (
        <Link
          to='/dashboard/submissions/$articleId'
          params={{ articleId: row.original.id }}
          className='text-blue-600'
        >
          <Icon
            icon='mdi:eye-outline'
            className='size-5'
          />
        </Link>
      ),
    },
  ];

  const table = useReactTable({
    data: submissions || [],
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <section className='space-y-4'>
      <div className='flex items-center justify-between'>
        <h2 className='text-2xl font-bold'>Gelen Yazılar</h2>
      </div>

      <div className='mb-4 flex space-x-4'>{/* Filtreleme alanları buraya eklenebilir */}</div>

      <DataGrid table={table} />
    </section>
  );
}
