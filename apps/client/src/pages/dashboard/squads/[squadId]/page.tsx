import type { Squad } from "~/models/Squad";

import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Input,
  Link,
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
  params: { squadId?: string };
}) => {
  const { squadId } = params;

  if (!squadId || squadId === "create") {
    return { squad: null };
  }

  const { data: squad } = await http.get<Squad>(`/squads/${squadId}`);

  return { squad };
};

export default function ViewSquad() {
  const { squad } = useLoaderData<typeof clientLoader>();
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

    data.order = Number(data.order);

    setIsLoading(true);
    try {
      if (squad) {
        await http.patch(`/squads/${squad.id}`, data);
        toast.success("Ekip başarıyla güncellendi.");
      } else {
        await http.post("/squads", data);
        toast.success("Ekip başarıyla oluşturuldu.");
      }
      navigate("/dashboard/squads");
    } catch (error) {
      handleError(error);
    }
    setIsLoading(false);
  };

  const handleDelete = async () => {
    if (!squad) return;
    try {
      await http.delete(`/squads/${squad.id}`);
      toast.success("Ekip silindi.");
      navigate("/dashboard/squads");
    } catch (error) {
      handleError(error);
    }
  };

  return (
    <>
      <div className='grid gap-3'>
        <div className='flex justify-end'>
          {squad && (
            <Link
              color='foreground'
              href={`/squads/${squad.id}`}
              isExternal
            >
              Ekip Sayfası
            </Link>
          )}
        </div>

        <Card>
          <CardHeader className='justify-between'>
            <h2 className='text-xl font-bold'>
              {squad ? squad.name : "Yeni Ekip Oluştur"}
            </h2>
            {squad && (
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
                defaultValue={squad?.name || ""}
                isRequired
                label='Ekip Adı'
                name='name'
              />
              <Input
                defaultValue={squad?.description || ""}
                isRequired
                label='Açıklama'
                name='description'
              />

              <Input
                defaultValue={squad?.order.toString() || "0"}
                isRequired
                label='Sıra'
                name='order'
                type='number'
              />

              <Button
                color='primary'
                isLoading={isLoading}
                type='submit'
              >
                {squad ? "Güncelle" : "Oluştur"}
              </Button>
            </form>
          </CardBody>
        </Card>
      </div>

      <ConfirmModal
        {...confirmDeleteModal}
        message='Bu ekibi silmek istediğinize emin misiniz?'
        onConfirm={handleDelete}
      />
    </>
  );
}
