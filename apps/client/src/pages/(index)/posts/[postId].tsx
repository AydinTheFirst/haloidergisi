import type { MetaFunction } from "react-router";

import { Button, Image, Link } from "@heroui/react";
import { LucideExternalLink } from "lucide-react";
import { useState } from "react";
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

  const [isDescriptionVisible, setIsDescriptionVisible] = useState(false);

  if (!magazine) return <Loader />;

  return (
    <div className='container my-20 max-w-5xl'>
      <div className='grid gap-10'>
        <div className='grid grid-cols-12 gap-10'>
          <div className='col-span-12 md:col-span-4'>
            <Image
              alt='Magazine'
              className='mx-auto h-96 w-full object-cover'
              src={getFileUrl(magazine.cover!)}
            />
          </div>
          <div className='col-span-12 grid gap-3 md:col-span-8'>
            <h2 className='text-3xl font-extrabold'>{magazine.title}</h2>
            <p className='font-semibold'>
              {isDescriptionVisible
                ? magazine.description
                : magazine.description.substring(0, 255)}
              <button
                className='mx-3 text-gray-500'
                onClick={() => setIsDescriptionVisible(!isDescriptionVisible)}
              >
                {isDescriptionVisible ? "Daha Az Göster" : "Devamını Oku"}
              </button>
            </p>

            <div>
              <Button
                as={Link}
                href={getFileUrl(magazine.file!)}
                isExternal
                startContent={<LucideExternalLink size={14} />}
                variant='shadow'
              >
                <strong>Dergiyi Göster</strong>
              </Button>
            </div>
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
    </div>
  );
};

export default ViewMagazine;
