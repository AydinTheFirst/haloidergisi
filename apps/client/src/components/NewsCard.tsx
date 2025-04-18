import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Divider,
  Image
} from "@heroui/react";
import { Link } from "react-router";

import type { News } from "@/types";

import { getFileUrl } from "@/utils";

export function NewsCard({ news }: { news: News }) {
  return (
    <Card
      as={Link}
      isHoverable
      isPressable
      to={`/news/${news.slug}`}
    >
      <CardHeader className='justify-center'>
        <Image
          alt={news.title}
          className='h-64 w-full rounded-lg object-contain'
          src={getFileUrl(news.featuredImage)}
        />
      </CardHeader>
      <Divider />
      <CardBody className='grid gap-3 text-center'>
        <h2 className='text-lg font-semibold text-gray-900'>{news.title}</h2>
        <p className='truncate text-sm text-gray-500'>{news.description}</p>
      </CardBody>
      <Divider />
      <CardFooter className='justify-end'>
        <small>
          {new Date(news.createdAt).toLocaleDateString("tr-TR", {
            day: "numeric",
            month: "long",
            year: "numeric"
          })}
        </small>
      </CardFooter>
    </Card>
  );
}
