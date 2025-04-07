import type { LoaderFunctionArgs } from "react-router";

import { Button, Card, CardBody, CardHeader, Input } from "@heroui/react";
import {
  type MetaFunction,
  useLoaderData,
  useSearchParams
} from "react-router";

import type { Post } from "@/types";

import { PostCard } from "@/components/PostCard";
import http from "@/http";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const params = new URLSearchParams(request.url.split("?")[1]);
  const objectParams: Record<string, string> = {};
  for (const [key, value] of params.entries()) {
    objectParams[key] = value;
  }

  const { data: posts } = await http.get<Post[]>("/posts", {
    params: objectParams
  });
  return posts;
};

export const meta: MetaFunction = ({ data }) => {
  const posts = data as Post[];
  return [
    { title: "HALO Tüm Dergiler" },
    {
      content:
        "Tüm dergileri burada bulabilirsiniz. Dergileri inceleyebilir ve indirebilirsiniz.",
      name: "description"
    },
    {
      content: posts.map((post) => post.title).join(", "),
      property: "og:title"
    },
    {
      content: posts.map((post) => post.description).join(", "),
      property: "og:description"
    },
    { content: "/banner.png", property: "og:image" },
    { content: posts.map((c) => c.title).join(", "), property: "keywords" }
  ];
};

export default function ViewPosts() {
  const posts = useLoaderData<typeof loader>();
  const [searchParams, setSearchParams] = useSearchParams();

  const loadMore = () => {
    const currentPage = parseInt(searchParams.get("limit") || "10", 10);
    setSearchParams({ limit: (currentPage + 5).toString() });
  };

  const limit = parseInt(searchParams.get("limit") || "10", 10);
  const canLoadMore = limit === posts.length;

  return (
    <div className='container my-20'>
      <div className='grid grid-cols-12 gap-10'>
        <div className='col-span-12 md:col-span-4'>
          <Card className='sticky top-20'>
            <CardHeader className='flex flex-col items-start gap-3'>
              <h2 className='text-2xl font-extrabold'>Dergi Ara</h2>
              <p className='text-sm text-gray-500'>
                Dergi başlığı veya anahtar kelimeleri girerek arama
                yapabilirsiniz.
              </p>
            </CardHeader>
            <CardBody>
              <form className='grid gap-3'>
                <Input
                  label='Dergi Başlığı'
                  name='search'
                />

                <Button
                  color='primary'
                  type='submit'
                >
                  Ara
                </Button>
              </form>
            </CardBody>
          </Card>
        </div>
        <div className='col-span-12 md:col-span-8'>
          <div className='grid gap-10'>
            <div>
              <h2 className='text-3xl font-extrabold'>Tüm Dergiler</h2>
              <p className='font-semibold'>
                Tüm dergileri burada bulabilirsiniz. Dergileri inceleyebilir ve
                indirebilirsiniz.
              </p>
            </div>
            <div className='grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-3'>
              {posts.map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                />
              ))}
            </div>
            {canLoadMore && (
              <div className='flex justify-center'>
                <Button
                  color='primary'
                  onClick={loadMore}
                >
                  Daha Fazla Yükle
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
