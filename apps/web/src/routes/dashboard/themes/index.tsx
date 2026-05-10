import { Icon } from "@iconify/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Check, ChevronsUpDown } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import apiClient from "@/lib/api-client";
import { cn } from "@/lib/utils";
import { List, Post } from "@/types";

export const Route = createFileRoute("/dashboard/themes/")({
  component: ThemesDashboard,
});

type Theme = {
  id: string;
  work: string;
  category: string;
  postId: string;
  post?: Post;
};

function ThemesDashboard() {
  const queryClient = useQueryClient();
  const [newThemes, setNewThemes] = useState([{ work: "", category: "", postId: "" }]);

  const { data: themes, isLoading: isThemesLoading } = useQuery({
    queryKey: ["dashboard", "themes"],
    queryFn: async () => {
      const { data } = await apiClient.get<Theme[]>("/themes");
      return data;
    },
  });

  const { data: posts, isLoading: isPostsLoading } = useQuery({
    queryKey: ["dashboard", "posts", "list"],
    queryFn: async () => {
      const { data } = await apiClient.get<List<Post>>("/posts", {
        params: { limit: 100 },
      });
      return data;
    },
  });

  const bulkCreateMutation = useMutation({
    mutationFn: async (data: { themes: Omit<Theme, "id">[] }) => {
      return apiClient.post("/themes", data.themes);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dashboard", "themes"] });
      setNewThemes([{ work: "", category: "", postId: "" }]);
      toast.success("Eserler başarıyla eklendi.");
    },
    onError: (error) => {
      const resolved = apiClient.resolveApiError(error);
      toast.error(resolved.message);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return apiClient.delete(`/themes/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dashboard", "themes"] });
      toast.success("Eser silindi.");
    },
  });

  const handleAddRow = () => {
    setNewThemes([...newThemes, { work: "", category: "", postId: "" }]);
  };

  const handleRemoveRow = (index: number) => {
    setNewThemes(newThemes.filter((_, i) => i !== index));
  };

  const handleInputChange = (index: number, field: keyof Omit<Theme, "id">, value: string) => {
    const updated = [...newThemes];
    if (field in updated[index]) {
      (updated[index] as any)[field] = value;
    }
    setNewThemes(updated);
  };

  const handleBulkSubmit = () => {
    const validThemes = newThemes.filter((t) => t.work && t.category && t.postId);
    if (validThemes.length === 0) {
      toast.error("Lütfen tüm alanları doldurun.");
      return;
    }
    bulkCreateMutation.mutate({ themes: validThemes });
  };

  return (
    <div className='space-y-8'>
      <Card>
        <CardHeader>
          <CardTitle>Toplu Eser Ekle</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='space-y-4'>
            {newThemes.map((theme, index) => (
              <div
                key={index}
                className='flex items-end gap-4'
              >
                <div className='flex-1 space-y-2'>
                  <label className='text-sm font-medium'>Başlık (Eser)</label>
                  <Input
                    value={theme.work}
                    onChange={(e) => handleInputChange(index, "work", e.target.value)}
                    placeholder='Örn: Sefiller'
                  />
                </div>
                <div className='flex-1 space-y-2'>
                  <label className='text-sm font-medium'>Konu (Tür)</label>
                  <Input
                    value={theme.category}
                    onChange={(e) => handleInputChange(index, "category", e.target.value)}
                    placeholder='Örn: Kitap'
                  />
                </div>
                <div className='flex-1 space-y-2'>
                  <label className='text-sm font-medium'>İlgili Dergi Sayısı</label>
                  <PostCombobox
                    posts={posts?.items || []}
                    value={theme.postId}
                    onChange={(val) => handleInputChange(index, "postId", val)}
                    isLoading={isPostsLoading}
                  />
                </div>
                <Button
                  variant='ghost'
                  size='icon'
                  className='text-destructive'
                  onClick={() => handleRemoveRow(index)}
                  disabled={newThemes.length === 1}
                >
                  <Icon icon='mdi:trash-can-outline' />
                </Button>
              </div>
            ))}
            <div className='flex justify-between'>
              <Button
                variant='outline'
                onClick={handleAddRow}
              >
                <Icon
                  icon='mdi:plus'
                  className='mr-2'
                />
                Yeni Satır
              </Button>
              <Button
                onClick={handleBulkSubmit}
                disabled={bulkCreateMutation.isPending}
              >
                {bulkCreateMutation.isPending ? "Ekleniyor..." : "Tümünü Kaydet"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Mevcut Eserler</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Başlık (Eser)</TableHead>
                <TableHead>Konu (Tür)</TableHead>
                <TableHead>İlgili Dergi</TableHead>
                <TableHead className='w-[100px]'>İşlemler</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isThemesLoading && (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className='text-center'
                  >
                    Yükleniyor...
                  </TableCell>
                </TableRow>
              )}
              {themes?.map((theme) => (
                <TableRow key={theme.id}>
                  <TableCell>{theme.work}</TableCell>
                  <TableCell>{theme.category}</TableCell>
                  <TableCell>{theme.post?.title || "Bulunamadı"}</TableCell>
                  <TableCell>
                    <Button
                      variant='ghost'
                      size='icon'
                      className='text-destructive'
                      onClick={() => deleteMutation.mutate(theme.id)}
                      disabled={deleteMutation.isPending}
                    >
                      <Icon icon='mdi:trash-can-outline' />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {!isThemesLoading && themes?.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className='text-center'
                  >
                    Henüz eser eklenmemiş.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

function PostCombobox({
  posts,
  value,
  onChange,
  isLoading,
}: {
  posts: Post[];
  value: string;
  onChange: (value: string) => void;
  isLoading: boolean;
}) {
  const [open, setOpen] = useState(false);

  return (
    <Popover
      open={open}
      onOpenChange={setOpen}
    >
      <PopoverTrigger asChild>
        <Button
          variant='outline'
          role='combobox'
          aria-expanded={open}
          className='w-full justify-between'
          disabled={isLoading}
        >
          <span className='truncate text-left'>
            {isLoading
              ? "Yükleniyor..."
              : value
                ? (posts.find((post) => post.id === value)?.title ?? "Post bulunamadı")
                : "Post seçiniz..."}
          </span>
          <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
        </Button>
      </PopoverTrigger>
      <PopoverContent className='z-[1000] w-[400px] p-0'>
        <Command>
          <CommandInput placeholder='Post ara...' />
          <CommandList>
            <CommandEmpty>Post bulunamadı.</CommandEmpty>
            <CommandGroup>
              {posts.map((post) => (
                <CommandItem
                  key={post.id}
                  value={post.title}
                  onSelect={() => {
                    onChange(post.id);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn("mr-2 h-4 w-4", value === post.id ? "opacity-100" : "opacity-0")}
                  />
                  {post.title}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
