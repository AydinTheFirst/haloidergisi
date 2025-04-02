import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Input,
  Textarea
} from "@heroui/react";
import { LucideTrash } from "lucide-react";
import { useNavigate, useParams } from "react-router";
import { toast } from "sonner";
import useSWR from "swr";

import http from "@/http";
import { News } from "@/types";

export default function CreateOrEditNews() {
  const navigate = useNavigate();

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

    try {
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

  if (isLoading) return "Loading...";

  return (
    <section className='grid gap-3'>
      <Card>
        <CardHeader className='flex flex-wrap justify-between'>
          <h2 className='text-lg font-semibold'>
            {isNew ? "Create News" : "Edit News"}
          </h2>
          <Button
            color='danger'
            isIconOnly
            onPress={handleDelete}
          >
            <LucideTrash />
          </Button>
        </CardHeader>
        <CardBody>
          <form
            className='grid gap-3'
            onSubmit={handleSubmit}
          >
            <Input
              defaultValue={news?.title}
              isRequired
              label='Title'
              name='title'
              type='text'
            />
            <Textarea
              defaultValue={news?.description}
              isRequired
              label='Description'
              name='description'
            />
            <Button
              color='primary'
              type='submit'
            >
              <strong>{isNew ? "Create" : "Update"} News</strong>
            </Button>
          </form>
        </CardBody>
      </Card>
    </section>
  );
}
