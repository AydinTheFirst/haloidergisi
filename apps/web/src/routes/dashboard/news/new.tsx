import { zodResolver } from "@hookform/resolvers/zod";
import { Icon } from "@iconify/react";
import { useMutation } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import apiClient from "@/lib/api-client";

const newsFormSchema = z.object({
  title: z.string().min(3, "Başlık en az 3 karakter olmalıdır."),
  content: z.string().min(10, "İçerik en az 10 karakter olmalıdır."),
  keywords: z.string(),
  isPublished: z.boolean(),
});

type NewsFormValues = z.infer<typeof newsFormSchema>;

export const Route = createFileRoute("/dashboard/news/new")({
  component: AdminCreateNewsPage,
});

function AdminCreateNewsPage() {
  const navigate = useNavigate();

  const form = useForm<NewsFormValues>({
    resolver: zodResolver(newsFormSchema),
    defaultValues: {
      title: "",
      content: "",
      keywords: "",
      isPublished: false,
    },
  });

  const mutation = useMutation({
    mutationFn: async (values: NewsFormValues) => {
      await apiClient.post("/news", values);
    },
    onSuccess: () => {
      toast.success("Haber başarıyla oluşturuldu.");
      void navigate({ to: "/dashboard/news" });
    },
    onError: (error) => toast.error(apiClient.resolveApiError(error).message),
  });

  return (
    <div className='max-w-4xl space-y-6'>
      <div className='flex items-center gap-4'>
        <Button
          variant='ghost'
          size='sm'
          onClick={() => window.history.back()}
        >
          <Icon
            icon='mdi:arrow-left'
            className='h-4 w-4'
          />
        </Button>
        <h2 className='text-2xl font-bold'>Yeni Haber Ekle</h2>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit((v) => mutation.mutate(v))}
          className='space-y-6'
        >
          <Card>
            <CardHeader>
              <CardTitle>Genel Bilgiler</CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              <FormField
                control={form.control}
                name='title'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Haber Başlığı</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Örn: HALO Ekim Sayısı Çıktı!'
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Slug otomatik olarak başlıktan oluşturulacaktır.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='keywords'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Anahtar Kelimeler</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='haber, güncelleme, edebiyat'
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>Virgül ile ayırarak giriniz.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='content'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>İçerik (Markdown)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder='Haber metni...'
                        className='min-h-[400px]'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='isPublished'
                render={({ field }) => (
                  <FormItem className='flex flex-row items-start space-y-0 space-x-3 rounded-md border p-4'>
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className='space-y-1 leading-none'>
                      <FormLabel>Hemen Yayınla</FormLabel>
                      <FormDescription>Seçili ise haber hemen yayına alınacaktır.</FormDescription>
                    </div>
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <div className='flex justify-end gap-3'>
            <Button
              type='button'
              variant='ghost'
              onClick={() => navigate({ to: "/dashboard/news" })}
            >
              İptal
            </Button>
            <Button
              type='submit'
              disabled={mutation.isPending}
            >
              {mutation.isPending ? "Kaydediliyor..." : "Haberi Kaydet"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
