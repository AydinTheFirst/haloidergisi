import type { LoaderFunctionArgs, MetaFunction } from "react-router";

import { Button, Image, Link } from "@heroui/react";
import { useLoaderData } from "react-router";

import type { Post } from "@/types";

import { Loader } from "@/components";
import { CollapsibleText } from "@/components/CollapsibleText";
import http from "@/http";
import { getFileUrl } from "@/utils";

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const { postId } = params;
  if (!postId) throw new Error("Post ID is required");
  const post = http.fetcher<Post>(`/posts/${postId}`);
  if (!post) throw new Error("Post not found");
  return post;
};

export const meta: MetaFunction = ({ data }) => {
  const magazine = data as Post;
  return [
    { title: magazine.title },
    { content: magazine.title, property: "og:title" },
    { content: magazine.description, property: "og:description" },
    { content: getFileUrl(magazine.cover!), property: "og:image" }
  ];
};

const ViewMagazine = () => {
  const magazine = useLoaderData<typeof loader>();

  if (!magazine) return <Loader />;

  return (
    <div className='container max-w-5xl'>
      <div className='grid grid-cols-12 gap-5'>
        <div className='col-span-12 md:col-span-4'>
          <div className='grid place-items-center'>
            <Image
              alt='Magazine'
              className='mx-auto h-96 w-full object-cover'
              src={getFileUrl(magazine.cover!)}
            />
          </div>
        </div>
        <div className='col-span-12 md:col-span-8'>
          <div className='grid gap-3'>
            <h2 className='text-xl font-extrabold'>{magazine.title}</h2>
            <CollapsibleText text={magazine.description} />
            <Button
              as={Link}
              href={getFileUrl(magazine.file!)}
              isExternal
            >
              Dergiyi Görüntüle
            </Button>
            <p className='text-end text-sm font-medium text-gray-500'>
              Yayın Tarihi: {new Date(magazine.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewMagazine;
