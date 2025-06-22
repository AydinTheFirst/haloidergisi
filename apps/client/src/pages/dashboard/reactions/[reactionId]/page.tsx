import type { Reaction } from "~/models/Reaction";

import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Input,
  Link,
  Select,
  SelectItem,
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
  params: { reactionId?: string };
}) => {
  const { reactionId } = params;

  if (!reactionId || reactionId === "create") {
    return { reaction: null };
  }

  const { data: reaction } = await http.get<Reaction>(
    `/admin/reactions/${reactionId}?include=user,post`
  );
  return { reaction };
};

export default function ViewReaction() {
  const { reaction } = useLoaderData<typeof clientLoader>();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = React.useState(false);
  const confirmDeleteModal = useDisclosure();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const data = Object.fromEntries(formData.entries());

    setIsLoading(true);
    try {
      if (reaction) {
        await http.patch(`/admin/reactions/${reaction.id}`, data);
        toast.success("Reaksiyon güncellendi.");
      } else {
        await http.post("/admin/reactions", data);
        toast.success("Reaksiyon oluşturuldu.");
      }

      navigate("/dashboard/reactions");
    } catch (error) {
      handleError(error);
    }
    setIsLoading(false);
  };

  const handleDelete = async () => {
    if (!reaction) return;
    try {
      await http.delete(`/admin/reactions/${reaction.id}`);
      toast.success("Reaksiyon silindi.");
      navigate("/dashboard/reactions");
    } catch (error) {
      handleError(error);
    }
  };

  return (
    <>
      <div className='grid gap-3'>
        {reaction && (
          <div className='text-muted flex items-center justify-between text-sm'>
            <span>Kullanıcı: {reaction.user?.profile?.displayName}</span>
            <Link
              color='foreground'
              href={`/posts/${reaction.post?.id}`}
              isExternal
            >
              Gönderiye Git
            </Link>
          </div>
        )}

        <Card>
          <CardHeader className='justify-between'>
            <h2 className='text-xl font-bold'>
              {reaction ? "Reaksiyonu Güncelle" : "Yeni Reaksiyon"}
            </h2>
            {reaction && (
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
              {!reaction && (
                <>
                  <Input
                    isRequired
                    label='Post ID'
                    name='postId'
                    placeholder='UUID'
                  />
                  <Input
                    isRequired
                    label='Kullanıcı ID'
                    name='userId'
                    placeholder='UUID'
                  />
                </>
              )}
              <Select
                defaultSelectedKeys={[reaction?.type || "LIKE"]}
                isRequired
                items={[
                  { key: "LIKE", label: "Like" },
                  { key: "DISLIKE", label: "Dislike" }
                ]}
                label='Tepki Türü'
                name='type'
              >
                {(item) => <SelectItem key={item.key}>{item.label}</SelectItem>}
              </Select>

              <Button
                color='primary'
                isLoading={isLoading}
                type='submit'
              >
                {reaction ? "Güncelle" : "Oluştur"}
              </Button>
            </form>
          </CardBody>
        </Card>
      </div>

      <ConfirmModal
        {...confirmDeleteModal}
        message='Bu reaksiyonu silmek istediğinize emin misiniz?'
        onConfirm={handleDelete}
      />
    </>
  );
}
