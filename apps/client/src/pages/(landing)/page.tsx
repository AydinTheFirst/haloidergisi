import type { News } from "~/models/News";
import type { Post } from "~/models/Post";
import type { PaginatedResponse } from "~/types";

import { http } from "~/lib/http";
import { useLoaderData } from "react-router";

import FeaturedNews from "./featured-news";
import FeaturedPosts from "./featured-posts";
import HeroSection from "./hero";

export const loader = async () => {
  const { data: posts } = await http.get<PaginatedResponse<Post>>("/posts", {
    params: { include: "category,reactions,comments", limit: 8 }
  });

  const { data: news } = await http.get<PaginatedResponse<News>>("/news", {
    params: { limit: 4 }
  });

  return { news, posts };
};

export default function Page() {
  const { news, posts } = useLoaderData<typeof loader>();

  return (
    <>
      <HeroSection />
      <div className='h-20' />
      <div className='container flex flex-col gap-10'>
        <FeaturedPosts posts={posts.items} />
        <FeaturedNews news={news.items} />
      </div>
    </>
  );
}
