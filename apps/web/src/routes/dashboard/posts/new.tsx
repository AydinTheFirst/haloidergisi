import { Button, Card, Field, Form } from "@adn-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Category } from "@repo/db";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { FieldFileInput } from "@/components/file-input";
import apiClient from "@/lib/api-client";
import { postSchema, PostSchema } from "@/schemas/post";
import { List } from "@/types";

export const Route = createFileRoute("/dashboard/posts/new")({
  component: RouteComponent,
  loader: async () => {
    const { data: categories } = await apiClient.get<List<Category>>(`/categories`);
    return { categories };
  },
});
const PostStatus = {
  DRAFT: "Taslak",
  PUBLISHED: "Yayınlandı",
  ARCHIVED: "Arşivlendi",
};

function RouteComponent() {
  const navigate = useNavigate({ from: Route.id });
  const { categories } = Route.useLoaderData();

  const form = useForm<PostSchema>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      status: "DRAFT",
    },
  });

  const onSubmit = async (data: PostSchema) => {
    try {
      await apiClient.post("/posts", data);
      void navigate({ to: "/dashboard/posts" });
      toast.success("Post başarıyla oluşturuldu.");
    } catch (error) {
      const resolved = apiClient.resolveApiError(error);
      toast.error(resolved.message, {
        description: resolved.error,
      });
    }
  };

  return (
    <Card.Root className='mx-auto'>
      <Card.Header>
        <Card.Title>Yeni Post Oluştur</Card.Title>
      </Card.Header>
      <Card.Content>
        <section>
          <Form
            form={form}
            onSubmit={onSubmit}
          >
            <Field.Root name='status'>
              <Field.Label>Durum</Field.Label>
              <Field.Select>
                {Object.entries(PostStatus).map(([value, label]) => (
                  <option
                    key={value}
                    value={value}
                  >
                    {label}
                  </option>
                ))}
              </Field.Select>
              <Field.HelperText>Post durumu seçiniz.</Field.HelperText>
              <Field.ErrorMessage />
            </Field.Root>

            <Field.Root name='title'>
              <Field.Label>Başlık</Field.Label>
              <Field.Input type='text' />
              <Field.HelperText>
                Post başlığı en az 1 en fazla 200 karakter olabilir.
              </Field.HelperText>
              <Field.ErrorMessage />
            </Field.Root>

            <Field.Root name='content'>
              <Field.Label>İçerik</Field.Label>
              <Field.TextArea rows={10} />
              <Field.HelperText>Post içeriği en az 1 karakter olmalıdır.</Field.HelperText>
              <Field.ErrorMessage />
            </Field.Root>

            <Field.Root name='categoryId'>
              <Field.Label>Kategori ID</Field.Label>
              <Field.Select>
                <option value=''>Kategori seçiniz</option>
                {categories.items.map((category) => (
                  <option
                    key={category.id}
                    value={category.id}
                  >
                    {category.name}
                  </option>
                ))}
              </Field.Select>
              <Field.HelperText>Geçerli bir kategori ID'si giriniz.</Field.HelperText>
              <Field.ErrorMessage />
            </Field.Root>

            <Field.Root name='coverImage'>
              <Field.Label>Kapak Resmi</Field.Label>
              <FieldFileInput accept='image/*' />
              <Field.HelperText>Post için bir kapak resmi yükleyin.</Field.HelperText>
              <Field.ErrorMessage />
            </Field.Root>

            <Field.Root name='attachment'>
              <Field.Label>Ek Dosya</Field.Label>
              <FieldFileInput accept='application/pdf' />
              <Field.HelperText>Derginin PDF dosyasını yükleyin .</Field.HelperText>
              <Field.ErrorMessage />
            </Field.Root>

            <Button
              type='submit'
              disabled={form.formState.isSubmitting}
            >
              Oluştur
            </Button>
          </Form>
        </section>
      </Card.Content>
    </Card.Root>
  );
}
