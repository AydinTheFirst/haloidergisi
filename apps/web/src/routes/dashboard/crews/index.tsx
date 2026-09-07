import {
  closestCenter,
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Icon } from "@iconify/react";
import { Crew } from "@repo/db";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import useDebounce from "@/hooks/use-debounce";
import apiClient from "@/lib/api-client";
import { queryClient } from "@/lib/query-client";
import { QueryRes } from "@/types";

const searchSchema = z.object({
  q: z.string().optional(),
});

type SearchSchema = z.infer<typeof searchSchema>;

export const Route = createFileRoute("/dashboard/crews/")({
  component: RouteComponent,
  validateSearch: (search): SearchSchema => searchSchema.parse(search),
});

function RouteComponent() {
  const { q = "" } = Route.useSearch();
  const navigate = Route.useNavigate();

  const [searchTerm, setSearchTerm] = useState(q || "");
  const debouncedSearch = useDebounce(searchTerm, 500);

  useEffect(() => {
    void navigate({
      search: (old) => ({ ...old, q: debouncedSearch || undefined }),
      replace: true,
    });
  }, [debouncedSearch, navigate]);

  const isFiltered = Boolean(q);

  const { data: crews } = useQuery({
    queryKey: ["crews", "all", { q }],
    queryFn: async () => {
      const { data } = await apiClient.get<QueryRes<Crew>>("/crews", {
        params: { limit: -1, search: q, sort: "sort:asc" },
      });
      return data;
    },
  });

  const [items, setItems] = useState<Crew[]>([]);

  useEffect(() => {
    if (crews) setItems(crews.items);
  }, [crews]);

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

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const onDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = items.findIndex((item) => item.id === active.id);
    const newIndex = items.findIndex((item) => item.id === over.id);
    const reordered = arrayMove(items, oldIndex, newIndex);
    setItems(reordered);

    const changed = reordered
      .map((item, index) => ({ item, index }))
      .filter(({ item, index }) => item.sort !== index);

    try {
      await Promise.all(
        changed.map(({ item, index }) => apiClient.patch(`/crews/${item.id}`, { sort: index })),
      );
      await queryClient.invalidateQueries({ queryKey: ["crews"] });
    } catch (error) {
      const resolved = apiClient.resolveApiError(error);
      toast.error(resolved.message, {
        description: resolved.error,
      });
      setItems(items);
    }
  };

  return (
    <section className='space-y-4'>
      <div className='flex items-center justify-between'>
        <Button asChild>
          <Link to='/dashboard/crews/new'>Yeni</Link>
        </Button>
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

      {isFiltered && (
        <p className='text-muted-foreground text-sm'>
          Sıralamayı değiştirmek için aramayı temizleyin.
        </p>
      )}

      <div className='rounded-md border'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className='w-10' />
              <TableHead>Name</TableHead>
              <TableHead>Sort Order</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead className='w-24'>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={onDragEnd}
            >
              <SortableContext
                items={items.map((item) => item.id)}
                strategy={verticalListSortingStrategy}
              >
                {items.map((crew) => (
                  <SortableCrewRow
                    key={crew.id}
                    crew={crew}
                    disabled={isFiltered}
                    onDelete={onDelete}
                  />
                ))}
              </SortableContext>
            </DndContext>
            {items.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className='py-4 text-center'
                >
                  No data found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </section>
  );
}

function SortableCrewRow({
  crew,
  disabled,
  onDelete,
}: {
  crew: Crew;
  disabled: boolean;
  onDelete: (id: string) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: crew.id,
    disabled,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <TableRow
      ref={setNodeRef}
      style={style}
    >
      <TableCell>
        <button
          {...attributes}
          {...listeners}
          disabled={disabled}
          className='text-muted-foreground cursor-grab touch-none disabled:cursor-not-allowed disabled:opacity-30'
        >
          <Icon
            icon='mdi:drag-vertical'
            className='size-5'
          />
        </button>
      </TableCell>
      <TableCell>{crew.name}</TableCell>
      <TableCell>{crew.sort}</TableCell>
      <TableCell>{new Date(crew.createdAt).toLocaleDateString()}</TableCell>
      <TableCell>
        <div className='space-x-4'>
          <button
            className='link text-danger'
            onClick={() => onDelete(crew.id)}
          >
            <Icon icon='mdi:delete-outline' />
          </button>
          <Link
            to='/dashboard/crews/$crewId'
            params={{ crewId: String(crew.id) }}
            className='link text-blue-600'
          >
            <Icon icon='mdi:pencil-outline' />
          </Link>
        </div>
      </TableCell>
    </TableRow>
  );
}
