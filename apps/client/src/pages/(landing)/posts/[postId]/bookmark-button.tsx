import { Button } from "@heroui/react";
import { useBookmarkStore } from "~/store/bookmark-store";
import { LucideBookmark, LucideBookMarked } from "lucide-react";

export default function BookmarkButton({ postId }: { postId: string }) {
  const { isBookmarked, toggleBookmark } = useBookmarkStore();

  return (
    <Button
      isIconOnly
      onPress={() => toggleBookmark(postId)}
      variant='light'
    >
      {isBookmarked(postId) ? <LucideBookMarked /> : <LucideBookmark />}
    </Button>
  );
}
