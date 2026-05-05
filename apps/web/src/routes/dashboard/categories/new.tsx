import { zodResolver } from "@hookform/resolvers/zod";
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
    <Card className='mx-auto'>
      <CardHeader>
        <CardTitle>Yeni Kategori Oluştur</CardTitle>
      </CardHeader>
      <CardContent>
        <section>
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
                disabled={createMutation.isPending}
              >
                {createMutation.isPending ? "Oluşturuluyor..." : "Oluştur"}
              </Button>
            </form>
          </Form>
        </section>
      </CardContent>
    </Card>
  );
}
