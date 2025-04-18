import type { MetaFunction } from "react-router";

import { Pagination } from "@heroui/react";
import { useLoaderData, useSearchParams } from "react-router";

import type { News } from "@/types";
import type { PaginatedResponse } from "@/types/extended";

import { NewsCard } from "@/components/NewsCard";
import http from "@/http";

export const loader = async () => {
  const { data: news } = await http.get<PaginatedResponse<News>>("/news");
  return news;
};

export const meta: MetaFunction = ({ data }) => {
  const news = data as PaginatedResponse<News>;

  return [
    { title: "HALO Tüm Haberler" },
    {
      content:
        "Tüm haberleri burada bulabilirsiniz. Haberleri inceleyebilir ve indirebilirsiniz.",
      name: "description"
    },
    {
      content: news.data.map((news) => news.title).join(", "),
      property: "og:title"
    },
    {
      content: news.data.map((news) => news.description).join(", "),
      property: "og:description"
    }
  ];
};

export default function News() {
  const news = useLoaderData<typeof loader>();
  const [searchParams, setSearchParams] = useSearchParams();

  const handlePageChange = (page: number) => {
    setSearchParams({ ...searchParams, page: page.toString() });
  };

  return (
    <div className='container my-10'>
      <div className='grid gap-10'>
        <div>
          <h2 className='text-3xl font-extrabold'>Tüm Haberler</h2>
          <p className='font-semibold'>Tüm haberleri burada bulabilirsiniz.</p>
        </div>
        <div className='grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
          {news.data.map((news) => (
            <NewsCard
              key={news.id}
              news={news}
            />
          ))}
        </div>
        {news.data.length === 0 && (
          <div className='grid place-items-center'>
            <h2 className='text-2xl font-semibold text-gray-500'>
              Haber bulunamadı.
            </h2>
          </div>
        )}
        <div className='grid place-items-center'>
          <Pagination
            onChange={handlePageChange}
            page={news.meta.page}
            total={news.meta.pageCount}
          />
        </div>
      </div>
    </div>
  );
}
