import { Card, Field, Button, Form } from "@adn-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Message } from "@repo/db";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import apiClient from "@/lib/api-client";
import { messageSchema, MessageSchema } from "@/schemas/message";

export const Route = createFileRoute("/dashboard/messages/$messageId")({
  component: RouteComponent,
  loader: async ({ params }) => {
    const { data: message } = await apiClient.get<Message>(`/messages/${params.messageId}`);
    return { message };
  },
});

function RouteComponent() {
  const { message } = Route.useLoaderData();
  const navigate = useNavigate({ from: Route.id });

  const form = useForm<MessageSchema>({
    resolver: zodResolver(messageSchema),
    defaultValues: {
      name: message.name,
      email: message.email,
      subject: message.subject,
      content: message.content,
    },
  });

  const onSubmit = async (data: MessageSchema) => {
    try {
      await apiClient.patch(`/messages/${message.id}`, data);
      toast.success("Mesaj başarıyla güncellendi.");
      void navigate({ to: "/dashboard/messages" });
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
          <Card.Title>Mesajı Düzenle</Card.Title>
        </Card.Header>
        <Card.Content>
          <Form
            form={form}
            onSubmit={onSubmit}
          >
            <Field.Root name='name'>
              <Field.Label>Gönderen</Field.Label>
              <Field.Input type='text' />
              <Field.HelperText>Mesaj adı en az 1 en fazla 100 karakter olabilir.</Field.HelperText>
              <Field.ErrorMessage />
            </Field.Root>

            <Field.Root name='email'>
              <Field.Label>E-postası</Field.Label>
              <Field.Input type='email' />
              <Field.HelperText>Geçerli bir e-posta adresi girin.</Field.HelperText>
              <Field.ErrorMessage />
            </Field.Root>

            <Field.Root name='subject'>
              <Field.Label>Konusu</Field.Label>
              <Field.Input type='text' />
              <Field.HelperText>
                Mesaj konusu en az 1 en fazla 150 karakter olabilir.
              </Field.HelperText>
              <Field.ErrorMessage />
            </Field.Root>

            <Field.Root name='content'>
              <Field.Label>İçeriği</Field.Label>
              <Field.TextArea rows={6} />
              <Field.HelperText>
                Mesaj içeriği en az 1 en fazla 2000 karakter olabilir.
              </Field.HelperText>
              <Field.ErrorMessage />
            </Field.Root>

            <Button
              type='submit'
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? "Güncelleniyor..." : "Güncelle"}
            </Button>
          </Form>
        </Card.Content>
      </Card.Root>
    </section>
  );
}
