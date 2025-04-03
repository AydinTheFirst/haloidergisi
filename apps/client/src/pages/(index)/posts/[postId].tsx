import type { MetaFunction } from "react-router";

import { Button, Image, Link } from "@heroui/react";
import { useLoaderData } from "react-router";

import type { Post } from "@/types";

import { Loader } from "@/components";
import http from "@/http";
import { getFileUrl } from "@/utils";

export const loader = async ({ params }: { params: { postId: string } }) => {
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
    <div className='mx-auto grid max-w-5xl grid-cols-12 gap-3'>
      <div className='col-span-12 grid place-items-center md:col-span-6'>
        <Image
          alt='Magazine'
          className='h-96 w-full object-cover'
          src={getFileUrl(magazine.cover!)}
        />
      </div>

      <div className='col-span-12 md:col-span-6'>
        <div className='grid gap-5'>
          <h2 className='text-3xl font-extrabold'>{magazine.title}</h2>
          <p className='text-lg font-bold'>{magazine.description}</p>
          <Button
            as={Link}
            color='secondary'
            href={getFileUrl(magazine.file!)}
            isExternal
            size='sm'
          >
            <strong>Dergiyi Göster</strong>
          </Button>
          <small className='text-end'>
            {new Date(magazine.createdAt).toLocaleDateString("tr-TR", {
              day: "numeric",
              month: "long",
              year: "numeric"
            })}
          </small>
        </div>
      </div>
    </div>
  );
};

export default ViewMagazine;
