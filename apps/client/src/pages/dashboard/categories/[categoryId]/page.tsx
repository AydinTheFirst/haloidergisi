import type { Category } from "~/models/Category";

import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Input,
  Link,
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
  params: { categoryId?: string };
}) => {
  const { categoryId } = params;

  if (!categoryId || categoryId === "create") {
    return { category: null };
  }

  const { data: category } = await http.get<Category>(
    `/categories/${categoryId}`
  );

  return { category };
};

export default function ViewCategory() {
  const { category } = useLoaderData<typeof clientLoader>();
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
      if (category) {
        await http.patch(`/categories/${category.id}`, data);
        toast.success("Kategori başarıyla güncellendi.");
      } else {
        await http.post("/categories", data);
        toast.success("Kategori başarıyla oluşturuldu.");
      }
      navigate("/dashboard/categories");
    } catch (error) {
      handleError(error);
    }
    setIsLoading(false);
  };

  const handleDelete = async () => {
    if (!category) return;
    try {
      await http.delete(`/categories/${category.id}`);
      toast.success("Kategori başarıyla silindi.");
      navigate("/dashboard/categories");
    } catch (error) {
      handleError(error);
    }
  };

  return (
    <>
      <div className='grid gap-3'>
        <div className='flex justify-end'>
          {category && (
            <Link
              color='foreground'
              href={`/categories/${category.id}`}
              isExternal
            >
              Kategoriyi Görüntüle
            </Link>
          )}
        </div>

        <Card>
          <CardHeader className='justify-between'>
            <h2 className='text-xl font-bold'>
              {category ? category.title : "Yeni Kategori Oluştur"}
            </h2>
            {category && (
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
                defaultValue={category?.title || ""}
                isRequired
                label='Kategori Adı'
                name='title'
              />

              <Input
                defaultValue={category?.description || ""}
                label='Açıklama'
                name='description'
              />

              <Button
                color='primary'
                isLoading={isLoading}
                type='submit'
              >
                {category ? "Düzenle" : "Oluştur"}
              </Button>
            </form>
          </CardBody>
        </Card>
      </div>

      <ConfirmModal
        {...confirmDeleteModal}
        message='Bu kategoriyi silmek istediğinize emin misiniz? Bu işlem geri alınamaz.'
        onConfirm={handleDelete}
      />
    </>
  );
}
