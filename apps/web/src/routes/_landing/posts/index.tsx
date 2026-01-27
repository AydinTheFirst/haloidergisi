import { Button } from "@adn-ui/react";
import { Icon } from "@iconify/react";
import { Post } from "@repo/db";
import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

import Pagination from "@/components/pagination";
import { PostCard } from "@/components/post-card";
import apiClient from "@/lib/api-client";
import { QueryRes } from "@/types";

const searchSchema = z.object({
  page: z.number().optional(),
  limit: z.number().optional(),
});

type Search = z.infer<typeof searchSchema>;

export const Route = createFileRoute("/_landing/posts/")({
  component: RouteComponent,
  validateSearch: (search): Search => searchSchema.parse(search),
  loaderDeps: ({ search: { page, limit } }: { search: Search }) => ({ page, limit }),
  loader: async ({ deps }) => {
    const { data: posts } = await apiClient.get<QueryRes<Post>>("/posts", {
      params: {
        status: "PUBLISHED",
        ...deps,
      },
    });

    return { posts };
  },
});

function RouteComponent() {
  const { posts } = Route.useLoaderData();

  return (
    <div className='container py-20'>
      <div className='space-y-4'>
        <div className='flex flex-wrap justify-between gap-4'>
          <div className='max-w-md space-y-2'>
            <h2 className='text-2xl font-bold'>Tüm Yazılar</h2>
            <p className='text-muted-foreground text-sm'>
              Dergiler, edebiyat dünyasındaki en önemli yayın organlarından biridir. Bu sayfada,
              HALO tarafından paylaşılan dergilere erişebilirsiniz.
            </p>
          </div>
          <div className='flex items-end justify-end gap-2'>
            <Button>
              <Icon icon='mdi:filter-variant' />
              Filtrele
            </Button>
          </div>
        </div>
        <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'>
          {posts.items.map((post) => (
            <PostCard
              key={post.id}
              post={post}
            />
          ))}
        </div>
        <Pagination
          currentPage={posts.meta.skip / posts.meta.take + 1}
          totalPages={Math.ceil(posts.meta.total / posts.meta.take)}
        />
      </div>
    </div>
  );
}
