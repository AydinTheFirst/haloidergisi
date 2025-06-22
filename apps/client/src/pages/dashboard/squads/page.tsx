import type { Squad } from "~/models/Squad";

import { Link } from "@heroui/react";
import DataTable from "~/components/data-table";
import { http } from "~/lib/http";
import { useLoaderData, useNavigate } from "react-router";

export const clientLoader = async () => {
  const { data: squads } = await http.get<Squad[]>("/squads");

  return { squads };
};

export default function SquadsList() {
  const { squads } = useLoaderData<typeof clientLoader>();
  const navigate = useNavigate();

  const columns = [
    { key: "name", label: "Ekip Adı" },
    { key: "description", label: "Açıklama" },
    { key: "order", label: "Sıra" },
    { key: "userCount", label: "Kullanıcı Sayısı" },
    { key: "updatedAt", label: "Güncellenme Tarihi" }
  ];

  const rows = squads.map((squad) => ({
    description: squad.description,
    key: squad.id,
    name: squad.name,
    order: squad.order,
    updatedAt: new Date(squad.updatedAt).toLocaleString(),
    userCount: squad.users?.length || 0
  }));

  return (
    <div className='grid gap-3'>
      <div className='flex items-center justify-between'>
        <h2 className='text-xl font-bold'>Ekipler</h2>
        <div className='flex items-end gap-2'>
          <Link
            color='foreground'
            href='/dashboard/squads/create'
          >
            Ekip Ekle
          </Link>
        </div>
      </div>

      <DataTable
        columns={columns}
        items={rows}
        onRowAction={(key) => navigate(`/dashboard/squads/${key}`)}
      />
    </div>
  );
}
