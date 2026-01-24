import { Button } from "@adn-ui/react";
import { Icon } from "@iconify/react";
import { Category, Post } from "@repo/db";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";

import { Breadcrumb, BreadcrumbItem } from "@/components/breadcrumbs";
import CdnImage from "@/components/cdn-image";
import Markdown from "@/components/markdown";
import { PostCard, PostCardSkeleton } from "@/components/post-card";
import apiClient from "@/lib/api-client";
import { QueryRes } from "@/types";
import { getCdnUrl } from "@/utils/cdn";

interface _Post extends Post {
  category?: Category;
}

export const Route = createFileRoute("/_landing/posts/$postId")({
  component: RouteComponent,
  loader: async ({ params }) => {
    const { data: post } = await apiClient.get<QueryRes<_Post>>("/posts", {
      params: {
        slug: params.postId,
        fields: JSON.stringify({ category: true }),
      },
    });

    return { post: post.items[0] };
  },
});

function RouteComponent() {
  const { post } = Route.useLoaderData();

  console.log(post);

  return (
    <div className='container py-20'>
      <div className='space-y-10'>
        <Breadcrumb>
          <BreadcrumbItem>
            <Link
              to='/'
              className='link'
            >
              Ana Sayfa
            </Link>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <Link
              to='/posts'
              className='link'
              search={{}}
            >
              Tüm Dergiler
            </Link>
          </BreadcrumbItem>
          <BreadcrumbItem>{post.title}</BreadcrumbItem>
        </Breadcrumb>

        <div className='grid grid-cols-12 gap-4 md:gap-8'>
          <div className='col-span-12 md:col-span-3'>
            <div className='space-y-4'>
              <CdnImage
                src={post.coverImage!}
                alt={post.title}
              />
              <Button
                render={
                  <Link
                    to={getCdnUrl(post.attachment!)}
                    target='_blank'
                    rel='noopener noreferrer'
                  />
                }
                className='hidden w-full md:inline-flex'
              >
                <Icon icon='mdi:download' />
                Dergiyi İndir
              </Button>
            </div>
          </div>
          <div className='col-span-12 md:col-span-6'>
            <div className='space-y-2'>
              <h1 className='text-3xl font-bold'>{post.title}</h1>
              <Markdown className='text-sm'>
                {post.content ?? "lorem ipsum dolor sit amet"}
              </Markdown>
            </div>
          </div>
          <aside className='col-span-12 md:col-span-3'>
            <h4 className='mb-4 text-xl font-semibold'>Dergi Bilgileri</h4>
            <ul className='space-y-2'>
              <li className='flex items-center justify-between'>
                <strong>Kategori</strong>
                <span>{post.category?.name}</span>
              </li>
              <li className='flex items-center justify-between'>
                <strong>Yayın Tarihi</strong>
                <span>
                  {new Date(post.createdAt!).toLocaleDateString("tr-TR", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </li>
              <li className='flex items-center justify-between'>
                <strong>PDF</strong>
                <a
                  href={getCdnUrl(post.attachment!)}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='link'
                >
                  İndir
                </a>
              </li>
              <li>
                <Button
                  render={
                    <Link
                      to={getCdnUrl(post.attachment!)}
                      target='_blank'
                      rel='noopener noreferrer'
                    />
                  }
                  className='w-full md:hidden'
                >
                  <Icon icon='mdi:download' />
                  Dergiyi İndir
                </Button>
              </li>
            </ul>
          </aside>
        </div>
        <br />
        <FeaturedPosts />
      </div>
    </div>
  );
}

function FeaturedPosts() {
  const { post } = Route.useLoaderData();

  const { data: posts } = useQuery({
    queryKey: ["featured-posts"],
    queryFn: async () => {
      const { data } = await apiClient.get<QueryRes<Post>>("/posts", {
        params: { limit: 3, filter: JSON.stringify({ id: { not: post.id } }) },
      });

      return data;
    },
  });

  return (
    <div className='space-y-4'>
      <div className='flex flex-wrap justify-between gap-2'>
        <div className='space-y-1'>
          <h2 className='text-2xl font-bold'>Öne Çıkan Dergiler</h2>
          <p className='text-muted-foreground'>Son eklenen dergilere göz atın</p>
        </div>
        <div className='flex items-end justify-end'></div>
      </div>
      <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'>
        {posts?.items.map((post) => (
          <PostCard
            key={post.id}
            post={post}
          />
        ))}
        {!posts && [...Array(3)].map((_, index) => <PostCardSkeleton key={index} />)}
      </div>
    </div>
  );
}
