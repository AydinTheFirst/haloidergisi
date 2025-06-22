import type { Post } from "~/models/Post";

import { Card, CardBody, Chip, cn } from "@heroui/react";
import { ReactionType } from "~/models/enums";
import { LucideHeart, LucideMessageSquare } from "lucide-react";
import { Link } from "react-router";

import CdnImage from "./cdn-image";

interface PostCardProps {
  className?: string;
  post: Post;
}

export default function PostCard({ className, post }: PostCardProps) {
  const likes =
    post.reactions?.filter((reaction) => reaction.type === ReactionType.LIKE)
      .length || 0;

  const comments = post.comments?.length || 0;

  return (
    <Card
      as={Link}
      className={cn("h-full w-full", className)}
      isHoverable
      isPressable
      to={`/posts/${post.slug}`}
    >
      <CardBody className='p-0'>
        <div className='flex gap-3'>
          <div className='col-span-12 lg:col-span-4'>
            {post.cover && (
              <CdnImage
                className='h-full w-40 object-cover'
                radius='none'
                src={post.cover}
              />
            )}
          </div>
          <div className='flex-1'>
            <div className='flex h-full flex-col gap-3 p-2'>
              <div className='flex flex-1 flex-col gap-2'>
                <h2 className='text-lg font-semibold'>{post.title}</h2>
                <p className='text-muted line-clamp-1 xl:line-clamp-3'>
                  {post.description}
                </p>
              </div>

              <div className='grid grid-cols-1 gap-3 md:grid-cols-2'>
                <span className='text-muted text-xs'>
                  {new Date(post.createdAt).toLocaleDateString("tr-TR", {
                    day: "numeric",
                    month: "long",
                    year: "numeric"
                  })}
                </span>
                <div className='text-muted flex justify-center gap-2'>
                  <Chip
                    size='sm'
                    variant='light'
                  >
                    <div className='flex items-center gap-1'>
                      <LucideHeart className='h-4 w-4' />
                      <span>{likes}</span>
                    </div>
                  </Chip>
                  <Chip
                    size='sm'
                    variant='light'
                  >
                    <div className='flex items-center gap-1'>
                      <LucideMessageSquare className='h-4 w-4' />
                      <span>{comments}</span>
                    </div>
                  </Chip>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}
