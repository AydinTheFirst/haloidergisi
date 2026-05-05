import { zodResolver } from "@hookform/resolvers/zod";
import { Category } from "@repo/db";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

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
import apiClient from "@/lib/api-client";
import { categoriesSchema, CategorySchema } from "@/schemas/category";

export const Route = createFileRoute("/dashboard/categories/$categoryId")({
  component: RouteComponent,
  loader: async ({ params }) => {
    const { data } = await apiClient.get<Category>(`/categories/${params.categoryId}`);
    return data;
  },
});

function RouteComponent() {
  const category = Route.useLoaderData();
  const navigate = useNavigate({ from: Route.id });

  const form = useForm<CategorySchema>({
    resolver: zodResolver(categoriesSchema),
    defaultValues: {
      name: category.name,
    },
  });

  const queryClient = useQueryClient();
  const updateMutation = useMutation({
    mutationFn: async (data: CategorySchema) => {
      await apiClient.patch(`/categories/${category.id}`, data);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast.success("Kategori başarıyla güncellendi.");
      void navigate({ to: "/dashboard/categories" });
    },
    onError: (error) => {
      const resolved = apiClient.resolveApiError(error);
      toast.error(resolved.message, {
        description: resolved.error,
      });
    },
  });

  const onSubmit = (data: CategorySchema) => {
    updateMutation.mutate(data);
  };

  return (
    <section>
      <Card className='mx-auto'>
        <CardHeader>
          <CardTitle>Kategoriyi Düzenle</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className='space-y-4'
            >
              <FormField
                control={form.control}
                name='name'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Kategori Adı</FormLabel>
                    <FormControl>
                      <Input
                        type='text'
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Kategori adı en az 1 en fazla 100 karakter olabilir.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type='submit'
                disabled={updateMutation.isPending}
              >
                {updateMutation.isPending ? "Güncelleniyor..." : "Güncelle"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </section>
  );
}
