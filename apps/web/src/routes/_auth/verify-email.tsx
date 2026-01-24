import { Button, Card, Container } from "@adn-ui/react";
import { Icon } from "@iconify/react";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link, useSearch } from "@tanstack/react-router";
import { motion } from "motion/react";
import z from "zod";

import apiClient from "@/lib/api-client";

const searchSchema = z.object({
  token: z.string().min(1, "Token is required"),
});

type Search = z.infer<typeof searchSchema>;

export const Route = createFileRoute("/_auth/verify-email")({
  component: RouteComponent,
  validateSearch: (search): Search => searchSchema.parse(search),
  loaderDeps: ({ search: { token } }) => ({ token }),
});

function RouteComponent() {
  const search = useSearch({ from: "/_auth/verify-email" });

  const { data, isLoading, error } = useQuery({
    queryKey: ["verify-email", search.token],
    queryFn: async () => {
      return apiClient.post("/account/verify-email", {
        token: search.token,
      });
    },
  });

  return (
    <Container className='grid min-h-screen place-items-center px-4'>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className='w-full max-w-md'
      >
        <Card.Root>
          <Card.Header className='text-center'>
            <motion.div
              animate={{ rotate: isLoading ? 360 : 0 }}
              transition={{ duration: isLoading ? 1 : 0.5, repeat: isLoading ? Infinity : 0 }}
              className='from-primary/20 to-primary/10 mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-linear-to-br'
            >
              {isLoading && (
                <Icon
                  icon='mdi:email-check'
                  className='text-primary text-xl'
                />
              )}
              {error && (
                <Icon
                  icon='mdi:alert-circle'
                  className='text-destructive text-xl'
                />
              )}
              {data && (
                <Icon
                  icon='mdi:check-circle'
                  className='text-xl text-green-500'
                />
              )}
            </motion.div>

            <Card.Title className='text-2xl'>
              {isLoading && "E-posta Doğrulanıyor"}
              {error && "Doğrulama Başarısız"}
              {data && "E-posta Doğrulandı!"}
            </Card.Title>
            <Card.Description className='mt-2'>
              {isLoading && "Lütfen bekleyin, e-postanız doğrulanıyor..."}
              {error && "E-posta doğrulama işlemi sırasında bir hata oluştu."}
              {data && "E-postanız başarıyla doğrulandı. Artık giriş yapabilirsiniz."}
            </Card.Description>
          </Card.Header>

          <Card.Content className='space-y-6'>
            {error && (
              <div className='bg-destructive/10 flex items-start gap-3 rounded-lg p-4'>
                <Icon
                  icon='mdi:information'
                  className='text-destructive mt-0.5 shrink-0 text-lg'
                />
                <div className='text-destructive flex-1 text-sm'>
                  <p className='font-medium'>Hata Detayı:</p>
                  <p className='mt-1'>{apiClient.resolveApiError(error).message}</p>
                </div>
              </div>
            )}

            {data && (
              <div className='flex items-start gap-3 rounded-lg bg-green-500/10 p-4'>
                <Icon
                  icon='mdi:check'
                  className='mt-0.5 shrink-0 text-lg text-green-500'
                />
                <div className='flex-1 text-sm text-green-700 dark:text-green-400'>
                  <p className='font-medium'>Başarılı!</p>
                  <p className='mt-1'>
                    Artık hesabınıza giriş yapabilir ve tüm özellikleri kullanabilirsiniz.
                  </p>
                </div>
              </div>
            )}

            <Button
              render={<Link to='/' />}
              className='w-full'
              size='lg'
            >
              <Icon
                icon='mdi:home'
                className='mr-2 text-lg'
              />
              Anasayfaya Dön
            </Button>

            {error && (
              <Button
                variant='outline'
                render={<Link to='/login' />}
                className='w-full'
              >
                <Icon
                  icon='mdi:login'
                  className='mr-2 text-lg'
                />
                Giriş Sayfasına Git
              </Button>
            )}
          </Card.Content>
        </Card.Root>
      </motion.div>
    </Container>
  );
}
