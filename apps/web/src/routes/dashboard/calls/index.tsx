import { Icon } from "@iconify/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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
import { toast } from "sonner";
import { z } from "zod";

import { DataGrid } from "@/components/data-grid";
import { Button } from "@/components/ui/button";
import apiClient from "@/lib/api-client";
import { QueryRes, SubmissionCall } from "@/types";

const searchSchema = z.object({
  page: z.coerce.number().min(1).optional().default(1),
  limit: z.coerce.number().min(1).optional().default(10),
  sort: z.string().optional(),
});

export const Route = createFileRoute("/dashboard/calls/")({
  component: RouteComponent,
  validateSearch: (search) => searchSchema.parse(search),
});

function RouteComponent() {
  const { page, limit, sort } = Route.useSearch();
  const navigate = Route.useNavigate();

  const { data: calls } = useQuery({
    queryKey: ["submission-calls", { page, limit, sort }],
    queryFn: async () => {
      const { data } = await apiClient.get<QueryRes<SubmissionCall>>("/submission-calls", {
        params: { page, limit, sort },
      });
      return data;
    },
  });

  const queryClient = useQueryClient();
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/submission-calls/${id}`);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["submission-calls"] });
      toast.success("İlan başarıyla silindi.");
    },
    onError: (error) => {
      const resolved = apiClient.resolveApiError(error);
      toast.error(resolved.message);
    },
  });

  const toggleMutation = useMutation({
    mutationFn: async (call: SubmissionCall) => {
      await apiClient.patch(`/submission-calls/${call.id}`, {
        isActive: !call.isActive,
      });
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["submission-calls"] });
      toast.success("İlan durumu güncellendi.");
    },
  });

  const columns: ColumnDef<SubmissionCall>[] = [
    {
      accessorKey: "title",
      header: "İlan Adı",
    },
    {
      accessorKey: "startDate",
      header: "Başlangıç",
      cell: ({ getValue }) => new Date(getValue<string>()).toLocaleDateString(),
    },
    {
      accessorKey: "endDate",
      header: "Bitiş",
      cell: ({ getValue }) => new Date(getValue<string>()).toLocaleDateString(),
    },
    {
      accessorKey: "isActive",
      header: "Durum",
      cell: ({ row }) => (
        <span className={row.original.isActive ? "font-bold text-green-600" : "text-red-600"}>
          {row.original.isActive ? "Aktif" : "Pasif"}
        </span>
      ),
    },
    {
      id: "actions",
      header: "İşlemler",
      cell: ({ row }) => {
        const item = row.original;
        return (
          <div className='flex items-center space-x-3'>
            <button
              onClick={() => toggleMutation.mutate(item)}
              title={item.isActive ? "Pasif Yap" : "Aktif Yap"}
            >
              <Icon
                icon={item.isActive ? "mdi:eye-off" : "mdi:eye"}
                className='size-5'
              />
            </button>
            <button
              className='text-danger'
              onClick={() => {
                if (confirm("Silmek istediğinize emin misiniz?")) {
                  deleteMutation.mutate(item.id);
                }
              }}
            >
              <Icon
                icon='mdi:delete-outline'
                className='size-5'
              />
            </button>
            <Link
              to='/dashboard/calls/$callId'
              params={{ callId: item.id }}
              className='text-blue-600'
            >
              <Icon
                icon='mdi:pencil-outline'
                className='size-5'
              />
            </Link>
          </div>
        );
      },
    },
  ];

  const [sorting, setSorting] = useState<SortingState>(() =>
    sort ? [{ id: sort.split(":")[0], desc: sort.split(":")[1] === "desc" }] : [],
  );

  const table = useReactTable({
    data: calls?.items || [],
    columns,
    state: {
      sorting,
      pagination: { pageIndex: page - 1, pageSize: limit },
    },
    manualPagination: true,
    manualSorting: true,
    pageCount: calls ? Math.ceil(calls.meta.total / limit) : 0,
    onSortingChange: (updater) => {
      const next = typeof updater === "function" ? updater(sorting) : updater;
      setSorting(next);
      const nextSort = next[0] ? `${next[0].id}:${next[0].desc ? "desc" : "asc"}` : undefined;
      void navigate({ search: (old) => ({ ...old, sort: nextSort, page: 1 }) });
    },
    onPaginationChange: (updater) => {
      const current = { pageIndex: page - 1, pageSize: limit };
      const next = typeof updater === "function" ? updater(current) : updater;
      void navigate({
        search: (old) => ({ ...old, page: next.pageIndex + 1, limit: next.pageSize }),
      });
    },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <section className='space-y-4'>
      <div className='flex items-center justify-between'>
        <h2 className='text-2xl font-bold'>Yazı Kabul İlanları</h2>
        <Button asChild>
          <Link to='/dashboard/calls/new'>Yeni İlan Oluştur</Link>
        </Button>
      </div>
      <DataGrid table={table} />
    </section>
  );
}
