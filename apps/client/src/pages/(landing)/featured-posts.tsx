import type { Post } from "~/models/Post";

import { Button, Link } from "@heroui/react";
import PostCard from "~/components/post-card";
import SimplePostCard from "~/components/simple-post-card";
import { LucideChevronLeft, LucideChevronRight } from "lucide-react";
import { useRef } from "react";

interface FeaturedPostsProps {
  posts: Post[];
}

export default function FeaturedPosts({ posts }: FeaturedPostsProps) {
  const scrollContainer = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    scrollContainer.current?.scrollBy({ behavior: "smooth", left: -200 });
  };

  const scrollRight = () => {
    scrollContainer.current?.scrollBy({ behavior: "smooth", left: 200 });
  };

  return (
    <div
      className='grid gap-5'
      id='posts'
    >
      <div className='grid grid-cols-1 gap-3 md:grid-cols-2'>
        <div className='grid gap-1'>
          <h4 className='text-2xl font-semibold'>Öne Çıkan Dergiler</h4>
          <p className='text-muted'>
            Bu bölümde, dergimizin en son sayılarında öne çıkan yazıları ve
            içerikleri bulabilirsiniz. Her sayıda farklı konulara odaklanarak
            edebiyat dünyasına katkıda bulunmayı amaçlıyoruz. Dergimizin en yeni
            sayısını keşfedin ve edebiyatın derinliklerine dalın!
          </p>
        </div>
        <div className='flex items-end justify-end'>
          <Link
            color='foreground'
            href='/posts'
          >
            Tüm Dergileri Görüntüle
            <LucideChevronRight size={16} />
          </Link>
        </div>
      </div>

      <div className='grid gap-3 md:hidden'>
        <div
          className='flex flex-nowrap gap-3 overflow-auto p-3'
          ref={scrollContainer}
        >
          {posts.map((post) => (
            <SimplePostCard
              className='w-56 shrink-0'
              key={post.id}
              post={post}
            />
          ))}
        </div>
        <div className='flex justify-between'>
          <Button
            onPress={scrollLeft}
            variant='light'
          >
            <LucideChevronLeft />
          </Button>
          <Button
            onPress={scrollRight}
            variant='light'
          >
            <LucideChevronLeft className='rotate-180' />
          </Button>
        </div>
      </div>

      <div className='hidden grid-cols-1 gap-5 md:grid md:grid-cols-2 lg:grid-cols-3'>
        {posts.map((post) => (
          <PostCard
            key={post.id}
            post={post}
          />
        ))}
      </div>
    </div>
  );
}
