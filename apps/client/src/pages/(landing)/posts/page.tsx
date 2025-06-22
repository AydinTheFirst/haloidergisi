import type { Category } from "~/models/Category";
import type { Post } from "~/models/Post";
import type { PaginatedResponse } from "~/types";

import {
  Button,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  Input,
  Link,
  Pagination,
  Select,
  SelectItem,
  useDisclosure
} from "@heroui/react";
import PostCard from "~/components/post-card";
import { http } from "~/lib/http";
import { LucideBookmark, LucideFilter } from "lucide-react";
import { useLoaderData, useSearchParams } from "react-router";
import useSWR from "swr";

import type { Route } from "./+types/page";

export const loader = async ({ request }: Route.LoaderArgs) => {
  const { searchParams } = new URL(request.url);

  const page = searchParams.get("page") || "1";
  const limit = searchParams.get("limit") || "10";
  searchParams.set("limit", limit);
  searchParams.set("offset", String((+page - 1) * +limit));

  const { data: posts } = await http.get<PaginatedResponse<Post>>("/posts", {
    params: {
      include: "category,reactions,comments",
      ...Object.fromEntries(searchParams.entries())
    }
  });

  return { posts };
};

export default function Posts() {
  const { posts } = useLoaderData<typeof loader>();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, setSearchParams] = useSearchParams();

  return (
    <div className='container py-20'>
      <div className='grid gap-5'>
        <div className='grid grid-cols-1 gap-3 md:grid-cols-2'>
          <div className='flex flex-col gap-2'>
            <h1 className='text-3xl font-bold'>Dergiler</h1>
            <p className='max-w-xl'>
              Dergiler, edebiyat dünyasındaki en önemli yayın organlarından
              biridir. Bu sayfada, dergilerle ilgili en son haberleri ve
              makaleleri bulabilirsiniz.
            </p>
            <p className='text-muted text-sm'>
              {posts.items.length} dergi bulundu.
            </p>
            <Link
              color='foreground'
              href='/posts/bookmarks'
            >
              <LucideBookmark size={20} />
              <span>Kaydedilen Dergiler</span>
            </Link>
          </div>
          <div className='flex items-end justify-end gap-2'>
            <PostsFilter />
          </div>
        </div>
        <div className='grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3'>
          {posts.items.map((post) => (
            <PostCard
              key={post.id}
              post={post}
            />
          ))}
        </div>
        {posts.items.length === 0 && (
          <div className='flex flex-col items-center justify-center gap-3'>
            <p className='text-muted'>Hiç dergi bulunamadı.</p>
            <Button
              color='primary'
              onPress={() => setSearchParams({})}
              variant='light'
            >
              Filtreleri Temizle
            </Button>
          </div>
        )}
        <div
          className='flex items-center justify-center'
          hidden={posts.items.length === 0}
        >
          <Pagination
            onChange={(page) =>
              setSearchParams((prev) => {
                prev.set("page", String(page));
                return prev;
              })
            }
            page={posts.meta.page}
            total={posts.meta.pageCount}
          />
        </div>
      </div>
    </div>
  );
}

function PostsFilter() {
  const { data: categories } = useSWR<Category[]>("/categories");

  const { isOpen, onClose, onOpen, onOpenChange } = useDisclosure();
  const [searchParams, setSearchParams] = useSearchParams();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const params = Object.fromEntries(formData.entries());
    searchParams.forEach((_, key) => searchParams.delete(key));

    Object.entries(params).forEach(([key, value]) => {
      if (value) {
        searchParams.set(key, String(value));
      }
    });

    searchParams.set("page", "1");

    setSearchParams(searchParams);
    onClose();
  };

  return (
    <>
      <Button
        isIconOnly
        onPress={onOpen}
        variant='light'
      >
        <LucideFilter />
      </Button>
      <Drawer
        isOpen={isOpen}
        onOpenChange={onOpenChange}
      >
        <DrawerContent>
          <DrawerHeader className='flex flex-col gap-1'>
            <h2 className='font-semibold'>Dergi Filtreleri</h2>
            <p className='text-muted text-sm'>
              Dergileri filtrelemek için aşağıdaki seçenekleri
              kullanabilirsiniz.
            </p>
          </DrawerHeader>
          <DrawerBody>
            <form
              className='grid gap-3'
              onSubmit={handleSubmit}
            >
              <Input
                defaultValue={searchParams.get("search") || ""}
                description='Dergi başlığı veya içeriği girin...'
                isClearable
                label='Dergi Arama'
                name='search'
              />

              <Select
                defaultSelectedKeys={[searchParams.get("categoryId") || ""]}
                description='Kategori seçin...'
                items={categories || []}
                label='Kategori Seç'
                name='categoryId'
              >
                {(item) => <SelectItem key={item.id}>{item.title}</SelectItem>}
              </Select>

              <Button
                color='primary'
                type='submit'
              >
                Filtrele
              </Button>
            </form>
          </DrawerBody>
          <DrawerFooter>
            <Button
              color='danger'
              onPress={() => setSearchParams({})}
              variant='light'
            >
              Filtreleri Temizle
            </Button>
            <Button
              color='danger'
              onPress={onClose}
              variant='light'
            >
              Kapat
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
}
