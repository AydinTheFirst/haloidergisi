import { Button } from "@heroui/react";
import { LucideChevronRight } from "lucide-react";

import type { Post } from "~/models/Post";

import PostCard from "~/components/post-card";

interface RelatedPosts {
  post: Post;
  relatedPosts: Post[];
}

export default function RelatedPosts({ post, relatedPosts }: RelatedPosts) {
  return (
    <div className="grid gap-5">
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <div className="flex flex-col gap-1">
          <h2 className="text-lg font-semibold">{post.title} İçin Diğer Yazılar</h2>
          <p className="text-muted">
            Bu bölümde, {post.title} ile ilgili diğer yazıları ve içerikleri bulabilirsiniz.
            Edebiyat dünyasında keşfedilecek daha çok şey var!
          </p>
        </div>
        <div className="flex items-end justify-end">
          <Button variant="light">
            Tümünü Görüntüle
            <LucideChevronRight size={16} />
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
        {relatedPosts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
}
