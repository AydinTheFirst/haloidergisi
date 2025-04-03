import {
  getKeyValue,
  Input,
  Select,
  SelectItem,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow
} from "@heroui/react";
import { LucideSearch } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import useSWR from "swr";

import type { Squad } from "@/types";

const ViewSquads = () => {
  const navigate = useNavigate();

  const [filteredSquads, setFilteredSquads] = useState<Squad[]>([]);
  const { data: squads } = useSWR<Squad[]>("/squads");

  useEffect(() => {
    if (!squads) return;
    setFilteredSquads(squads);
  }, [squads]);

  const handleFilter = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase();
    if (!squads) return;

    const filtered = squads.filter((squad) =>
      squad.name.toLowerCase().includes(value)
    );

    setFilteredSquads(filtered);
  };

  const handleSort = (type: string) => {
    switch (type) {
      case "date:asc":
        setFilteredSquads(
          [...filteredSquads].sort(
            (a, b) =>
              new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          )
        );
        break;

      case "date:desc":
        setFilteredSquads(
          [...filteredSquads].sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          )
        );
        break;

      case "name:asc":
        setFilteredSquads(
          [...filteredSquads].sort((a, b) => a.name.localeCompare(b.name))
        );
        break;

      case "name:desc":
        setFilteredSquads(
          [...filteredSquads].sort((a, b) => b.name.localeCompare(a.name))
        );
        break;

      default:
        break;
    }
  };

  const handleRowAction = (key: React.Key) => {
    navigate(`/dashboard/squads/${key}`);
  };

  const columns = [
    {
      key: "name",
      label: "İsim"
    },
    {
      key: "order",
      label: "Sıra"
    },
    {
      key: "updatedAt",
      label: "Son Güncelleme"
    }
  ];

  const rows = filteredSquads.map((squad) => ({
    key: squad.id,
    name: squad.name,
    order: squad.order.toString(),
    updatedAt: new Date(squad.updatedAt).toLocaleDateString()
  }));

  return (
    <section className='grid gap-5'>
      <div className='grid grid-cols-1 gap-3 md:grid-cols-2'>
        <div className='flex items-end justify-start gap-3'>
          <h2 className='text-2xl font-bold'>Takımlar</h2>
          <span className='text-sm text-gray-500'>
            ({filteredSquads.length}/{squads?.length})
          </span>
        </div>
        <div className='flex flex-wrap items-center justify-end gap-3'>
          <Input
            className='max-w-xs'
            endContent={<LucideSearch />}
            label='Ara'
            onChange={handleFilter}
            placeholder='Kullanıcı ara...'
            variant='faded'
          />
          <Select
            className='max-w-xs'
            label='Sırala'
            onSelectionChange={(keys) =>
              handleSort(Array.from(keys)[0].toString())
            }
            placeholder='Sırala'
            variant='faded'
          >
            <SelectItem key='date:asc'>Tarihe Göre (Eskiden Yeniye)</SelectItem>
            <SelectItem key='date:desc'>
              Tarihe Göre (Yeniden Eskiye)
            </SelectItem>
            <SelectItem key='name:asc'>İsme Göre (A-Z)</SelectItem>
            <SelectItem key='name:desc'>İsme Göre (Z-A)</SelectItem>
            <SelectItem key='email:asc'>E-Postaya Göre (A-Z)</SelectItem>
            <SelectItem key='email:desc'>E-Postaya Göre (Z-A)</SelectItem>
          </Select>
        </div>
      </div>

      <Table
        aria-label='Example table with dynamic content'
        isStriped
        onRowAction={handleRowAction}
        selectionMode='single'
      >
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn key={column.key}>{column.label}</TableColumn>
          )}
        </TableHeader>
        <TableBody items={rows}>
          {(item) => (
            <TableRow key={item.key}>
              {(columnKey) => (
                <TableCell>{getKeyValue(item, columnKey)}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </section>
  );
};

export default ViewSquads;
