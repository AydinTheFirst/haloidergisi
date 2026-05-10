import { Icon } from "@iconify/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ColumnDef, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { toast } from "sonner";

import { DataGrid } from "@/components/data-grid";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import apiClient from "@/lib/api-client";
import { News } from "@/types";

export const Route = createFileRoute("/dashboard/news/")({
  component: AdminNewsListPage,
});

function AdminNewsLanding() {
  const queryClient = useQueryClient();
  const { data: news } = useQuery({
    queryKey: ["admin-news"],
    queryFn: async () => {
      const { data } = await apiClient.get<News[]>("/news");
      return data;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/news/${id}`);
    },
    onSuccess: () => {
      toast.success("Haber silindi.");
      void queryClient.invalidateQueries({ queryKey: ["admin-news"] });
    },
  });

  const columns: ColumnDef<News>[] = [
    {
      accessorKey: "title",
      header: "Başlık",
      cell: ({ row }) => <div className='font-medium'>{row.original.title}</div>,
    },
    {
      accessorKey: "isPublished",
      header: "Durum",
      cell: ({ row }) => (
        <Badge variant={row.original.isPublished ? "default" : "outline"}>
          {row.original.isPublished ? "Yayında" : "Taslak"}
        </Badge>
      ),
    },
    {
      accessorKey: "publishedAt",
      header: "Yayın Tarihi",
      cell: ({ row }) => (
        <div className='text-muted-foreground text-xs'>
          {row.original.publishedAt ? new Date(row.original.publishedAt).toLocaleDateString() : "-"}
        </div>
      ),
    },
    {
      id: "actions",
      header: "İşlemler",
      cell: ({ row }) => (
        <div className='flex items-center gap-2'>
          <Button
            variant='outline'
            size='sm'
            asChild
          >
            <Link
              to='/dashboard/news/$newsId'
              params={{ newsId: row.original.id }}
            >
              Düzenle
            </Link>
          </Button>
          <Button
            variant='ghost'
            size='sm'
            className='text-destructive'
            onClick={() => {
              if (window.confirm("Bu haberi silmek istediğinize emin misiniz?")) {
                deleteMutation.mutate(row.original.id);
              }
            }}
          >
            Sil
          </Button>
        </div>
      ),
    },
  ];

  const table = useReactTable({
    data: news ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <div>
          <h2 className='text-2xl font-bold'>Haber Yönetimi</h2>
          <p className='text-muted-foreground text-sm'>Blog yazılarını ve duyuruları yönetin.</p>
        </div>
        <Button asChild>
          <Link to='/dashboard/news/new'>
            <Icon
              icon='mdi:plus'
              className='mr-2 h-4 w-4'
            />
            Yeni Haber Ekle
          </Link>
        </Button>
      </div>

      <div className='bg-card border-border rounded-lg border'>
        <DataGrid table={table} />
      </div>
    </div>
  );
}

function AdminNewsListPage() {
  return <AdminNewsLanding />;
}
