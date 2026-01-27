import { Button, Card, Field, Form } from "@adn-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import apiClient from "@/lib/api-client";
import { crewSchema, CrewSchema } from "@/schemas/crew";

export const Route = createFileRoute("/dashboard/crews/new")({
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = useNavigate({ from: Route.id });

  const form = useForm({
    resolver: zodResolver(crewSchema),
    defaultValues: {
      name: "",
    },
  });

  const onSubmit = async (data: CrewSchema) => {
    try {
      await apiClient.post("/crews", data);
      void navigate({ to: "/dashboard/crews" });
      toast.success("Crew başarıyla oluşturuldu.");
    } catch (error) {
      const resolved = apiClient.resolveApiError(error);
      toast.error(resolved.message, {
        description: resolved.error,
      });
    }
  };

  return (
    <Card.Root className='mx-auto'>
      <Card.Header>
        <Card.Title>Yeni Crew Oluştur</Card.Title>
      </Card.Header>
      <Card.Content>
        <section>
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
              Oluştur
            </Button>
          </Form>
        </section>
      </Card.Content>
    </Card.Root>
  );
}
