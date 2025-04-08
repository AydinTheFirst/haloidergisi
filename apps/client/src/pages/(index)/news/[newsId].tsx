import type { MetaFunction } from "react-router";

import { Image } from "@heroui/react";
import { useState } from "react";
import { useLoaderData } from "react-router";

import type { News } from "@/types";

import FilesTable from "@/components/FilesTable";
import http from "@/http";
import { getFileUrl } from "@/utils";

export const loader = async ({ params }: { params: { newsId: string } }) => {
  const { newsId } = params;
  if (!newsId) throw new Error("News ID is required");
  const news = http.fetcher<News>(`/news/${newsId}`);
  if (!news) throw new Error("News not found");
  return news;
};

export const meta: MetaFunction = ({ data }) => {
  const news = data as News;
  return [
    { title: news.title },
    { content: news.title, property: "og:title" },
    { content: news.description, property: "og:description" },
    { content: getFileUrl(news.featuredImage!), property: "og:image" }
  ];
};

export default function ViewNews() {
  const news = useLoaderData<typeof loader>();

  const [isDescriptionVisible, setIsDescriptionVisible] = useState(false);

  return (
    <div className='container my-20 max-w-5xl'>
      <div className='grid gap-10'>
        <div className='grid grid-cols-12 gap-10'>
          <div className='col-span-12 md:col-span-4'>
            <Image
              alt={news.title}
              className='mx-auto h-96 w-full object-cover'
              src={getFileUrl(news.featuredImage)}
            />
          </div>
          <div className='col-span-12 grid gap-3 md:col-span-8'>
            <h2 className='text-3xl font-extrabold'>{news.title}</h2>
            <p className='font-semibold'>
              {isDescriptionVisible
                ? news.description
                : news.description.substring(0, 255)}
              <button
                className='mx-3 text-gray-500'
                onClick={() => setIsDescriptionVisible(!isDescriptionVisible)}
              >
                {isDescriptionVisible ? "Daha Az Göster" : "Devamını Oku"}
              </button>
            </p>
            {news.files.length > 0 && <FilesTable files={news.files} />}
            <small className='text-end'>
              {new Date(news.createdAt).toLocaleDateString("tr-TR", {
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
}
