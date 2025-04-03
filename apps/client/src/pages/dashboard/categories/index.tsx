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
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import useSWR from "swr";

import type { Category } from "@/types";

const ViewCategories = () => {
  const navigate = useNavigate();

  const [filteredCategories, setFilteredCategories] = useState<Category[]>([]);
  const { data: categories } = useSWR<Category[]>("/categories");

  useEffect(() => {
    if (!categories) return;
    setFilteredCategories(categories);
  }, [categories]);

  const handleFilter = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase();
    if (!categories) return;

    const filtered = categories.filter((category) =>
      category.title.toLowerCase().includes(value)
    );

    setFilteredCategories(filtered);
  };

  const handleSort = (type: string) => {
    switch (type) {
      case "date:asc":
        setFilteredCategories(
          [...filteredCategories].sort(
            (a, b) =>
              new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          )
        );
        break;

      case "date:desc":
        setFilteredCategories(
          [...filteredCategories].sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          )
        );
        break;

      case "title:asc":
        setFilteredCategories(
          [...filteredCategories].sort((a, b) => a.title.localeCompare(b.title))
        );
        break;

      case "title:desc":
        setFilteredCategories(
          [...filteredCategories].sort((a, b) => b.title.localeCompare(a.title))
        );
        break;

      default:
        break;
    }
  };

  const handleRowAction = (key: React.Key) => {
    navigate(`/dashboard/categories/${key.toString()}`);
  };

  const columns = [
    {
      key: "title",
      label: "Başlık"
    },
    {
      key: "description",
      label: "Açıklama"
    },
    {
      key: "createdAt",
      label: "Son Güncelleme"
    }
  ];

  const rows = filteredCategories.map((category) => ({
    createdAt: new Date(category.createdAt).toLocaleString(),
    description: category.description,
    key: category.id,
    title: category.title
  }));

  return (
    <section className='grid gap-5'>
      <div className='grid grid-cols-1 gap-3 md:grid-cols-2'>
        <div className='flex items-end justify-start gap-3'>
          <h2 className='text-2xl font-bold'>Kategoriler</h2>
          <span className='text-sm text-gray-500'>
            ({filteredCategories.length}/{categories?.length})
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

export default ViewCategories;
