import type { ClientUser } from "~/models/ClientUser";
import type { Squad } from "~/models/Squad";

import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Input,
  Link,
  Select,
  SelectItem,
  useDisclosure
} from "@heroui/react";
import ConfirmModal from "~/components/confirm-modal";
import { handleError, http } from "~/lib/http";
import React from "react";
import { useLoaderData, useNavigate } from "react-router";
import { toast } from "sonner";

export const clientLoader = async ({
  params
}: {
  params: { userId?: string };
}) => {
  const { userId } = params;

  const { data: squads } = await http.get<Squad[]>("/squads");

  if (!userId || userId === "create") {
    return { squads, user: null };
  }

  const { data: user } = await http.get<ClientUser>(`/users/${userId}`);

  return { squads, user };
};

export default function ViewUser() {
  const { squads, user } = useLoaderData<typeof clientLoader>();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = React.useState(false);
  const confirmDeleteModal = useDisclosure();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const data = Object.fromEntries(formData.entries()) as Record<
      string,
      unknown
    >;

    setIsLoading(true);
    try {
      if (user) {
        await http.patch(`/users/${user.id}`, data);
        toast.success("Kullanıcı başarıyla güncellendi.");
      } else {
        await http.post("/users", data);
        toast.success("Kullanıcı başarıyla oluşturuldu.");
      }
      navigate("/dashboard/users");
    } catch (error) {
      handleError(error);
    }
    setIsLoading(false);
  };

  const handleDelete = async () => {
    if (!user) return;
    try {
      await http.delete(`/users/${user.id}`);
      toast.success("Kullanıcı başarıyla silindi.");
      navigate("/dashboard/users");
    } catch (error) {
      handleError(error);
    }
  };

  return (
    <>
      <div className='grid gap-3'>
        <div className='flex justify-end'>
          {user && (
            <Link
              color='foreground'
              href={`/users/${user.id}`}
              isExternal
            >
              Profili Görüntüle
            </Link>
          )}
        </div>

        <Card>
          <CardHeader className='justify-between'>
            <h2 className='text-xl font-bold'>
              {user ? user.profile?.displayName : "Yeni Kullanıcı Oluştur"}
            </h2>
            {user && (
              <Button
                color='danger'
                onPress={confirmDeleteModal.onOpen}
              >
                Sil
              </Button>
            )}
          </CardHeader>

          <CardBody>
            <form
              className='grid gap-3'
              onSubmit={handleSubmit}
            >
              <Input
                defaultValue={user?.username || ""}
                isRequired
                label='Kullanıcı Adı'
                name='username'
              />

              <Input
                defaultValue={user?.email || ""}
                isRequired
                label='Email'
                name='email'
                type='email'
              />

              <Select
                defaultSelectedKeys={[user?.squadId || ""]}
                items={squads}
                label='Takım'
                name='squadId'
              >
                {(item) => <SelectItem key={item.id}>{item.name}</SelectItem>}
              </Select>

              <Input
                isRequired={!user}
                label='Şifre'
                name='password'
                type='password'
              />

              <Button
                color='primary'
                isLoading={isLoading}
                type='submit'
              >
                {user ? "Güncelle" : "Oluştur"}
              </Button>
            </form>
          </CardBody>
        </Card>

        {user && <ViewProfile {...user} />}
      </div>

      <ConfirmModal
        {...confirmDeleteModal}
        message='Bu kullanıcıyı silmek istediğinize emin misiniz? Bu işlem geri alınamaz.'
        onConfirm={handleDelete}
      />
    </>
  );
}

function ViewProfile(user: ClientUser) {
  const [isLoading, setIsLoading] = React.useState(false);

  const handleUpdateProfile = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries()) as Record<
      string,
      unknown
    >;

    if (isLoading) return;

    try {
      setIsLoading(true);
      await http.patch(`/profiles/${user.profile?.id}`, data);
      toast.success("Profil başarıyla güncellendi.");
    } catch (error) {
      handleError(error);
    }
    setIsLoading(false);
  };

  return (
    <Card>
      <CardHeader>
        <h2 className='text-xl font-bold'>Profil Bilgileri</h2>
      </CardHeader>
      <CardBody>
        <form
          className='grid gap-3'
          onSubmit={handleUpdateProfile}
        >
          <Input
            defaultValue={user.profile?.displayName || ""}
            label='Görünen İsim'
            name='displayName'
          />

          <Input
            defaultValue={user.profile?.title || ""}
            label='Unvan'
            name='title'
            type='text'
          />

          <Input
            defaultValue={user.profile?.bio || ""}
            label='Biyografi'
            name='bio'
            type='text'
          />

          <Button
            color='primary'
            isLoading={isLoading}
            type='submit'
          >
            Profili Güncelle
          </Button>
        </form>
      </CardBody>
    </Card>
  );
}
