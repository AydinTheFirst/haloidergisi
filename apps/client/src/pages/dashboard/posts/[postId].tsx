import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Image,
  Input,
  Link,
  Progress,
  Select,
  SelectItem,
  Textarea,
} from "@nextui-org/react";
import { AxiosProgressEvent } from "axios";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import useSWR, { mutate } from "swr";

import http from "@/http";
import { Category, Post } from "@/types";
import { getFileUrl } from "@/utils";

const ViewPost = () => {
  const navigate = useNavigate();

  const { postId } = useParams<{ postId: string }>();
  const isNew = postId === "new";
  const { data: post, isLoading } = useSWR<Post>(
    isNew ? null : `/posts/${postId}`,
  );
  const { data: categories } = useSWR<Category[]>("/categories");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data: Record<string, unknown> = Object.fromEntries(
      formData.entries(),
    );

    try {
      await (isNew
        ? http.post("/posts", data)
        : http.patch(`/posts/${postId}`, data));

      toast.success(
        isNew ? "Post created successfully!" : "Post updated successfully!",
      );
      navigate("/dashboard/posts");
    } catch (error) {
      http.handleError(error);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this post?")) return;

    try {
      await http.delete(`/posts/${postId}`);
      toast.success("Post deleted successfully!");
      navigate("/dashboard/posts");
    } catch (error) {
      http.handleError(error);
    }
  };

  if (isLoading) return "Loading...";

  return (
    <section className="grid gap-5">
      <Card>
        <CardHeader>
          <h3 className="text-2xl font-semibold">
            {!post ? "Yeni Dergi Oluştur" : `Dergiyi Düzenle: ${post.title}`}
          </h3>
        </CardHeader>
        <CardBody>
          <form className="grid grid-cols-12 gap-3" onSubmit={handleSubmit}>
            <Input
              className="col-span-12"
              defaultValue={post ? post.title : ""}
              isRequired
              label="Başlık"
              name="title"
            />

            <Select
              className="col-span-12"
              defaultSelectedKeys={[post ? post.categoryId : ""]}
              label="Kategori"
              name="categoryId"
            >
              {categories ? (
                categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.title}
                  </SelectItem>
                ))
              ) : (
                <SelectItem key={""} value="loading">
                  Yükleniyor...
                </SelectItem>
              )}
            </Select>

            <Select
              className="col-span-12"
              defaultSelectedKeys={[post ? post.status : ""]}
              label="Durum"
              name="status"
            >
              <SelectItem key="DRAFT" value="draft">
                Taslak
              </SelectItem>
              <SelectItem key="PUBLISHED" value="published">
                Yayınlandı
              </SelectItem>
            </Select>

            <Textarea
              className="col-span-12"
              defaultValue={post ? post.description : ""}
              label="Açıklama"
              name="description"
            />

            <Button
              className="col-span-12"
              color="primary"
              fullWidth
              type="submit"
            >
              {isNew ? "Oluştur" : "Güncelle"}
            </Button>
          </form>
          {!isNew && (
            <div className="mt-3 flex justify-end">
              <Button color="danger" onClick={handleDelete}>
                Sil
              </Button>
            </div>
          )}
        </CardBody>
      </Card>

      {post && <EditCover post={post} />}
      {post && <EditFile post={post} />}
    </section>
  );
};

export default ViewPost;

interface EditCoverProps {
  post: Post;
}

const EditCover = ({ post }: EditCoverProps) => {
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    try {
      await http.patch(`/posts/${post.id}/cover`, formData);
      toast.success("Cover updated successfully!");
      mutate(`/posts/${post.id}`);
    } catch (error) {
      http.handleError(error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <h3 className="text-2xl font-semibold">Kapak Düzenle</h3>
      </CardHeader>
      <CardBody className="grid grid-cols-12 gap-3">
        <div className="col-span-12 md:col-span-8">
          <form className="grid grid-cols-12 gap-3" onSubmit={handleSubmit}>
            <Input
              accept="image/*"
              className="col-span-12"
              isRequired
              label="Kapak Resmi"
              name="cover"
              type="file"
            />

            <Button
              className="col-span-12"
              color="primary"
              fullWidth
              type="submit"
            >
              Güncelle
            </Button>
          </form>
        </div>
        <div className="col-span-12 grid place-items-center md:col-span-4">
          {post.cover && (
            <>
              <Image
                alt="Cover"
                className="h-52 w-full object-cover"
                src={getFileUrl(post.cover)}
              />
              <Button
                as={Link}
                className="mt-3"
                color="primary"
                href={getFileUrl(post.cover)}
                isExternal
              >
                Görüntüle
              </Button>
            </>
          )}
        </div>
      </CardBody>
      <CardFooter></CardFooter>
    </Card>
  );
};

interface EditFileProps {
  post: Post;
}

const EditFile = ({ post }: EditFileProps) => {
  const [uploadProgress, setUploadProgress] = useState<AxiosProgressEvent>();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    try {
      await http.patch(`/posts/${post.id}/file`, formData, {
        onUploadProgress: setUploadProgress,
      });
      toast.success("File updated successfully!");
      mutate(`/posts/${post.id}`);
    } catch (error) {
      http.handleError(error);
    }

    setUploadProgress(undefined);
  };

  if (uploadProgress) {
    const percent = Math.round(
      (uploadProgress.loaded / uploadProgress.total!) * 100,
    );

    return (
      <Card>
        <CardHeader>
          <h3 className="text-2xl font-semibold">Dosya Yükleniyor...</h3>
        </CardHeader>
        <CardBody>
          <div className="grid grid-cols-12 gap-3">
            <Progress
              className="col-span-12"
              color="primary"
              showValueLabel
              value={percent}
            />
          </div>
        </CardBody>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <h3 className="text-2xl font-semibold">File Edit</h3>
      </CardHeader>
      <CardBody>
        <form className="grid grid-cols-12 gap-3" onSubmit={handleSubmit}>
          <Input
            accept="application/pdf"
            className="col-span-12"
            isRequired
            label="File"
            name="file"
            type="file"
          />

          <Button
            className="col-span-12"
            color="primary"
            fullWidth
            type="submit"
          >
            Update
          </Button>
        </form>
      </CardBody>
      <CardFooter>
        {post.file && (
          <Button as={Link} href={getFileUrl(post.file)} isExternal={true}>
            Görüntüle
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};
