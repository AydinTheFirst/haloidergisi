import type { Post } from "~/models/Post";
import type { PaginatedResponse } from "~/types";

import { Link, Pagination } from "@heroui/react";
import PostCard from "~/components/post-card";
import { http } from "~/lib/http";
import { useBookmarkStore } from "~/store/bookmark-store";
import { LucideChevronRight } from "lucide-react";
import { useLoaderData, useSearchParams } from "react-router";

import type { Route } from "./+types/page";

export const clientLoader = async ({ request }: Route.LoaderArgs) => {
  const bookmarks = useBookmarkStore.getState().bookmarks;

  const { searchParams } = new URL(request.url);

  const page = searchParams.get("page") || "1";
  const limit = searchParams.get("limit") || "10";
  searchParams.set("limit", limit);
  searchParams.set("offset", String((+page - 1) * +limit));

  const { data: posts } = await http.get<PaginatedResponse<Post>>("/posts", {
    params: {
      ids: bookmarks.join(","),
      include: "category,reactions,comments",
      ...Object.fromEntries(searchParams.entries())
    }
  });

  return { posts };
};

export default function Posts() {
  const { posts } = useLoaderData<typeof clientLoader>();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, setSearchParams] = useSearchParams();

  return (
    <div className='container py-20'>
      <div className='grid gap-5'>
        <div className='grid grid-cols-1 gap-3 md:grid-cols-2'>
          <div className='flex flex-col gap-1'>
            <h1 className='text-3xl font-bold'>Dergiler</h1>
            <p className='max-w-xl'>
              Dergiler, edebiyat dünyasındaki en önemli yayın organlarından
              biridir. Bu sayfada, dergilerle ilgili en son haberleri ve
              makaleleri bulabilirsiniz.
            </p>
            <p className='text-muted text-sm'>
              {posts.items.length} dergi bulundu.
            </p>
          </div>
          <div className='flex items-end justify-end'>
            <Link
              color='foreground'
              href='/posts'
            >
              Tüm Dergiler <LucideChevronRight size={20} />
            </Link>
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
