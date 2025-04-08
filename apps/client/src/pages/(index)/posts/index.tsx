import type { LoaderFunctionArgs } from "react-router";

import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Input,
  Pagination,
  Select,
  SelectItem
} from "@heroui/react";
import {
  type MetaFunction,
  useLoaderData,
  useSearchParams
} from "react-router";
import useSWR from "swr";

import type { Category } from "@/types";
import type { PaginatedResponse } from "@/types/extended";

import { PostCard } from "@/components/PostCard";
import http from "@/http";
import { type Post } from "@/types";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const params = new URLSearchParams(request.url.split("?")[1]);

  const page = parseInt(params.get("page") || "1");
  const limit = parseInt(params.get("limit") || "10");
  const offset = (page - 1) * limit;

  const objectParams: Record<string, string> = {
    limit: limit.toString(),
    offset: offset.toString()
  };

  for (const [key, value] of params.entries()) {
    objectParams[key] = value;
  }

  const { data: posts } = await http.get<PaginatedResponse<Post>>("/posts", {
    params: objectParams
  });

  return posts;
};

export const meta: MetaFunction = ({ data }) => {
  const posts = data as PaginatedResponse<Post>;
  return [
    { title: "HALO Tüm Dergiler" },
    {
      content:
        "Tüm dergileri burada bulabilirsiniz. Dergileri inceleyebilir ve indirebilirsiniz.",
      name: "description"
    },
    {
      content: posts.data.map((post) => post.title).join(", "),
      property: "og:title"
    },
    {
      content: posts.data.map((post) => post.description).join(", "),
      property: "og:description"
    },
    { content: "/banner.png", property: "og:image" },
    { content: posts.data.map((c) => c.title).join(", "), property: "keywords" }
  ];
};

export default function ViewPosts() {
  const posts = useLoaderData<typeof loader>();
  const [searchParams, setSearchParams] = useSearchParams();

  const { data: categories } = useSWR<Category[]>("/categories");

  const handlePageChange = (page: number) => {
    console.log(searchParams);
    setSearchParams({
      ...searchParams,
      page: page.toString()
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data: Record<string, unknown> = Object.fromEntries(
      formData.entries()
    );

    setSearchParams({
      ...searchParams,
      ...data
    });
  };

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
              <form
                className='grid gap-3'
                onSubmit={handleSubmit}
              >
                <Input
                  defaultValue={searchParams.get("search") || ""}
                  isClearable
                  label='Ara'
                  name='search'
                  variant='faded'
                />

                <Select
                  defaultSelectedKeys={[searchParams.get("categoryId") || ""]}
                  items={categories || []}
                  label='Dergi Kategorisi'
                  name='categoryId'
                  variant='faded'
                >
                  {(item) => (
                    <SelectItem
                      key={item.id}
                      textValue={item.title}
                    >
                      {item.title}
                    </SelectItem>
                  )}
                </Select>

                <Button type='submit'>
                  <strong>Ara</strong>
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
              {posts.data.map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                />
              ))}
            </div>
            {posts.data.length === 0 && (
              <div className='grid place-items-center'>
                <h2 className='text-2xl font-semibold text-gray-500'>
                  Dergi bulunamadı.
                </h2>
              </div>
            )}
            <div className='grid place-items-center'>
              <Pagination
                onChange={handlePageChange}
                page={posts.meta.page}
                total={posts.meta.pageCount}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
