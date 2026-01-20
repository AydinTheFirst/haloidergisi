import type { Post } from "~/models/Post";

import {
  BreadcrumbItem,
  Breadcrumbs,
  Button,
  Divider,
  Link,
} from "@heroui/react";
import CdnImage from "~/components/cdn-image";
import { http } from "~/lib/http";
import { createMetaTags } from "~/lib/seo";
import { cdnSource } from "~/lib/utils";
import { LucideShare2 } from "lucide-react";
import { useLoaderData } from "react-router";
import { toast } from "sonner";

import type { Route } from "./+types/page";

import BookmarkButton from "./bookmark-button";
import PublisherComment from "./publisher-comment";
import { ReactionButtons } from "./reaction-buttons";
import RelatedPosts from "./related-posts";

export const meta: Route.MetaFunction = ({ data }) => {
  return createMetaTags({
    author: "HALO Dergisi",
    canonical: `/posts/${data?.post.slug}`,
    category: data?.post.category?.title || "Dergi",
    description: data?.post.description || "HALO Dergisi - Dergi Detayları",
    image: data?.post.cover && cdnSource(data.post.cover),
    keywords:
      data?.post.tags.join(", ") || "HALO, Dergi, Edebiyat, Dergi Detayları",
    robots: "index, follow",
    title: data?.post.title || "HALO Dergisi - Dergi Detayları",
    url: `https://haloidergisi.com/posts/${data?.post.slug}`
  });
};

export const loader = async ({ params }: Route.LoaderArgs) => {
  const { postId } = params;

  if (!postId) {
    throw new Response("Post not found", { status: 404 });
  }

  const { data: post } = await http.get<Post>(`/posts/${postId}`, {
    params: { include: "category" }
  });

  const [relatedRes] = await Promise.all([
    http.get<Post[]>(`/posts/${post.id}/related`)
  ]);

  return {
    post,
    relatedPosts: relatedRes.data
  };
};

export default function Page() {
  const { post, relatedPosts } = useLoaderData<typeof loader>();

  const onShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success("Link panoya kopyalandı!");
    } catch {
      toast.error("Link kopyalanamadı, lütfen manuel olarak kopyalayın.");
    }
  };

  return (
    <div className='container py-20'>
      <div className='grid gap-5'>
        <Breadcrumbs>
          <BreadcrumbItem href='/'>Anasayfa</BreadcrumbItem>
          <BreadcrumbItem href='/posts'>Dergiler</BreadcrumbItem>
          <BreadcrumbItem href={`/posts?categoryId=${post.categoryId}`}>
            {post.category?.title}
          </BreadcrumbItem>
          <BreadcrumbItem href={`/posts/${post.slug}`}>
            {post.title}
          </BreadcrumbItem>
        </Breadcrumbs>
        <div>
          <h1 className='text-2xl font-bold'>{post.title}</h1>
        </div>
        <div className='grid grid-cols-12 gap-3'>
          <div className='col-span-12 md:col-span-4'>
            <div className='grid gap-3'>
              {post.cover && <CdnImage src={post.cover} />}
              <div className='flex items-center justify-between'>
                <div className='flex items-center gap-2'>
                  <ReactionButtons postId={post.id} />
                  <Button
                    isIconOnly
                    onPress={onShare}
                    variant='light'
                  >
                    <LucideShare2 />
                  </Button>
                </div>
                <div className='flex justify-end'>
                  <BookmarkButton postId={post.id} />
                </div>
              </div>
              {post.file && (
                <Button
                  as={Link}
                  href={cdnSource(post.file)}
                  isExternal
                >
                  Dergiyi Görüntüle
                </Button>
              )}
            </div>
          </div>
          <div className='col-span-12 md:col-span-8'>
            <PublisherComment post={post} />
          </div>
        </div>
        <Divider className='my-5' />
        <div>
          <RelatedPosts
            post={post}
            relatedPosts={relatedPosts}
          />
        </div>
      </div>
    </div>
  );
}
