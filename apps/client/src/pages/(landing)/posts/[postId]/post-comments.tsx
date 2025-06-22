import type { Comment } from "~/models/Comment";

import {
  Button,
  ButtonGroup,
  cn,
  Link,
  Textarea,
  useDisclosure
} from "@heroui/react";
import CdnAvatar from "~/components/cdn-avatar";
import ConfirmModal from "~/components/confirm-modal";
import DisplayDateTime from "~/components/display-datetime";
import { useAuth } from "~/hooks/use-auth";
import { handleError, http } from "~/lib/http";
import { LucideSend, LucideTrash } from "lucide-react";
import React from "react";
import { toast } from "sonner";
import useSWR, { mutate } from "swr";

interface PostCommentsProps {
  postId: string;
}

export default function PostComments({ postId }: PostCommentsProps) {
  const { user } = useAuth();
  const { data: comments } = useSWR<Comment[]>(`/posts/${postId}/comments`);

  const [isLoading, setIsLoading] = React.useState(false);
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const content = formData.get("content");

    setIsLoading(true);

    try {
      await http.post("/comments", {
        content,
        postId
      });
      mutate(`/posts/${postId}/comments`);
      toast.success("Yorumunuz başarıyla eklendi!");
    } catch (error) {
      handleError(error);
    }

    setIsLoading(false);
  };

  if (!comments) {
    return <div className='text-muted text-center'>Yorumlar yükleniyor...</div>;
  }

  return (
    <div className='grid gap-3'>
      <ul className='grid gap-3'>
        {comments.map((comment) => (
          <CommentBuble
            comment={comment}
            key={comment.id}
          />
        ))}
      </ul>
      {comments.length === 0 && (
        <div className='text-muted'>
          Bu gönderi için henüz yorum yapılmamış.
        </div>
      )}
      {user ? (
        <div className='grid gap-3'>
          <form
            className='flex items-end gap-3'
            onSubmit={handleSubmit}
          >
            <Textarea
              name='content'
              placeholder='Yorum Ekle...'
              variant='faded'
            />
            <Button
              isIconOnly
              isLoading={isLoading}
              type='submit'
              variant='light'
            >
              <LucideSend />
            </Button>
          </form>
        </div>
      ) : (
        <div className='text-muted'>
          Yorum yapabilmek için lütfen <Link href='/login'>giriş yapın</Link>
          <span> veya </span>
          <Link href='/register'>kaydolun</Link>.
        </div>
      )}
    </div>
  );
}

function CommentBuble({ comment }: { comment: Comment }) {
  const { user } = useAuth();

  const deleteModal = useDisclosure();

  const handleDelete = async () => {
    try {
      await http.delete(`/comments/${comment.id}`);
      toast.success("Yorum başarıyla silindi");
      mutate(`/posts/${comment.postId}/comments`);
    } catch (error) {
      handleError(error);
    }
  };

  return (
    <>
      <li className='group relative flex items-start gap-2.5'>
        {user?.id === comment.user.id && (
          <ButtonGroup
            className={cn(
              "absolute end-0 top-0",
              "opacity-0 transition-opacity group-hover:opacity-100"
            )}
            isIconOnly
            size='sm'
            variant='flat'
          >
            <Button
              color='danger'
              onPress={deleteModal.onOpen}
            >
              <LucideTrash size={20} />
            </Button>
          </ButtonGroup>
        )}
        <CdnAvatar
          className='shrink-0'
          {...(comment.user.profile?.avatarUrl && {
            src: comment.user.profile.avatarUrl
          })}
          alt={comment.user.profile?.displayName ?? "Unknown User"}
        />
        <div className='flex w-full flex-col'>
          <div className='flex items-center space-x-2 rtl:space-x-reverse'>
            <span className='text-sm font-semibold'>
              {comment.user.profile?.displayName ?? "Unknown User"}
            </span>
            <span className='text-muted text-sm font-normal'>
              <DisplayDateTime date={comment.createdAt} />
            </span>
          </div>
          <p className='py-1 text-sm'>{comment.content}</p>
        </div>
      </li>

      <ConfirmModal
        {...deleteModal}
        message='Bu yorum silinecek. Devam etmek istiyor musunuz?'
        onConfirm={handleDelete}
      />
    </>
  );
}
