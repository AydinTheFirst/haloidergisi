import { Icon } from "@iconify/react";
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
import { useMemo } from "react";
import { z } from "zod";

import { DataGrid } from "@/components/data-grid";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import apiClient from "@/lib/api-client";
import { Article, ArticleStatus, SubmissionCall } from "@/types";

const searchSchema = z.object({
  status: z.string().optional(),
  callId: z.string().optional(),
  page: z.coerce.number().min(1).optional().default(1),
  limit: z.coerce.number().min(1).optional().default(10),
});

export const Route = createFileRoute("/dashboard/submissions/")({
  component: RouteComponent,
  validateSearch: (search) => searchSchema.parse(search),
});

function RouteComponent() {
  const { status, callId, page, limit } = Route.useSearch();
  const navigate = useNavigate();
  const sorting = useMemo<SortingState>(() => [], []);

  const pagination = useMemo(() => ({ pageIndex: page - 1, pageSize: limit }), [page, limit]);

  const { data: calls } = useQuery({
    queryKey: ["submission-calls"],
    queryFn: async () => {
      const { data } = await apiClient.get<SubmissionCall[]>("/submission-calls");
      return data;
    },
  });

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
    state: { sorting, pagination },
    onSortingChange: () => {},
    onPaginationChange: (updater) => {
      const next = typeof updater === "function" ? updater(pagination) : updater;
      // @ts-ignore
      navigate({ search: (old) => ({ ...old, page: next.pageIndex + 1, limit: next.pageSize }) });
    },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <section className='space-y-4'>
      <div className='flex items-center justify-between'>
        <h2 className='text-2xl font-bold'>Gelen Yazılar</h2>
      </div>

      <div className='flex items-center gap-3'>
        <div className='flex flex-col gap-1'>
          <span className='text-muted-foreground text-xs font-medium'>İlana Göre Filtrele</span>
          <Select
            value={callId ?? "all"}
            onValueChange={(value) =>
              navigate({
                // @ts-expect-error -- TanStack Router strict search typing
                search: (old) => ({
                  ...old,
                  callId: value === "all" ? undefined : value,
                  page: 1,
                }),
              })
            }
          >
            <SelectTrigger className='w-64'>
              <SelectValue placeholder='Tüm İlanlar' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='all'>Tüm İlanlar</SelectItem>
              {calls?.map((call) => (
                <SelectItem
                  key={call.id}
                  value={call.id}
                >
                  {call.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {callId && (
          <Button
            variant='ghost'
            size='sm'
            className='mt-5'
            onClick={() =>
              // @ts-ignore
              navigate({ search: (old) => ({ ...old, callId: undefined, page: 1 }) })
            }
          >
            <Icon
              icon='mdi:close-circle-outline'
              className='mr-1 size-4'
            />
            Filtreyi Temizle
          </Button>
        )}
      </div>

      <DataGrid table={table} />
    </section>
  );
}
