import { zodResolver } from "@hookform/resolvers/zod";
import { Message } from "@repo/db";
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
import { Textarea } from "@/components/ui/textarea";
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
      <Card className='mx-auto'>
        <CardHeader>
          <CardTitle>Mesajı Düzenle</CardTitle>
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
                    <FormLabel>Gönderen</FormLabel>
                    <FormControl>
                      <Input
                        type='text'
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Mesaj adı en az 1 en fazla 100 karakter olabilir.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='email'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>E-postası</FormLabel>
                    <FormControl>
                      <Input
                        type='email'
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>Geçerli bir e-posta adresi girin.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='subject'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Konusu</FormLabel>
                    <FormControl>
                      <Input
                        type='text'
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Mesaj konusu en az 1 en fazla 150 karakter olabilir.
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
                    <FormLabel>İçeriği</FormLabel>
                    <FormControl>
                      <Textarea
                        rows={6}
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Mesaj içeriği en az 1 en fazla 2000 karakter olabilir.
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
