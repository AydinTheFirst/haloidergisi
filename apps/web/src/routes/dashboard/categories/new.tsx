import { Button, Card, Field, Form } from "@adn-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import apiClient from "@/lib/api-client";
import { categoriesSchema, CategorySchema } from "@/schemas/category";

export const Route = createFileRoute("/dashboard/categories/new")({
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = useNavigate({ from: Route.id });

  const form = useForm({
    resolver: zodResolver(categoriesSchema),
    defaultValues: {
      name: "",
    },
  });

  const queryClient = useQueryClient();
  const createMutation = useMutation({
    mutationFn: async (data: CategorySchema) => {
      await apiClient.post("/categories", data);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast.success("Kategori başarıyla oluşturuldu.");
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
    createMutation.mutate(data);
  };

  return (
    <Card.Root className='mx-auto'>
      <Card.Header>
        <Card.Title>Yeni Kategori Oluştur</Card.Title>
      </Card.Header>
      <Card.Content>
        <section>
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
              disabled={createMutation.isPending}
            >
              {createMutation.isPending ? "Oluşturuluyor..." : "Oluştur"}
            </Button>
          </Form>
        </section>
      </Card.Content>
    </Card.Root>
  );
}
