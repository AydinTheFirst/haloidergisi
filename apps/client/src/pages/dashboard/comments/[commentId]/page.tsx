import type { Comment } from "~/models/Comment";

import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Input,
  Link,
  Textarea,
  useDisclosure
} from "@heroui/react";
import ConfirmModal from "~/components/confirm-modal";
import { handleError, http } from "~/lib/http";
import React from "react";
import { useLoaderData, useNavigate } from "react-router";
import { toast } from "sonner";

export const clientLoader = async ({
  params
}: {
  params: { commentId?: string };
}) => {
  const { commentId } = params;

  if (!commentId || commentId === "create") {
    return { comment: null };
  }

  const { data: comment } = await http.get<Comment>(
    `/admin/comments/${commentId}?include=post`
  );

  return { comment };
};

export default function ViewComment() {
  const { comment } = useLoaderData<typeof clientLoader>();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = React.useState(false);
  const confirmDeleteModal = useDisclosure();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const data = Object.fromEntries(formData.entries()) as Record<
      string,
      unknown
    >;

    setIsLoading(true);

    try {
      if (comment) {
        await http.patch(`/admin/comments/${comment.id}`, data);
        toast.success("Yorum güncellendi.");
      } else {
        await http.post("/admin/comments", data);
        toast.success("Yorum oluşturuldu.");
      }

      navigate("/dashboard/comments");
    } catch (error) {
      handleError(error);
    }
    setIsLoading(false);
  };

  const handleDelete = async () => {
    if (!comment) return;

    try {
      await http.delete(`/admin/comments/${comment.id}`);
      toast.success("Yorum silindi.");
      navigate("/dashboard/comments");
    } catch (error) {
      handleError(error);
    }
  };

  return (
    <>
      <div className='grid gap-3'>
        {comment?.post && (
          <div className='flex items-center justify-between'>
            <span className='text-muted'>Bağlı Post: {comment.post.title}</span>
            <Link
              color='foreground'
              href={`/posts/${comment.post.id}`}
              isExternal
            >
              Gönderiyi Aç
            </Link>
          </div>
        )}

        <Card>
          <CardHeader className='justify-between'>
            <h2 className='text-xl font-bold'>
              {comment ? "Yorumu Güncelle" : "Yeni Yorum"}
            </h2>
            {comment && (
              <Button
                color='danger'
                onPress={confirmDeleteModal.onOpen}
              >
                Sil
              </Button>
            )}
          </CardHeader>

          <CardBody>
            <form
              className='grid gap-3'
              onSubmit={handleSubmit}
            >
              {!comment && (
                <>
                  <Input
                    isRequired
                    label='Gönderi ID'
                    name='postId'
                    placeholder='Post UUID'
                  />
                  <Input
                    label='Cevaplanacak Yorum ID (opsiyonel)'
                    name='replyToId'
                    placeholder='UUID (isteğe bağlı)'
                  />
                </>
              )}
              <Textarea
                defaultValue={comment?.content || ""}
                isRequired
                label='Yorum'
                name='content'
              />

              <Button
                color='primary'
                isLoading={isLoading}
                type='submit'
              >
                {comment ? "Güncelle" : "Oluştur"}
              </Button>
            </form>
          </CardBody>
        </Card>
      </div>

      <ConfirmModal
        {...confirmDeleteModal}
        message='Bu yorumu silmek istediğinize emin misiniz?'
        onConfirm={handleDelete}
      />
    </>
  );
}
