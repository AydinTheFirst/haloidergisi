import { zodResolver } from "@hookform/resolvers/zod";
import { Icon } from "@iconify/react";
import { Category } from "@repo/db";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useFieldArray, useForm } from "react-hook-form";
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
      themes: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "themes",
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
    <Card className='mx-auto'>
      <CardHeader>
        <CardTitle>Yeni Post Oluştur</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className='space-y-4'
          >
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
              name='categoryId'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Kategori ID</FormLabel>
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
                  <FormDescription>Geçerli bir kategori ID'si giriniz.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='themes'
              render={() => (
                <FormItem>
                  <FormLabel>Tematik Arşiv (Eserler)</FormLabel>
                  <div className='space-y-4 rounded-md border p-4'>
                    {fields.map((field, index) => (
                      <div
                        key={field.id}
                        className='relative grid grid-cols-1 gap-4 rounded-lg border p-4 md:grid-cols-2'
                      >
                        <FormField
                          control={form.control}
                          name={`themes.${index}.category`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Konu (Tür)</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder='Örn: Kitap'
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name={`themes.${index}.work`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Başlık (Eser)</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder='Örn: Issız Adam'
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <Button
                          type='button'
                          variant='ghost'
                          size='icon'
                          className='text-destructive absolute -top-2 -right-2'
                          onClick={() => remove(index)}
                        >
                          <Icon icon='mdi:close-circle' />
                        </Button>
                      </div>
                    ))}
                    <Button
                      type='button'
                      variant='outline'
                      size='sm'
                      onClick={() => append({ work: "", category: "" })}
                    >
                      <Icon
                        icon='mdi:plus'
                        className='mr-2'
                      />
                      Eser Ekle
                    </Button>
                  </div>
                  <FormDescription>Bu yazıda işlenen eserleri ekleyin.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='coverImage'
              render={({ field }) => (
                <FormItem>
                  <div className='flex justify-between'>
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
              Oluştur
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
