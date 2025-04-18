import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Chip,
  cn,
  Divider,
  Image
} from "@heroui/react";
import { Link } from "react-router";

import type { Post } from "@/types";

import { getFileUrl } from "@/utils";

export interface PostCardProps {
  className?: string;
  post: Post;
}

export function PostCard({ post }: PostCardProps) {
  const oneMonthAgo = new Date();
  oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
  const isNew = new Date(post.createdAt) > oneMonthAgo;

  return (
    <Card
      as={Link}
      className={cn("relative", isNew && "new-post")}
      isHoverable
      isPressable
      to={`/posts/${post.slug}`}
    >
      {isNew && (
        <div className='absolute end-0 top-0 z-50'>
          <Chip
            color='danger'
            radius='none'
            size='lg'
          >
            <strong>Yeni</strong>
          </Chip>
        </div>
      )}
      <CardHeader
        className='justify-center'
        style={{
          backgroundImage: "url(/banner.png)",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover"
        }}
      >
        <Image
          alt={post.title}
          className='h-64 w-full rounded-lg object-contain'
          src={getFileUrl(post.cover!)}
        />
      </CardHeader>
      <Divider />
      <CardBody className='grid gap-3 text-center'>
        <h2 className='text-lg font-semibold text-gray-900'>{post.title}</h2>
      </CardBody>
      <Divider />
      <CardFooter className='justify-end'>
        <small>
          {new Date(post.createdAt).toLocaleDateString("tr-TR", {
            day: "numeric",
            month: "long",
            year: "numeric"
          })}
        </small>
      </CardFooter>
    </Card>
  );
}

export const PostCard2 = ({ className, post }: PostCardProps) => {
  const oneMonthAgo = new Date();
  oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
  const isNew = new Date(post.createdAt) > oneMonthAgo;
  return (
    <Card
      as={Link}
      className={cn("relative", isNew && "new-post", className)}
      id={post.id}
      isHoverable
      isPressable
      to={`/posts/${post.slug}`}
    >
      {isNew && (
        <div className='absolute end-0 top-0 z-50'>
          <Chip
            color='danger'
            radius='none'
            size='lg'
          >
            <strong>Yeni</strong>
          </Chip>
        </div>
      )}

      <Image
        alt={post.title}
        loading='lazy'
        src={getFileUrl(post.cover!)}
      />
      <CardFooter className='flex flex-col justify-between text-center'>
        <strong>{post.title}</strong>
        <small>
          {new Date(post.createdAt).toLocaleDateString("tr-TR", {
            day: "numeric",
            month: "long",
            year: "numeric"
          })}
        </small>
      </CardFooter>
    </Card>
  );
};
