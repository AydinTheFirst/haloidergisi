import { Button, Card, Field, Form } from "@adn-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Profile } from "@repo/db";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import apiClient from "@/lib/api-client";
import { profileSchema, ProfileSchema } from "@/schemas/profile";

export const Route = createFileRoute("/dashboard/profiles/$profileId")({
  component: RouteComponent,
  loader: async ({ params: { profileId } }) => {
    const { data: profile } = await apiClient.get<Profile>(`/profile/${profileId}`);
    return { profile };
  },
});

function RouteComponent() {
  const navigate = useNavigate({ from: Route.id });
  const { profile } = Route.useLoaderData();

  const form = useForm<ProfileSchema>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: profile?.name ?? "",
      title: profile?.title ?? "",
      website: profile?.website ?? "",
      bio: profile?.bio ?? "",
    },
  });

  useEffect(() => {
    if (profile) {
      form.reset({
        name: profile.name ?? "",
        bio: profile.bio ?? "",
      });
    }
  }, [form, profile]);

  const onSubmit = async (data: ProfileSchema) => {
    if (!profile?.id) return;

    try {
      await apiClient.patch(`/profile/${profile.id}`, data);
      toast.success("Profil başarıyla güncellendi.");
      void navigate({ to: "/dashboard/profiles" });
    } catch (error) {
      const resolved = apiClient.resolveApiError(error);
      toast.error(resolved.message, {
        description: resolved.error,
      });
    }
  };

  if (!profile) {
    return null;
  }

  return (
    <section>
      <Card.Root className='mx-auto'>
        <Card.Header>
          <Card.Title>Profili Düzenle</Card.Title>
        </Card.Header>
        <Card.Content>
          <Form
            form={form}
            onSubmit={onSubmit}
          >
            <Field.Root
              name='name'
              isRequired
            >
              <Field.Label>Ad</Field.Label>
              <Field.Input type='text' />
              <Field.HelperText>Profil adı 1-100 karakter olmalıdır.</Field.HelperText>
              <Field.ErrorMessage />
            </Field.Root>

            <Field.Root name='title'>
              <Field.Label>Unvan</Field.Label>
              <Field.Input type='text' />
              <Field.HelperText>Profil unvanı 1-100 karakter olmalıdır.</Field.HelperText>
              <Field.ErrorMessage />
            </Field.Root>

            <Field.Root name='website'>
              <Field.Label>Web Sitesi</Field.Label>
              <Field.Input type='url' />
              <Field.HelperText>Geçerli bir web sitesi URL'si giriniz.</Field.HelperText>
              <Field.ErrorMessage />
            </Field.Root>

            <Field.Root name='bio'>
              <Field.Label>Biyografi</Field.Label>
              <Field.TextArea rows={5} />
              <Field.HelperText>Maksimum 500 karakter.</Field.HelperText>
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
