import { type MetaFunction, useLoaderData } from "react-router";

import type { News } from "~/models/News";
import type { Post } from "~/models/Post";
import type { PaginatedResponse } from "~/types";

import { http } from "~/lib/http";

import FeaturedNews from "./featured-news";
import FeaturedPosts from "./featured-posts";
import Hero from "./hero-featured";

export const loader = async () => {
  const { data: posts } = await http.get<PaginatedResponse<Post>>("/posts", {
    params: { include: "category,reactions,comments", limit: 8 },
  });

  const { data: news } = await http.get<PaginatedResponse<News>>("/news", {
    params: { limit: 4 },
  });

  return { news, posts };
};

export const meta: MetaFunction = () => {
  return [
    {
      description:
        "HALO Dergisi, edebiyat dünyasındaki en son haberleri ve makaleleri burada bulabilirsiniz. Dergiler, edebiyat dünyasındaki en önemli yayın organlarından biridir.",
      title: "HALO Dergisi - Anasayfa",
    },
  ];
};

export default function Page() {
  const { news, posts } = useLoaderData<typeof loader>();

  return (
    <>
      <Hero />
      <div className="h-20" />
      <div className="container flex flex-col gap-10">
        <FeaturedPosts posts={posts.items} />
        <FeaturedNews news={news.items} />
      </div>
    </>
  );
}
