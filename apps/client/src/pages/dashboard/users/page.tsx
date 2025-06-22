import type { ClientUser } from "~/models/ClientUser";
import type { PaginatedResponse } from "~/types";

import { Link, Pagination } from "@heroui/react";
import DataTable from "~/components/data-table";
import FilterDrawer from "~/components/filter-drawer";
import { http } from "~/lib/http";
import { useLoaderData, useNavigate, useSearchParams } from "react-router";

export const clientLoader = async ({ request }: { request: Request }) => {
  const { searchParams } = new URL(request.url);

  const page = searchParams.get("page") || "1";
  const limit = searchParams.get("limit") || "10";

  searchParams.set("limit", limit);
  searchParams.set("offset", String((+page - 1) * +limit));
  searchParams.set("include", "profile,squad");

  const { data: users } = await http.get<PaginatedResponse<ClientUser>>(
    "/users",
    {
      params: Object.fromEntries(searchParams.entries())
    }
  );

  return { users };
};

export default function UsersList() {
  const { users } = useLoaderData<typeof clientLoader>();
  const navigate = useNavigate();
  const [, setSearchParams] = useSearchParams();

  const columns = [
    { key: "displayName", label: "Ad Soyad" },
    { key: "email", label: "Email" },
    { key: "squad", label: "Takım" },
    { key: "updatedAt", label: "Güncellenme Tarihi" }
  ];

  const rows = users.items.map((user) => ({
    displayName: user.profile?.displayName || "-",
    email: user.email,
    key: user.id,
    squad: user.squad ? user.squad.name : "-",
    updatedAt: new Date(user.updatedAt).toLocaleString()
  }));

  return (
    <div className='grid gap-3'>
      <div className='flex items-center justify-between'>
        <h2 className='text-xl font-bold'>Kullanıcılar</h2>
        <div className='flex items-end gap-2'>
          <Link
            color='foreground'
            href='/dashboard/users/create'
          >
            Kullanıcı Ekle
          </Link>
          <FilterDrawer />
        </div>
      </div>

      <DataTable
        columns={columns}
        items={rows}
        onRowAction={(key) => navigate(`/dashboard/users/${key}`)}
      />

      <Pagination
        className='mx-auto'
        onChange={(page) => {
          setSearchParams((prev) => {
            prev.set("page", String(page));
            return prev;
          });
        }}
        page={users.meta.page}
        total={users.meta.pageCount}
      />
    </div>
  );
}
