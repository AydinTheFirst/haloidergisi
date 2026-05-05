import { zodResolver } from "@hookform/resolvers/zod";
import { Crew } from "@repo/db";
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
import { crewSchema, CrewSchema } from "@/schemas/crew";

export const Route = createFileRoute("/dashboard/crews/$crewId")({
  component: RouteComponent,
  loader: async ({ params }) => {
    const { data } = await apiClient.get<Crew>(`/crews/${params.crewId}`);
    return data;
  },
});

function RouteComponent() {
  const crew = Route.useLoaderData();
  const navigate = useNavigate({ from: Route.id });

  const form = useForm<CrewSchema>({
    resolver: zodResolver(crewSchema),
    defaultValues: {
      name: crew.name,
    },
  });

  const onSubmit = async (data: CrewSchema) => {
    try {
      await apiClient.patch(`/crews/${crew.id}`, data);
      toast.success("Crew başarıyla güncellendi.");
      void navigate({ to: "/dashboard/crews" });
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
          <CardTitle>Crew'u Düzenle</CardTitle>
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
                    <FormLabel>Crew Adı</FormLabel>
                    <FormControl>
                      <Input
                        type='text'
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Crew adı en az 1 en fazla 100 karakter olabilir.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type='submit'
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting ? "Güncelleniyor..." : "Güncelle"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </section>
  );
}
