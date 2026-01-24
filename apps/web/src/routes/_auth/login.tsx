import { Button, Card, Container, Field, Form, Separator } from "@adn-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Icon } from "@iconify/react";
import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { motion } from "motion/react";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

import { GoogleAuthButton } from "@/components/auth";
import { Turnstile } from "@/components/turnstile";
import apiClient from "@/lib/api-client";

const loginSchema = z.object({
  email: z.email({ error: "Geçerli bir e-posta adresi girin." }),
  password: z.string().min(6, { error: "Şifre en az 6 karakter olmalıdır." }),
});

type LoginFormData = z.infer<typeof loginSchema>;

export const Route = createFileRoute("/_auth/login")({
  component: RouteComponent,
});

function RouteComponent() {
  const router = useRouter();

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const [token, setToken] = React.useState<string | null>(null);

  const onSubmit = async (formData: LoginFormData) => {
    if (!token) {
      toast.error("Lütfen CAPTCHA doğrulamasını tamamlayın.");
      return;
    }

    try {
      const { data } = await apiClient.post("/auth/login", {
        "cf-turnstile-response": token,
        ...formData,
      });
      localStorage.setItem("token", data.token);
      toast.success("Giriş başarılı!");
      await router.navigate({ to: "/" });
    } catch (error) {
      console.error("Giriş hatası:", error);
      toast.error(apiClient.resolveApiError(error).message);
    }
  };

  return (
    <Container className='grid min-h-screen place-items-center px-4'>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className='w-full max-w-md'
      >
        <Card.Root className='mx-auto'>
          <Card.Header className='text-center'>
            <div className='mb-4 flex justify-center'>
              <div className='from-primary/20 to-primary/10 flex h-12 w-12 items-center justify-center rounded-full bg-linear-to-br'>
                <Icon
                  icon='mdi:login'
                  className='text-primary text-xl'
                />
              </div>
            </div>
            <Card.Title className='text-2xl'>Giriş Yapın</Card.Title>
            <Card.Description className='mt-2'>
              Hesabınıza erişmek için giriş yapın
            </Card.Description>
          </Card.Header>
          <Card.Content>
            <Form
              form={form}
              onSubmit={onSubmit}
              className='space-y-4'
            >
              <Field.Root
                name='email'
                isRequired
              >
                <Field.Label className='flex items-center gap-2'>
                  <Icon
                    icon='mdi:email'
                    className='text-lg'
                  />
                  E-posta
                </Field.Label>
                <Field.Input type='email' />
                <Field.ErrorMessage />
              </Field.Root>

              <Field.Root
                name='password'
                isRequired
              >
                <div className='flex items-center justify-between'>
                  <Field.Label className='flex items-center gap-2'>
                    <Icon
                      icon='mdi:lock'
                      className='text-lg'
                    />
                    Şifre
                  </Field.Label>

                  <Link
                    to='/forgot-password'
                    className='text-danger text-xs hover:underline'
                  >
                    Şifremi Unuttum?
                  </Link>
                </div>
                <Field.Input type='password' />
                <Field.ErrorMessage />
              </Field.Root>

              <div className='flex justify-center'>
                <Turnstile onVerify={(token) => setToken(token)} />
              </div>
              <Button
                type='submit'
                className='w-full'
                disabled={form.formState.isSubmitting}
                size='lg'
              >
                <Icon
                  icon='mdi:login'
                  className='mr-2 text-lg'
                />
                Giriş Yap
              </Button>
              <div className='flex items-center justify-center gap-2 text-sm'>
                <span className='text-muted-foreground'>Hesabınız yok mu?</span>
                <Link
                  className='text-primary font-medium hover:underline'
                  to='/register'
                >
                  Kayıt Olun
                </Link>
              </div>
            </Form>
          </Card.Content>
          <div className='flex items-center gap-6'>
            <Separator className='my-4 h-px self-center' />
            <span className='text-muted-foreground text-center text-sm'>VEYA</span>
            <Separator className='my-4 h-px self-center' />
          </div>
          <Card.Content>
            <GoogleAuthButton className='w-full' />
          </Card.Content>
        </Card.Root>
      </motion.div>
    </Container>
  );
}
