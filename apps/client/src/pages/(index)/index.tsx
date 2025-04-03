import { Button, Card, CardFooter, Divider, Image } from "@heroui/react";
import { useLoaderData, useNavigate } from "react-router";

import type { Post } from "@/types";
import type { CategoryWithPosts } from "@/types/extended";

import { Logo } from "@/components";
import http from "@/http";
import { getFileUrl, sleep } from "@/utils";

const Index = () => {
  return (
    <div className='grid gap-10'>
      <Hero />
      <Categories />
    </div>
  );
};

export default Index;

const Hero = () => {
  const scrollTo = () => {
    window.scrollTo({
      behavior: "smooth",
      top: window.innerHeight + 10
    });
  };
  return (
    <>
      <img
        alt='Banner'
        className='fixed left-0 top-0 -z-10 h-full w-full object-cover'
        src='/banner.png'
      />
      <div className='flex h-[80vh] flex-col items-center justify-end gap-3'>
        <Logo className='h-20 w-auto md:h-40' />
        <Button
          color='secondary'
          onPress={scrollTo}
          size='lg'
        >
          <strong>Dergileri Keşfet</strong>
        </Button>
      </div>
    </>
  );
};

export const loader = async () => {
  const categories = await http.fetcher<CategoryWithPosts[]>(
    "/categories?posts=true"
  );
  return categories;
};

const Categories = () => {
  const categories = useLoaderData<typeof loader>();

  return categories.map((category, i) => (
    <CategorySection
      category={category}
      key={i}
    />
  ));
};

const CategorySection = ({ category }: { category: CategoryWithPosts }) => {
  const magazines = category.posts.sort((a, b) => {
    if (new Date(a.createdAt) < new Date(b.createdAt)) return 1;
    if (new Date(a.createdAt) > new Date(b.createdAt)) return -1;
    return 0;
  });

  return (
    <>
      <div className='category container'>
        <h1 className='mb-3 text-3xl font-bold'>{category.title}</h1>
        <div className='grid grid-cols-2 gap-3 md:grid-cols-4 lg:grid-cols-6'>
          {magazines.map((magazine: Post, i) => (
            <MagazineCard
              key={i}
              magazine={magazine}
            />
          ))}
        </div>
      </div>

      <Divider className='my-10' />
    </>
  );
};

const MagazineCard = ({ magazine }: { magazine: Post }) => {
  const navigate = useNavigate();
  const handlePress = async () => {
    await sleep(350);
    navigate(`/posts/${magazine.slug}`);
  };

  return (
    <Card
      className='bg-[#F8EFD0]'
      id={magazine.id}
      isPressable
      onPress={handlePress}
    >
      <Image
        alt={magazine.title}
        loading='lazy'
        src={getFileUrl(magazine.cover!)}
      />
      <CardFooter className='flex flex-col justify-between'>
        <strong>{magazine.title}</strong>
        <small>
          {new Date(magazine.createdAt).toLocaleDateString("tr-TR", {
            day: "numeric",
            month: "long",
            year: "numeric"
          })}
        </small>
      </CardFooter>
    </Card>
  );
};
