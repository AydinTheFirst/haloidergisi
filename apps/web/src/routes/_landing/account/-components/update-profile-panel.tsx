import { Button, Field, Form, Separator } from "@adn-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { useAuth } from "@/hooks/use-auth";
import apiClient from "@/lib/api-client";

const updateProfileSchema = z.object({
  name: z.string().min(1, { message: "İsim gereklidir." }),
  bio: z.string().max(500, { message: "Biyografi en fazla 500 karakter olabilir." }).optional(),
});

type UpdateProfileData = z.infer<typeof updateProfileSchema>;

export function UpdateProfilePanel() {
  const { data: user } = useAuth();

  const form = useForm<UpdateProfileData>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      name: user?.profile?.name || "",
      bio: user?.profile?.bio || "",
    },
  });

  const onSubmit = async (data: UpdateProfileData) => {
    try {
      await apiClient.patch(`/profile/${user!.profile!.id}`, data);
      toast.success("Profiliniz başarıyla güncellendi.");
    } catch (error) {
      console.error(error);
      toast.error(apiClient.resolveApiError(error).message);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className='space-y-6'>
      <div>
        <h2 className='mb-2 text-2xl font-semibold'>Profili Güncelle</h2>
        <p className='text-muted-foreground text-sm'>Profil bilgilerinizi güncelleyin.</p>
      </div>

      <Separator />

      <Form
        form={form}
        onSubmit={onSubmit}
      >
        <Field.Root
          name='name'
          isRequired
        >
          <Field.Label className='text-sm font-medium'>İsim</Field.Label>
          <Field.Input
            name='name'
            className='mt-2'
          />
          <Field.HelperText>Görünür isminiz.</Field.HelperText>
          <Field.ErrorMessage />
        </Field.Root>

        <Field.Root name='bio'>
          <Field.Label className='text-sm font-medium'>Biyografi</Field.Label>
          <Field.TextArea
            name='bio'
            placeholder='Kendiniz hakkında birkaç kelime yazın...'
          />
          <Field.HelperText>
            Kendiniz hakkında kısa bir biyografi ekleyin (maksimum 500 karakter).
          </Field.HelperText>
          <Field.ErrorMessage />
        </Field.Root>

        <div className='flex justify-end pt-4'>
          <Button type='submit'>Değişiklikleri Kaydet</Button>
        </div>
      </Form>
    </div>
  );
}
