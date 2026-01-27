import { Button, Input } from "@adn-ui/react";
import { Icon } from "@iconify/react";
import { Crew } from "@repo/db";
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

const searchSchema = z.object({
  page: z.number().optional(),
  limit: z.number().optional(),
  q: z.string().optional(),
});

type SearchSchema = z.infer<typeof searchSchema>;

export const Route = createFileRoute("/dashboard/crews/")({
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

  const { data: crews } = useQuery({
    queryKey: ["crews", { page, limit, q }],
    queryFn: async () => {
      const { data } = await apiClient.get<QueryRes<Crew>>("/crews", {
        params: {
          page,
          limit,
          search: q,
        },
      });
      return data;
    },
  });

  const onDelete = async (id: string) => {
    try {
      await apiClient.delete(`/crews/${id}`);
      await queryClient.invalidateQueries({ queryKey: ["crews"] });
    } catch (error) {
      const resolved = apiClient.resolveApiError(error);
      toast.error(resolved.message, {
        description: resolved.error,
      });
    }
  };

  const columns: ColumnDef<Crew>[] = [
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
      accessorKey: "sort",
      header: "Sort Order",
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
              onClick={() => onDelete(item.id)}
            >
              <Icon icon='mdi:delete-outline' />
            </button>
            <Link
              to='/dashboard/crews/$crewId'
              params={{ crewId: String(item.id) }}
              className='link text-blue-600'
            >
              <Icon icon='mdi:pencil-outline' />
            </Link>
          </div>
        );
      },
    },
  ];

  const [sorting, setSorting] = useState<SortingState>([
    {
      id: "sort",
      desc: false,
    },
  ]);

  const table = useReactTable({
    data: crews?.items || [],
    columns,
    state: {
      sorting,
      pagination: {
        pageIndex: (page || 1) - 1,
        pageSize: limit || 10,
      },
    },
    manualPagination: true,
    pageCount: crews ? Math.ceil(crews.meta.total / (limit || 10)) : 0,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <section className='space-y-4'>
      <div className='flex items-center justify-between'>
        <Button render={<Link to='/dashboard/crews/new' />}>Yeni</Button>
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
