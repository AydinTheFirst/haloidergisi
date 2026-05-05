import { zodResolver } from "@hookform/resolvers/zod";
import { Category, Post } from "@repo/db";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import CdnImage from "@/components/cdn-image";
import { FieldFileInput } from "@/components/file-input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
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

const PostStatus = {
  DRAFT: "Taslak",
  PUBLISHED: "Yayınlandı",
  ARCHIVED: "Arşivlendi",
};

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
      categoryId: post.categoryId ?? "",
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
      <Card className='mx-auto'>
        <CardHeader>
          <CardTitle>Post'u Düzenle</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className='space-y-4'
            >
              <FormField
                control={form.control}
                name='title'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Başlık</FormLabel>
                    <FormControl>
                      <Input
                        type='text'
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Post başlığı en az 1 en fazla 200 karakter olabilir.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='content'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>İçerik</FormLabel>
                    <FormControl>
                      <Textarea
                        rows={10}
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>Post içeriği en az 1 karakter olmalıdır.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='status'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Durum</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value || "DRAFT"}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.entries(PostStatus).map(([value, label]) => (
                          <SelectItem
                            key={value}
                            value={value}
                          >
                            {label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>Post durumu seçiniz.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='categoryId'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Kategori</FormLabel>
                    <Select
                      onValueChange={(val) => field.onChange(val === "__none__" ? undefined : val)}
                      value={field.value ?? "__none__"}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value='__none__'>Kategori seçiniz</SelectItem>
                        {categories.items.map((category) => (
                          <SelectItem
                            key={category.id}
                            value={category.id}
                          >
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>Post için bir kategori seçin.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='coverImage'
                render={({ field }) => (
                  <FormItem>
                    <div className='flex items-end justify-between'>
                      <FormLabel>Kapak Resmi</FormLabel>
                      <CdnImage
                        src={getCdnUrl(field.value as string)}
                        alt='Cover Image'
                        className='size-20'
                      />
                    </div>
                    <FormControl>
                      <FieldFileInput
                        name='coverImage'
                        accept='image/*'
                      />
                    </FormControl>
                    <FormDescription>Post için bir kapak resmi yükleyin.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='attachment'
                render={({ field }) => (
                  <FormItem>
                    <div className='flex justify-between'>
                      <FormLabel>Ek Dosya</FormLabel>
                      {field.value && (
                        <Link to={getCdnUrl(field.value as string)}>Dosyayı Görüntüle</Link>
                      )}
                    </div>
                    <FormControl>
                      <FieldFileInput
                        name='attachment'
                        accept='application/pdf'
                      />
                    </FormControl>
                    <FormDescription>Derginin PDF dosyasını yükleyin.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type='submit'
                disabled={form.formState.isSubmitting}
              >
                Güncelle
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </section>
  );
}
