import { Card, Field, Button, Form } from "@adn-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Category } from "@repo/db";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

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
      <Card.Root className='mx-auto'>
        <Card.Header>
          <Card.Title>Kategoriyi Düzenle</Card.Title>
        </Card.Header>
        <Card.Content>
          <Form
            form={form}
            onSubmit={onSubmit}
          >
            <Field.Root name='name'>
              <Field.Label>Kategori Adı</Field.Label>
              <Field.Input type='text' />
              <Field.HelperText>
                Kategori adı en az 1 en fazla 100 karakter olabilir.
              </Field.HelperText>
              <Field.ErrorMessage />
            </Field.Root>

            <Button
              type='submit'
              disabled={updateMutation.isPending}
            >
              {updateMutation.isPending ? "Güncelleniyor..." : "Güncelle"}
            </Button>
          </Form>
        </Card.Content>
      </Card.Root>
    </section>
  );
}
