import type { Post } from "@repo/db";

import { Icon } from "@iconify/react";
import { Link } from "@tanstack/react-router";
import { motion } from "motion/react";

import { Badge } from "@/components/ui/badge";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

import CdnImage from "./cdn-image";
import { Skeleton } from "./skeleton";

interface PostCardProps {
  post: Post;
}

export function PostCard({ post }: PostCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <Link
        to='/posts/$postId'
        params={{ postId: post.slug }}
      >
        <Card className='flex h-40 flex-row overflow-hidden p-0 md:h-56'>
          <div className='relative w-32 shrink-0 md:w-40'>
            <CdnImage
              src={post.coverImage!}
              alt={post.title}
              className='absolute inset-0 h-full w-full rounded-none object-cover shadow-none'
            />
          </div>
          <div className='flex-1 py-4 pe-2'>
            <CardTitle className='line-clamp-1'>{post.title}</CardTitle>
            <CardDescription className='line-clamp-2 md:line-clamp-4'>
              {post.content}
            </CardDescription>
            <div
              hidden
              className='mt-auto flex items-center justify-end gap-2'
            >
              <Badge
                variant='outline'
                className='gap-1'
              >
                <Icon icon='mdi:eye' />
                <span>{Math.floor(Math.random() * 1000)}</span>
              </Badge>
              <Badge
                variant='outline'
                className='gap-1'
              >
                <Icon icon='mdi:thumb-up-outline' />
                <span>{Math.floor(Math.random() * 1000)}</span>
              </Badge>
            </div>
          </div>
        </Card>
      </Link>
    </motion.div>
  );
}

export const PostCardSkeleton = () => {
  return (
    <Card className='flex h-40 flex-row overflow-hidden p-0 md:h-56'>
      <div className='relative w-40 shrink-0 md:w-56'>
        <Skeleton className='absolute inset-0 h-full w-full rounded-none' />
      </div>
      <CardHeader className='flex-1 py-4 pe-2'>
        <Skeleton className='mb-2 h-6 w-3/4 rounded' />
        <Skeleton className='mb-4 h-4 w-full rounded' />
        <Skeleton className='mb-4 h-4 w-full rounded' />
        <div className='mt-auto flex items-center justify-end gap-2'>
          <Skeleton className='h-6 w-16 rounded' />
          <Skeleton className='h-6 w-16 rounded' />
        </div>
      </CardHeader>
    </Card>
  );
};
