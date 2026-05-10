import { Icon } from "@iconify/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ColumnDef,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { useState } from "react";
import { toast } from "sonner";

import { DataGrid } from "@/components/data-grid";
import { Button } from "@/components/ui/button";
import apiClient from "@/lib/api-client";
import { SubmissionCall } from "@/types";

export const Route = createFileRoute("/dashboard/calls/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { data: calls } = useQuery({
    queryKey: ["submission-calls"],
    queryFn: async () => {
      const { data } = await apiClient.get<SubmissionCall[]>("/submission-calls");
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

  const [sorting, setSorting] = useState<SortingState>([]);

  const table = useReactTable({
    data: calls || [],
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
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
