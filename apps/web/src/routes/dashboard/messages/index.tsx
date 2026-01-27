import { Input } from "@adn-ui/react";
import { Icon } from "@iconify/react";
import { Message } from "@repo/db";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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
import { QueryRes } from "@/types";

const searchSchema = z.object({
  page: z.number().optional(),
  limit: z.number().optional(),
  q: z.string().optional(),
});

type SearchSchema = z.infer<typeof searchSchema>;

export const Route = createFileRoute("/dashboard/messages/")({
  component: RouteComponent,
  validateSearch: (search): SearchSchema => searchSchema.parse(search),
});

function RouteComponent() {
  const { page = 1, limit = 10, q = "" } = Route.useSearch();
  const navigate = useNavigate({ from: Route.id });

  const [searchTerm, setSearchTerm] = useState(q || "");
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

  const { data: messages } = useQuery({
    queryKey: ["messages", { page, limit, q }],
    queryFn: async () => {
      const { data } = await apiClient.get<QueryRes<Message>>("/messages", {
        params: {
          page,
          limit,
          search: q,
        },
      });
      return data;
    },
  });

  const queryClient = useQueryClient();
  const deleteMutation = useMutation({
    mutationFn: async (messageId: string) => {
      await apiClient.delete(`/messages/${messageId}`);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["messages"] });
      toast.success("Mesaj başarıyla silindi.");
    },
    onError: (error) => {
      const resolved = apiClient.resolveApiError(error);
      toast.error(resolved.message);
    },
  });

  const columns: ColumnDef<Message>[] = [
    {
      accessorKey: "id",
      header: "ID",
      cell: ({ getValue }) => <code>{getValue<string>().split("-")[0]}</code>,
    },
    {
      accessorKey: "name",
      header: "Name",
    },
    {
      accessorKey: "email",
      header: "Email",
    },
    {
      accessorKey: "subject",
      header: "Subject",
    },
    {
      accessorKey: "createdAt",
      header: "Created At",
      cell: ({ getValue }) => new Date(getValue<string>()).toLocaleDateString(),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const item = row.original;
        return (
          <div className='space-x-4'>
            <button
              className='link text-danger'
              onClick={() => deleteMutation.mutate(item.id)}
            >
              {deleteMutation.isPending && deleteMutation.variables === item.id ? (
                <Icon
                  icon='mdi:loading'
                  className='animate-spin'
                />
              ) : (
                <Icon icon='mdi:delete-outline' />
              )}
            </button>
            <Link
              to='/dashboard/messages/$messageId'
              params={{ messageId: String(item.id) }}
              className='link text-blue-600'
            >
              <Icon icon='mdi:pencil-outline' />
            </Link>
          </div>
        );
      },
    },
  ];

  const [sorting, setSorting] = useState<SortingState>([]);

  const table = useReactTable({
    data: messages?.items || [],
    columns,
    state: {
      sorting,
      pagination: {
        pageIndex: (page || 1) - 1,
        pageSize: limit || 10,
      },
    },
    manualPagination: true,
    pageCount: messages ? Math.ceil(messages.meta.total / (limit || 10)) : 0,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <section className='space-y-4'>
      <div className='flex items-center justify-end'>
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
