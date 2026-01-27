import type { Post } from "@repo/db";

import { Card, Chip } from "@adn-ui/react";
import { Icon } from "@iconify/react";
import { Link } from "@tanstack/react-router";
import { motion } from "motion/react";

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
        <Card.Root className='h-40 flex-row p-0 md:h-56'>
          <CdnImage
            src={post.coverImage!}
            alt={post.title}
            className='h-full w-full rounded-e-none'
          />
          <Card.Header className='py-4 pe-2'>
            <Card.Title className='line-clamp-1'>{post.title}</Card.Title>
            <Card.Description className='line-clamp-2 md:line-clamp-4'>
              {post.content}
            </Card.Description>
            <div
              hidden
              className='mt-auto flex items-center justify-end gap-2'
            >
              <Chip
                size='sm'
                variant='outline'
              >
                <Icon icon='mdi:eye' />
                <span>{Math.floor(Math.random() * 1000)}</span>
              </Chip>
              <Chip
                size='sm'
                variant='outline'
              >
                <Icon icon='mdi:thumb-up-outline' />
                <span>{Math.floor(Math.random() * 1000)}</span>
              </Chip>
            </div>
          </Card.Header>
        </Card.Root>
      </Link>
    </motion.div>
  );
}

export const PostCardSkeleton = () => {
  return (
    <Card.Root className='h-40 flex-row p-0 md:h-56'>
      <Skeleton className='aspect-3/4 h-full rounded-s' />
      <Card.Header className='py-4 pe-2'>
        <Skeleton className='mb-2 h-6 w-3/4 rounded' />
        <Skeleton className='mb-4 h-4 w-full rounded' />
        <Skeleton className='mb-4 h-4 w-full rounded' />
        <div className='mt-auto flex items-center justify-end gap-2'>
          <Skeleton className='h-6 w-16 rounded' />
          <Skeleton className='h-6 w-16 rounded' />
        </div>
      </Card.Header>
    </Card.Root>
  );
};
