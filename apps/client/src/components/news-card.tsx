import type { News } from "~/models/News";

import { Card, CardBody, CardHeader, Link } from "@heroui/react";

import CdnImage from "./cdn-image";

interface NewsCardProps {
  news: News;
}

export default function NewsCard({ news }: NewsCardProps) {
  return (
    <Card
      as={Link}
      href={`/news/${news.id}`}
      isHoverable
      isPressable
    >
      <CardHeader className='flex justify-center'>
        <CdnImage
          className='h-56'
          src={news.featuredImage}
        />
      </CardHeader>
      <CardBody>
        <h2 className='text-lg font-semibold'>{news.title}</h2>
        <p className='text-muted line-clamp-3'>{news.description}</p>
        <div className='mt-2 flex items-center justify-between'>
          <span className='text-muted text-xs'>
            {new Date(news.createdAt).toLocaleDateString("tr-TR", {
              day: "numeric",
              month: "long",
              year: "numeric"
            })}
          </span>
        </div>
      </CardBody>
    </Card>
  );
}
