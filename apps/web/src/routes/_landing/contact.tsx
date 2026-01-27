import { Button, Card, Field, Form } from "@adn-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Icon } from "@iconify/react";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Turnstile } from "@/components/turnstile";
import { socialLinks } from "@/constants";
import apiClient from "@/lib/api-client";
import { messageSchema, MessageSchema } from "@/schemas/message";

export const Route = createFileRoute("/_landing/contact")({
  component: RouteComponent,
});

function RouteComponent() {
  const [token, setToken] = useState<string | null>(null);

  const form = useForm<MessageSchema>({
    resolver: zodResolver(messageSchema),
    defaultValues: {
      name: "",
      email: "",
      content: "",
      subject: "",
    },
  });

  const onSubmit = async (data: MessageSchema) => {
    if (!token) {
      toast.error("Lütfen CAPTCHA doğrulamasını tamamlayın.");
      return;
    }

    try {
      await apiClient.post("/messages", {
        ...data,
        "cf-turnstile-response": token,
      });
      toast.success("Mesajınız başarıyla gönderildi!");
      form.reset();
      setToken(null);
    } catch (error) {
      console.error("İletişim formu gönderim hatası:", error);
      toast.error(apiClient.resolveApiError(error).message);
    }
  };

  return (
    <div className='container py-20'>
      <div className='max-w-md space-y-2'>
        <h1 className='text-4xl font-bold'>İletişim</h1>
        <p className='text-muted-foreground'>
          Bir sorunuz ya da öneriniz mi var? Bizimle iletişime geçin! Aşağıdaki iletişim bilgilerini
          kullanarak çekinmeden bize ulaşın.
        </p>
      </div>
      <br />
      <div className='grid grid-cols-12 gap-8'>
        <div className='col-span-12 md:col-span-8'>
          <Card.Root className='max-w-none'>
            <Card.Header>
              <Card.Title>İletişim</Card.Title>
              <Card.Description>
                Bizimle iletişime geçmek için aşağıdaki bilgileri kullanabilirsiniz.
              </Card.Description>
            </Card.Header>
            <Card.Content>
              <Form
                form={form}
                onSubmit={onSubmit}
                className='max-w-none'
                variant='grid'
              >
                <Field.Root
                  name='name'
                  isRequired
                >
                  <Field.Label>İsim</Field.Label>
                  <Field.Input type='text' />
                  <Field.ErrorMessage />
                </Field.Root>

                <Field.Root
                  name='email'
                  isRequired
                >
                  <Field.Label>Email</Field.Label>
                  <Field.Input type='email' />
                  <Field.ErrorMessage />
                </Field.Root>

                <Field.Root
                  name='subject'
                  isRequired
                  className='col-span-2'
                >
                  <Field.Label>Konu</Field.Label>
                  <Field.Input type='text' />
                  <Field.ErrorMessage />
                </Field.Root>

                <Field.Root
                  name='content'
                  isRequired
                  className='col-span-2'
                >
                  <Field.Label>Mesaj</Field.Label>
                  <Field.TextArea rows={5} />
                  <Field.ErrorMessage />
                </Field.Root>

                <Turnstile
                  onVerify={(token) => setToken(token)}
                  className='col-span-2'
                />

                <div className='col-span-2'>
                  <Button
                    className='w-full'
                    type='submit'
                  >
                    Gönder
                  </Button>
                </div>
              </Form>
            </Card.Content>
          </Card.Root>
        </div>
        <div className='col-span-12 md:col-span-4'>
          <Card.Root className='max-w-none'>
            <Card.Header>
              <Card.Title>Sosyal Medya</Card.Title>
              <Card.Description>
                Bizi sosyal medyada takip edin ve en son güncellemelerden haberdar olun.
              </Card.Description>
            </Card.Header>
            <Card.Content>
              <ul className='space-y-4'>
                {Object.values(socialLinks).map((link) => (
                  <li key={link.label}>
                    <a
                      className='link'
                      href={link.url}
                      target='_blank'
                      rel='noopener noreferrer'
                    >
                      <Icon icon={link.icon} />
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </Card.Content>
          </Card.Root>
        </div>
      </div>
    </div>
  );
}
