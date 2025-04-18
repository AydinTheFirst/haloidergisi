import {
  Accordion,
  AccordionItem,
  Button,
  Card,
  CardBody,
  CardHeader,
  DatePicker,
  Input,
  Textarea
} from "@heroui/react";
import { parseDate } from "@internationalized/date";
import { LucideTrash } from "lucide-react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import { toast } from "sonner";
import useSWR, { mutate } from "swr";

import type { News } from "@/types";

import FilesTable from "@/components/FilesTable";
import http from "@/http";
import { getFileUrl } from "@/utils";

export default function CreateOrEditNews() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { newsId } = useParams<{ newsId: string }>();
  const isNew = newsId === "new";

  const { data: news, isLoading } = useSWR<News>(
    isNew ? null : `/news/${newsId}`
  );

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data: Record<string, unknown> = Object.fromEntries(
      formData.entries()
    );

    setIsSubmitting(true);

    if (data.createdAt) {
      data.createdAt = new Date(data.createdAt as string).toISOString();
    }

    try {
      if (data.featuredImage) {
        const files = await http.uploadFiles([
          formData.get("featuredImage") as File
        ]);
        data.featuredImage = files[0];
      }

      if (data.files) {
        const files = await http.uploadFiles(
          formData.getAll("files") as File[]
        );
        data.files = files;
      }

      await (isNew
        ? http.post("/news", data)
        : http.patch(`/news/${newsId}`, data));

      toast.success(
        isNew ? "News created successfully!" : "News updated successfully!"
      );
      navigate("/dashboard/news");
    } catch (error) {
      http.handleError(error);
    }

    setIsSubmitting(false);
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this news?")) return;

    try {
      await http.delete(`/news/${newsId}`);
      toast.success("News deleted successfully!");
      navigate("/dashboard/news");
    } catch (error) {
      http.handleError(error);
    }
  };

  const handleFileDelete = async (file: string) => {
    if (!news) return;
    if (!confirm("Are you sure you want to delete this file?")) return;

    try {
      await http.delete(`/files/${file}`);
      const files = news.files.filter((f) => f !== file);
      await http.patch(`/news/${newsId}`, { files });
      toast.success("File deleted successfully!");
      mutate(`/news/${newsId}`);
    } catch (error) {
      http.handleError(error);
    }
  };

  if (isLoading) return "Loading...";

  return (
    <section className='grid gap-3'>
      <Card>
        <CardHeader className='flex flex-wrap justify-between'>
          <h2 className='text-lg font-semibold'>
            {isNew ? "Create News" : "Edit News"}
          </h2>
          <div className='flex gap-2'>
            {news && (
              <Button
                color='secondary'
                onPress={() => navigate(`/news/${news.slug}`)}
              >
                <strong>View News</strong>
              </Button>
            )}
            <Button
              color='danger'
              isIconOnly
              onPress={handleDelete}
            >
              <LucideTrash />
            </Button>
          </div>
        </CardHeader>
        <CardBody>
          <form
            className='grid gap-3'
            onSubmit={handleSubmit}
          >
            <Input
              defaultValue={news?.title}
              isRequired
              label='Başlık'
              name='title'
              type='text'
            />

            <Textarea
              defaultValue={news?.description}
              isRequired
              label='Açıklama'
              name='description'
            />

            {isNew && (
              <Input
                isRequired
                label='Dosyalar'
                multiple
                name='files'
                type='file'
              />
            )}

            <Accordion>
              <AccordionItem
                key='featuredImage'
                title='Kapak Resmi'
              >
                {news && (
                  <FilesTable
                    files={[news.featuredImage]}
                    onFileClick={(file) =>
                      window.open(getFileUrl(file), "_blank")
                    }
                  />
                )}
                <br />
                <Input
                  accept='image/*'
                  isRequired={isNew}
                  label='Kapak Resmi'
                  name='featuredImage'
                  type='file'
                />
              </AccordionItem>
              <AccordionItem
                key='files'
                title='Dosyalar'
              >
                {news && (
                  <FilesTable
                    files={news.files}
                    onFileClick={(file) =>
                      window.open(getFileUrl(file), "_blank")
                    }
                    onFileDelete={handleFileDelete}
                  />
                )}
                <br />
                <Input
                  accept='image/*'
                  isRequired={isNew}
                  label='Dosyalar'
                  multiple
                  name='files'
                  type='file'
                />
              </AccordionItem>
            </Accordion>

            {news && (
              <DatePicker
                defaultValue={parseDate(
                  news.createdAt.toString().split("T")[0]
                )}
                isRequired
                label='Yayın Tarihi'
                name='createdAt'
              />
            )}
            <Button
              color='primary'
              isLoading={isSubmitting}
              type='submit'
            >
              <strong>{isNew ? "Haber Oluştur" : "Haber Güncelle"}</strong>
            </Button>
          </form>
        </CardBody>
      </Card>
    </section>
  );
}
