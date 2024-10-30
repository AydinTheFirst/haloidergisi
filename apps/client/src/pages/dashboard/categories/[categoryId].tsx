import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Input,
  Textarea,
} from "@nextui-org/react";
import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import useSWR from "swr";

import http from "@/http";
import { Category } from "@/types";

const ViewCategory = () => {
  const navigate = useNavigate();

  const { categoryId } = useParams<{ categoryId: string }>();
  const isNew = categoryId === "new";
  const { data: category, isLoading } = useSWR<Category>(
    isNew ? null : `/categories/${categoryId}`,
  );

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data: Record<string, unknown> = Object.fromEntries(
      formData.entries(),
    );

    try {
      await (isNew
        ? http.post("/categories", data)
        : http.patch(`/categories/${categoryId}`, data));

      toast.success(
        isNew
          ? "Category created successfully!"
          : "Category updated successfully!",
      );
      navigate("/dashboard/categories");
    } catch (error) {
      http.handleError(error);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this category?")) return;

    try {
      await http.delete(`/categories/${categoryId}`);
      toast.success("Category deleted successfully!");
      navigate("/dashboard/categories");
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
            {!category
              ? "Yeni Kategori Oluştur"
              : `Kategori Düzenle: ${category.title}`}
          </h3>
        </CardHeader>
        <CardBody>
          <form className="grid grid-cols-12 gap-3" onSubmit={handleSubmit}>
            <Input
              className="col-span-12"
              defaultValue={category ? category.title : ""}
              isRequired
              label="Başlık"
              name="title"
            />

            <Textarea
              className="col-span-12"
              defaultValue={category ? category.description : ""}
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
    </section>
  );
};

export default ViewCategory;
