import type { News } from "~/models/News";
import type { PaginatedResponse } from "~/types";

import { Button, Pagination } from "@heroui/react";
import NewsCard from "~/components/news-card";
import { http } from "~/lib/http";
import {
  type MetaFunction,
  useLoaderData,
  useSearchParams
} from "react-router";

import type { Route } from "./+types/page";

export const meta: MetaFunction = () => {
  return [
    {
      description:
        "Edebiyat Dergisi hakkında ki en son haberleri ve makaleleri burada bulabilirsiniz. Dergiler, edebiyat dünyasındaki en önemli yayın organlarından biridir.",
      title: `HALO Dergisi - Haberler`
    }
  ];
};

export const loader = async ({ request }: Route.LoaderArgs) => {
  const { searchParams } = new URL(request.url);

  const page = searchParams.get("page") || "1";
  const limit = searchParams.get("limit") || "10";
  searchParams.set("limit", limit);
  searchParams.set("offset", String((+page - 1) * +limit));

  const { data: news } = await http.get<PaginatedResponse<News>>("/news", {
    params: {
      ...Object.fromEntries(searchParams.entries())
    }
  });

  return { news };
};

export default function ViewNews() {
  const { news } = useLoaderData<typeof loader>();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, setSearchParams] = useSearchParams();

  return (
    <div className='container py-20'>
      <div className='grid gap-5'>
        <div className='grid grid-cols-1 gap-3 md:grid-cols-2'>
          <div className='flex flex-col gap-1'>
            <h1 className='text-3xl font-bold'>Haberler</h1>
            <p className='max-w-xl'>
              Dergilerle ilgili en son haberleri ve makaleleri burada
              bulabilirsiniz. Dergiler, edebiyat dünyasındaki en önemli yayın
              organlarından biridir.
            </p>
            <p className='text-muted text-sm'>
              {news.items.length} haber bulundu.
            </p>
          </div>
        </div>
        <div className='grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3'>
          {news.items.map((news) => (
            <NewsCard
              key={news.id}
              news={news}
            />
          ))}
        </div>
        {news.items.length === 0 && (
          <div className='flex flex-col items-center justify-center gap-3'>
            <p className='text-muted'>Hiç haber bulunamadı.</p>
            <Button
              color='primary'
              onPress={() => setSearchParams({})}
              variant='light'
            >
              Filtreleri Temizle
            </Button>
          </div>
        )}
        <div
          className='flex items-center justify-center'
          hidden={news.items.length === 0}
        >
          <Pagination
            onChange={(page) =>
              setSearchParams((prev) => {
                prev.set("page", String(page));
                return prev;
              })
            }
            page={news.meta.page}
            total={news.meta.pageCount}
          />
        </div>
      </div>
    </div>
  );
}
