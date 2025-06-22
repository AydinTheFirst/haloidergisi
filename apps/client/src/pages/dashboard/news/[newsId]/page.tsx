import type { News } from "~/models/News";

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
import { handleError, http, uploadFiles } from "~/lib/http";
import React from "react";
import { useLoaderData, useNavigate } from "react-router";
import { toast } from "sonner";

import type { Route } from "./+types/page";

export const clientLoader = async ({ params }: Route.LoaderArgs) => {
  const { newsId } = params;

  if (!newsId) {
    throw new Error("Post ID is required");
  }

  if (newsId === "create") {
    return { news: null };
  }

  const { data: news } = await http.get<News>(`/news/${newsId}`);

  return { news };
};

export default function Viewnews() {
  const { news } = useLoaderData<typeof clientLoader>();
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
      const files = formData.getAll("files") as File[];
      if (files) {
        const uploadedFiles = await uploadFiles(files);
        data.files = uploadedFiles;
      }

      const featuredImage = formData.get("featuredImage") as File;
      if (featuredImage) {
        const uploadedFeaturedImage = await uploadFiles([featuredImage]);
        data.featuredImage = uploadedFeaturedImage[0];
      }

      if (news) await http.patch(`/news/${news.id}`, data);
      else await http.post("/news", data);

      toast.success(
        news ? "Haberi başarıyla güncellendi." : "Haberi başarıyla oluşturuldu."
      );

      navigate("/dashboard/news");
    } catch (error) {
      handleError(error);
    }

    setIsLoading(false);
  };

  const handleDelete = async () => {
    if (!news) return;

    try {
      await http.delete(`/news/${news.id}`);
      toast.success("Haber başarıyla silindi.");
      navigate("/dashboard/news");
    } catch (error) {
      handleError(error);
    }
  };

  return (
    <>
      <div className='grid gap-3'>
        <div className='flex justify-end'>
          {news && (
            <Link
              color='foreground'
              href={`/news/${news.id}`}
              isExternal
            >
              Haberi Görüntüle
            </Link>
          )}
        </div>
        <Card>
          <CardHeader className='justify-between'>
            <h2 className='text-xl font-bold'>
              {news ? news.title : "Yeni Haber Oluştur"}
            </h2>
            {news && (
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
                defaultValue={news?.title || ""}
                isRequired
                label='Başlık'
                name='title'
              />

              <Textarea
                defaultValue={news?.description || ""}
                isRequired
                label='Açıklama'
                name='description'
              />

              <Input
                label='Dosyalar'
                multiple
                name='files'
                type='file'
              />

              <Input
                accept='image/*'
                label='Öne Çıkan Görsel'
                name='featuredImage'
                type='file'
              />

              <Button
                color='primary'
                isLoading={isLoading}
                type='submit'
              >
                {news ? "Düzenle" : "Oluştur"}
              </Button>
            </form>
          </CardBody>
        </Card>
      </div>

      <ConfirmModal
        {...confirmDeleteModal}
        message='Bu haberi silmek istediğinize emin misiniz? Bu işlem geri alınamaz.'
        onConfirm={handleDelete}
      />
    </>
  );
}
