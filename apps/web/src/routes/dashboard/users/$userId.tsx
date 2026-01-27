import { Card, Field, Button, Form } from "@adn-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Crew } from "@repo/db";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import apiClient from "@/lib/api-client";
import { userSchema, UserSchema } from "@/schemas/user";
import { List, User } from "@/types";

export const Route = createFileRoute("/dashboard/users/$userId")({
  component: RouteComponent,
  loader: async () => {
    const { data: crews } = await apiClient.get<List<Crew>>("/crews", {
      params: { limit: 1000 },
    });
    return { crews };
  },
});

function RouteComponent() {
  const { userId } = Route.useParams();
  const { crews } = Route.useLoaderData();

  const { data: user } = useQuery({
    queryKey: ["user", userId],
    queryFn: async () => {
      const { data } = await apiClient.get<User>(`/users/${userId}`);
      return data;
    },
  });

  const navigate = useNavigate({ from: Route.id });

  const form = useForm<UserSchema>({
    resolver: zodResolver(userSchema),
    values: {
      name: user?.profile?.name ?? "",
      email: user?.email ?? "",
      password: undefined,
      crewId: user?.crewId ?? undefined,
    },
  });

  const onSubmit = async (data: UserSchema) => {
    try {
      await apiClient.patch(`/users/${userId}`, data);
      toast.success("Kullanıcı başarıyla güncellendi.");
      void navigate({ to: "/dashboard/users" });
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
          <Card.Title>Kullanıcıyı Düzenle</Card.Title>
        </Card.Header>
        <Card.Content>
          <Form
            form={form}
            onSubmit={onSubmit}
          >
            <Field.Root name='name'>
              <Field.Label>Ad</Field.Label>
              <Field.Input type='text' />
              <Field.HelperText>
                Kullanıcı adı en az 1 en fazla 100 karakter olabilir.
              </Field.HelperText>
              <Field.ErrorMessage />
            </Field.Root>

            <Field.Root name='email'>
              <Field.Label>E-posta</Field.Label>
              <Field.Input type='email' />
              <Field.HelperText>Geçerli bir e-posta adresi giriniz.</Field.HelperText>
              <Field.ErrorMessage />
            </Field.Root>

            <Field.Root name='password'>
              <Field.Label>Şifre (Opsiyonel)</Field.Label>
              <Field.Input
                type='password'
                autoComplete='new-password'
              />
              <Field.HelperText>
                Şifreyi değiştirmek için yeni şifre giriniz (en az 6, en fazla 100 karakter).
              </Field.HelperText>
              <Field.ErrorMessage />
            </Field.Root>

            <Field.Root name='crewId'>
              <Field.Label>Crew ID (Opsiyonel)</Field.Label>
              <Field.Select>
                <option value=''>Crew atama</option>
                {crews?.items.map((crew) => (
                  <option
                    key={crew.id}
                    value={crew.id}
                  >
                    {crew.name} (ID: {crew.id})
                  </option>
                ))}
              </Field.Select>
              <Field.HelperText>
                Kullanıcıyı bir crew'e atamak için crew ID'si giriniz.
              </Field.HelperText>
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
