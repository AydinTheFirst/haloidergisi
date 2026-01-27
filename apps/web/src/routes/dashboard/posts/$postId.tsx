import { Card, Field, Button, Form } from "@adn-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Category, Post } from "@repo/db";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { FieldFileInput } from "@/components/file-input";
import apiClient from "@/lib/api-client";
import { postSchema, PostSchema } from "@/schemas/post";
import { List } from "@/types";
import { getCdnUrl } from "@/utils/cdn";

export const Route = createFileRoute("/dashboard/posts/$postId")({
  component: RouteComponent,
  loader: async ({ params }) => {
    const { data: post } = await apiClient.get<Post>(`/posts/${params.postId}`);
    const { data: categories } = await apiClient.get<List<Category>>(`/categories`);
    return { post, categories };
  },
});

function RouteComponent() {
  const { post, categories } = Route.useLoaderData();
  const navigate = useNavigate({ from: Route.id });

  const form = useForm<PostSchema>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      title: post.title,
      content: post.content ?? "",
      attachment: post.attachment ?? "",
      coverImage: post.coverImage ?? "",
      status: post.status,
    },
  });

  const onSubmit = async (data: PostSchema) => {
    try {
      await apiClient.patch(`/posts/${post.id}`, data);
      toast.success("Post başarıyla güncellendi.");
      void navigate({ to: "/dashboard/posts" });
    } catch (error) {
      const resolved = apiClient.resolveApiError(error);
      toast.error(resolved.message, {
        description: resolved.error,
      });
    }
  };

  return (
    <section>
      <Card.Root className='mx-auto'>
        <Card.Header>
          <Card.Title>Post'u Düzenle</Card.Title>
        </Card.Header>
        <Card.Content>
          <Form
            form={form}
            onSubmit={onSubmit}
          >
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
              <div className='flex justify-between'>
                <Field.Label>Kapak Resmi</Field.Label>

                <Link
                  to={getCdnUrl(post.coverImage as string)}
                  target='_blank'
                  className='underline'
                >
                  Resim Önizleme
                </Link>
              </div>
              <FieldFileInput accept='image/*' />
              <Field.HelperText>Post için bir kapak resmi yükleyin.</Field.HelperText>
              <Field.ErrorMessage />
            </Field.Root>

            <Field.Root name='attachment'>
              <div className='flex justify-between'>
                <Field.Label>Ek Dosya</Field.Label>

                <Link
                  to={getCdnUrl(post.attachment as string)}
                  target='_blank'
                  className='underline'
                >
                  PDF Önizleme
                </Link>
              </div>
              <FieldFileInput accept='application/pdf' />
              <Field.HelperText>Derginin PDF dosyasını yükleyin .</Field.HelperText>
              <Field.ErrorMessage />
            </Field.Root>

            <Button
              type='submit'
              disabled={form.formState.isSubmitting}
            >
              Güncelle
            </Button>
          </Form>
        </Card.Content>
      </Card.Root>
    </section>
  );
}
