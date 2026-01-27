import { Card, Field, Button, Form } from "@adn-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Crew } from "@repo/db";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

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
      <Card.Root className='mx-auto'>
        <Card.Header>
          <Card.Title>Crew'u Düzenle</Card.Title>
        </Card.Header>
        <Card.Content>
          <Form
            form={form}
            onSubmit={onSubmit}
          >
            <Field.Root name='name'>
              <Field.Label>Crew Adı</Field.Label>
              <Field.Input type='text' />
              <Field.HelperText>Crew adı en az 1 en fazla 100 karakter olabilir.</Field.HelperText>
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
