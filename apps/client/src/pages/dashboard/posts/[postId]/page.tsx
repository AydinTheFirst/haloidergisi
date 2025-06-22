import type { Category } from "~/models/Category";
import type { Post } from "~/models/Post";
import type { PaginatedResponse } from "~/types";

import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Input,
  Link,
  Select,
  SelectItem,
  Textarea,
  useDisclosure
} from "@heroui/react";
import ConfirmModal from "~/components/confirm-modal";
import { handleError, http, uploadFiles } from "~/lib/http";
import React from "react";
import { useLoaderData, useNavigate } from "react-router";
import { toast } from "sonner";

import type { Route } from "./+types/page";

export const clientLoader = async ({ params }: Route.LoaderArgs) => {
  const { postId } = params;

  if (!postId) {
    throw new Error("Post ID is required");
  }

  const { data: categories } =
    await http.get<PaginatedResponse<Category>>("/categories");

  if (postId === "create") {
    return { categories, post: null };
  }

  const { data: post } = await http.get<Post>(`/posts/${postId}`);

  return { categories, post };
};

export default function ViewPost() {
  const { categories, post } = useLoaderData<typeof clientLoader>();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = React.useState(false);

  const confirmDeleteModal = useDisclosure();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const data: Record<string, unknown> = Object.fromEntries(
      formData.entries()
    );

    setIsLoading(true);

    try {
      const file = formData.get("file") as File;
      if (file) {
        const uploadedFiles = await uploadFiles([file]);
        data.file = uploadedFiles[0];
      }

      const cover = formData.get("cover") as File;
      if (cover) {
        const uploadedCover = await uploadFiles([cover]);
        data.cover = uploadedCover[0];
      }

      if (post) await http.patch(`/posts/${post.id}`, data);
      else await http.post("/posts", data);

      toast.success(
        post ? "Dergi başarıyla güncellendi." : "Dergi başarıyla oluşturuldu."
      );

      navigate("/dashboard/posts");
    } catch (error) {
      handleError(error);
    }

    setIsLoading(false);
  };

  const handleDelete = async () => {
    if (!post) return;

    try {
      await http.delete(`/posts/${post.id}`);
      toast.success("Dergi başarıyla silindi.");
      navigate("/dashboard/posts");
    } catch (error) {
      handleError(error);
    }
  };

  return (
    <>
      <div className='grid gap-3'>
        <div className='flex justify-end'>
          {post && (
            <Link
              color='foreground'
              href={`/posts/${post.id}`}
              isExternal
            >
              Dergiyi Görüntüle
            </Link>
          )}
        </div>
        <Card>
          <CardHeader className='justify-between'>
            <h2 className='text-xl font-bold'>
              {post ? post.title : "Yeni Dergi Oluştur"}
            </h2>
            {post && (
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
              <Input
                defaultValue={post?.title || ""}
                isRequired
                label='Başlık'
                name='title'
              />

              <Select
                defaultSelectedKeys={[post?.categoryId || ""]}
                isRequired
                items={categories.items}
                label='Kategori'
                name='categoryId'
              >
                {(item) => <SelectItem key={item.id}>{item.title}</SelectItem>}
              </Select>

              <Select
                defaultSelectedKeys={[post?.status || "DRAFT"]}
                items={[
                  { key: "DRAFT", label: "Taslak" },
                  { key: "PUBLISHED", label: "Yayınlandı" }
                ]}
                label='Durum'
                name='status'
              >
                {(item) => <SelectItem key={item.key}>{item.label}</SelectItem>}
              </Select>

              <Textarea
                defaultValue={post?.description || ""}
                isRequired
                label='Açıklama'
                name='description'
              />

              <Input
                accept='application/pdf'
                label='Dergi Dosyası'
                name='file'
                type='file'
              />

              <Input
                accept='image/*'
                label='Kapak Resmi'
                name='cover'
                type='file'
              />

              <Button
                color='primary'
                isLoading={isLoading}
                type='submit'
              >
                {post ? "Düzenle" : "Oluştur"}
              </Button>
            </form>
          </CardBody>
        </Card>
      </div>

      <ConfirmModal
        {...confirmDeleteModal}
        message='Bu dergiyi silmek istediğinize emin misiniz? Bu işlem geri alınamaz.'
        onConfirm={handleDelete}
      />
    </>
  );
}
