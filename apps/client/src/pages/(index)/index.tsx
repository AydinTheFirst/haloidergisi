import { Button, Card, CardBody, Input, Link } from "@heroui/react";
import {
  LucideBook,
  LucidePen,
  LucideSearch,
  LucideUsers,
  LucideUsers2
} from "lucide-react";
import { type MetaFunction, useLoaderData } from "react-router";
import useSWR from "swr";

import type { News, Post, Stats } from "@/types";
import type { PaginatedResponse } from "@/types/extended";

import { NewsCard } from "@/components/NewsCard";
import { PostCard2 } from "@/components/PostCard";
import { useNavbarHeight } from "@/hooks";
import http from "@/http";

export const loader = async () => {
  const { data: posts } = await http.get<PaginatedResponse<Post>>("posts", {
    params: {
      limit: 5
    }
  });

  return posts.data;
};

export const meta: MetaFunction = ({ data }) => {
  const posts = data as Post[];

  return [
    { title: "HALO Dergisi - Anasayfa" },
    { description: "HALO Dergisi - Anasayfa" },
    { content: "HALO Dergisi - Anasayfa", property: "og:title" },
    { content: "HALO Dergisi - Anasayfa", property: "og:description" },
    { content: "/banner.png", property: "og:image" },
    { content: posts.map((c) => c.title).join(", "), property: "keywords" }
  ];
};

export default function Home() {
  return (
    <div className='grid gap-20'>
      <HeroSection />
      <FeaturedSection />
      <NewsSection />
    </div>
  );
}

export function StatsSection() {
  const { data: stats } = useSWR<Stats>("/stats");
  if (!stats) return null;

  interface StatCloudProps {
    count: number;
    description?: string;
    icon: React.ReactNode;
    title: string;
  }

  const StatCloud = ({ count, description, icon, title }: StatCloudProps) => {
    return (
      <Card>
        <CardBody className='grid place-items-center gap-5 text-center'>
          {icon}
          <p className='text-5xl font-bold'>{count}</p>
          <h3 className='text-lg font-semibold'>{title}</h3>
          {description && <p className='text-gray-500'>{description}</p>}
        </CardBody>
      </Card>
    );
  };

  return (
    <div className='container'>
      <div>
        <h2 className='text-2xl font-semibold'>İstatistikler</h2>
        <p className='text-gray-500'>Sitemizin güncel istatistikleri</p>
      </div>
      <br />
      <div className='grid grid-cols-2 gap-5 md:grid-cols-4'>
        <StatCloud
          count={stats.posts}
          description='Sizler için hazırladığımız içerikler'
          icon={
            <div className='rounded-full bg-yellow-500 p-3 text-white'>
              <LucideBook size={40} />
            </div>
          }
          title='Toplam Dergi'
        />
        <StatCloud
          count={99}
          description='Sitemizin günlük ziyaretçi sayısı'
          icon={
            <div className='rounded-full bg-lime-500 p-3 text-white'>
              <LucideUsers2 size={40} />
            </div>
          }
          title='Günlük Ziyaretçi'
        />
        <StatCloud
          count={stats.users}
          description='Sitemize kayıt olan kullanıcı sayısı'
          icon={
            <div className='rounded-full bg-orange-500 p-3 text-white'>
              <LucideUsers size={40} />
            </div>
          }
          title='Toplam Kullanıcı'
        />
        <StatCloud
          count={stats.authors}
          description='Sitemizde yazar olarak görev alan kullanıcı sayısı'
          icon={
            <div className='rounded-full bg-amber-500 p-3 text-white'>
              <LucidePen size={40} />
            </div>
          }
          title='Toplam Yazar'
        />
      </div>
    </div>
  );
}

function FeaturedSection() {
  const posts = useLoaderData<typeof loader>();

  return (
    <div className='container py-10'>
      <div className='grid grid-cols-1 gap-3 md:grid-cols-2'>
        <div>
          <h2 className='text-2xl font-semibold'>Öne Çıkan Dergiler</h2>
          <p className='text-gray-500'>Son güncellenen dergiler</p>
        </div>
        <div className='flex justify-end'>
          <Link href='/posts'>Tamamını Gör</Link>
        </div>
      </div>
      <br />
      <div className='grid w-full grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'>
        {posts.map((post) => (
          <PostCard2
            key={post.id}
            post={post}
          />
        ))}
      </div>
    </div>
  );
}

function HeroSection() {
  const navbarHeight = useNavbarHeight();

  return (
    <div
      className='relative'
      style={{ height: `calc(80vh - ${navbarHeight}px)` }}
    >
      {/** Background Image */}
      <div
        className='absolute inset-0 rounded border-b'
        style={{
          backgroundImage: "url(/banner.png)",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover"
        }}
      >
        {/** Content */}
        <div className='flex h-full flex-col items-center justify-end gap-3 pb-5'>
          <img
            alt='Halo Logo'
            className='h-20 w-auto md:h-32'
            src='/halo-light.png'
          />
          <form
            action=''
            className='hidden w-full max-w-2xl items-center gap-2 px-4'
          >
            <Input
              className='w-full'
              color='secondary'
              description={
                <div>
                  <p className='text-sm text-gray-500'>
                    Dergi ismi veya kategori ismi ile arama yapabilirsiniz.
                  </p>
                  <p className='text-sm text-gray-500'>
                    Örnek: <strong>Aylık Dergiler</strong>,{" "}
                    <strong>Mart Sayısı</strong>
                  </p>
                </div>
              }
              endContent={
                <Button
                  color='secondary'
                  isIconOnly
                  radius='full'
                  size='sm'
                >
                  <LucideSearch size={16} />
                </Button>
              }
              placeholder='Dergi Ara'
              radius='full'
              type='text'
              variant='underlined'
            />
          </form>
        </div>
      </div>
    </div>
  );
}

function NewsSection() {
  const { data: news } = useSWR<PaginatedResponse<News>>("/news?limit=5");

  if (!news) return null;

  return (
    <div className='container'>
      <div className='grid grid-cols-1 gap-3 md:grid-cols-2'>
        <div>
          <h2 className='text-2xl font-semibold'>Son Duyurular</h2>
          <p className='text-gray-500'>Son güncellenen duyurular</p>
        </div>
        <div className='flex justify-end'>
          <Link href='/news'>Tamamını Gör</Link>
        </div>
      </div>
      <br />
      <div className='grid w-full grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'>
        {news.data.map((news) => (
          <NewsCard
            key={news.id}
            news={news}
          />
        ))}
      </div>
    </div>
  );
}
