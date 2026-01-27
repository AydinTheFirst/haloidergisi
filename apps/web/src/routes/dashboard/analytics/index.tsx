import { Input } from "@adn-ui/react";
import { Icon } from "@iconify/react";
import { PageVisit } from "@repo/db";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import {
  ColumnDef,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { useEffect, useState } from "react";
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

export const Route = createFileRoute("/dashboard/analytics/")({
  component: RouteComponent,
  validateSearch: (search): SearchSchema => searchSchema.parse(search),
});

function RouteComponent() {
  const { page = 1, limit = 50, q = "" } = Route.useSearch();

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

  const { data: users } = useQuery({
    queryKey: ["page-visits", { page, limit, q }],
    queryFn: async () => {
      const { data } = await apiClient.get<QueryRes<PageVisit>>("/analytics/page-visits", {
        params: {
          page,
          limit,
          search: q,
        },
      });
      return data;
    },
  });

  const columns: ColumnDef<PageVisit>[] = [
    {
      accessorKey: "id",
      header: "ID",
      cell: ({ getValue }) => <code>{getValue<string>().split("-")[0]}</code>,
    },
    {
      accessorKey: "url",
      header: "Page URL",
    },
    {
      accessorKey: "count",
      header: "Visit Count",
    },
    {
      accessorKey: "date",
      header: "Date",
      cell: ({ getValue }) => {
        const date = getValue<string>();
        return new Date(date).toLocaleDateString();
      },
    },
  ];

  const [sorting, setSorting] = useState<SortingState>([]);

  const table = useReactTable({
    data: users?.items || [],
    columns,
    state: {
      sorting,
      pagination: {
        pageIndex: (page || 1) - 1,
        pageSize: limit || 10,
      },
    },
    manualPagination: true,
    pageCount: users ? Math.ceil(users.meta.total / (limit || 10)) : 0,
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
            placeholder='Search'
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
