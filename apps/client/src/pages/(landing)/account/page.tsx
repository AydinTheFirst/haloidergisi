import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Input,
  Textarea
} from "@heroui/react";
import CdnAvatar from "~/components/cdn-avatar";
import PasswordInput from "~/components/password-input";
import { useAuth } from "~/hooks/use-auth";
import { handleError, http } from "~/lib/http";
import { toast } from "sonner";

export default function Account() {
  const { user } = useAuth();

  if (!user) {
    return <div>Please log in to view your account.</div>;
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const data = Object.fromEntries(formData.entries());

    try {
      await http.patch("/account", data);
      toast.success("Hesap bilgileri güncellendi.");
    } catch (error) {
      handleError(error);
    }
  };

  const onProfileUpdate = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const data = Object.fromEntries(formData.entries());

    try {
      await http.patch("/account/profile", data);
      toast.success("Profil bilgileri güncellendi.");
    } catch (error) {
      handleError(error);
    }
  };

  const onPasswordUpdate = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const data = Object.fromEntries(formData.entries());
    try {
      await http.patch("/account/password", data);
      toast.success("Şifre güncellendi.");
    } catch (error) {
      handleError(error);
    }
  };

  return (
    <div className='container py-20'>
      <div className='grid h-full place-items-center'>
        <Card className='w-full max-w-xl'>
          <CardHeader className='relative p-0'>
            <div className='h-20 w-full bg-yellow-100' />
            <CdnAvatar
              className='absolute -bottom-6 left-1/2 -translate-x-1/2 transform'
              name={user.profile?.displayName}
              size='lg'
              {...(user.profile?.avatarUrl && { src: user.profile.avatarUrl })}
            />
          </CardHeader>
          <CardBody>
            <form
              className='grid gap-3'
              onSubmit={handleSubmit}
            >
              <h4 className='text-lg font-semibold'>Hesap Detayları</h4>
              <Input
                defaultValue={user.username}
                label='Kullanıcı Adı'
                name='username'
              />

              <Input
                defaultValue={user.email}
                description={
                  user.emailVerifiedAt
                    ? "E-posta adresiniz doğrulandı."
                    : "E-posta adresiniz doğrulanmadı."
                }
                label='E-posta'
                name='email'
                type='email'
              />

              <Button
                color='primary'
                type='submit'
              >
                Güncelle
              </Button>
            </form>
          </CardBody>
          <CardBody>
            <form
              className='grid gap-3'
              onSubmit={onProfileUpdate}
            >
              <h4 className='text-lg font-semibold'>Profil Detayları</h4>
              <Input
                defaultValue={user.profile?.displayName}
                label='Görünen Ad'
                name='displayName'
              />

              <Textarea
                defaultValue={user.profile?.bio}
                label='Biyografi'
                name='bio'
                rows={3}
              />

              <Input
                defaultValue={user.profile?.website}
                label='Web Sitesi'
                name='website'
                type='url'
              />

              <Button
                color='primary'
                type='submit'
              >
                Güncelle
              </Button>
            </form>
          </CardBody>
          <CardBody>
            <form
              className='grid gap-3'
              onSubmit={onPasswordUpdate}
            >
              <h4 className='text-lg font-semibold'>Şifre Değiştir</h4>
              <PasswordInput
                isRequired
                label='Mevcut Şifre'
                name='currentPassword'
              />

              <PasswordInput
                isRequired
                label='Yeni Şifre'
                name='newPassword'
              />

              <Button
                color='primary'
                type='submit'
              >
                Şifreyi Güncelle
              </Button>
            </form>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
