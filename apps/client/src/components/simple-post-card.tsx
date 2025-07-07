import type { Post } from "~/models/Post";

import { Card, CardFooter, CardHeader, cn, Link } from "@heroui/react";

import CdnImage from "./cdn-image";

interface SimplePostCardProps {
  className?: string;
  post: Post;
}

export default function SimplePostCard({
  className,
  post
}: SimplePostCardProps) {
  return (
    <Card
      as={Link}
      className={cn(className)}
      href={`/posts/${post.id}`}
      isHoverable
      isPressable
      shadow='none'
    >
      <CardHeader className='p-0'>
        {post.cover && <CdnImage src={post.cover} />}
      </CardHeader>
      <CardFooter className='flex flex-col gap-1 text-center'>
        <h2 className='line-clamp-1 text-lg font-semibold'>{post.title}</h2>
        <small className='text-muted'>
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
