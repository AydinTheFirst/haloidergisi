import { Avatar, Chip } from "@heroui/react";

import type { Post } from "~/models/Post";

import { CollapsibleText } from "~/components/collapsible-text";

interface PublisherCommentProps {
  post: Post;
}
export default function PublisherComment({ post }: PublisherCommentProps) {
  return (
    <div className="flex items-start gap-2.5">
      <Avatar className="shrink-0" src="/logo.png" />
      <div className="flex w-full flex-col">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <div>
            <h4 className="text-sm font-semibold">HALO Edebiyat Dergisi</h4>
          </div>
          <div className="flex items-end justify-end">
            <span className="text-muted text-sm">
              {new Date(post.createdAt).toLocaleDateString("tr-TR", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </span>
          </div>
        </div>
        <p className="py-1 text-sm">
          <CollapsibleText text={post.description} />
        </p>
        <div className="flex gap-1">
          {post.tags.map((tag) => (
            <Chip key={tag}>{tag}</Chip>
          ))}
        </div>
      </div>
    </div>
  );
}
