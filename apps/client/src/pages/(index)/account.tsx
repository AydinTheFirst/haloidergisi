import {
  Avatar,
  Button,
  Card,
  CardBody,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  Textarea
} from "@heroui/react";
import { LucideEdit } from "lucide-react";
import { useState } from "react";
import { useLoaderData, useRevalidator } from "react-router";
import { toast } from "sonner";

import type { User } from "@/types";

import http from "@/http";
import { getAvatar } from "@/utils";

export const clientLoader = async () => {
  const { data: user } = await http.get<User>("/auth/me");
  return user;
};

export const Profile = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const user = useLoaderData<typeof clientLoader>();
  const { revalidate } = useRevalidator();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const data = Object.fromEntries(form.entries());

    try {
      await http.put("/users/me", data);
      toast.success("Profil güncellendi!");
      revalidate();
    } catch (error) {
      http.handleError(error);
    }
  };

  return (
    <>
      <UpdateAvatarModal
        isOpen={isModalOpen}
        setIsOpen={setIsModalOpen}
      />
      <div className='container my-10 max-w-3xl'>
        <Card className='mx-auto max-w-xl'>
          <div className='h-[100px] rounded-lg bg-gradient-to-tr from-yellow-500 to-red-500' />
          <div
            className='flex justify-center'
            style={{
              left: "50%",
              position: "absolute",
              top: "70px",
              transform: "translateX(-50%)"
            }}
          >
            <div className='relative'>
              <Avatar
                className='h-20 w-20'
                src={getAvatar(user)}
              />
              <Button
                className='absolute bottom-0 end-0 -m-3'
                isIconOnly
                onPress={() => setIsModalOpen(true)}
                radius='full'
                size='sm'
              >
                <LucideEdit />
              </Button>
            </div>
          </div>
          <div className='h-16' />
          <div>
            <h1 className='text-3lg text-center font-bold'>
              {user.displayName}
            </h1>
          </div>
          <CardBody>
            <form
              className='grid gap-3'
              onSubmit={handleSubmit}
            >
              <Input
                defaultValue={user.displayName || ""}
                label='İsim'
                name='displayName'
              />

              <Input
                defaultValue={user.email || ""}
                label='Email'
                name='email'
              />

              <Input
                defaultValue={user.website || ""}
                label='Website'
                name='website'
              />

              <Textarea
                defaultValue={user.bio || ""}
                label='Bio'
                name='bio'
              />

              <Input
                defaultValue={user.title || ""}
                isReadOnly
                label='Rol'
                name='role'
              />

              <Button
                color='secondary'
                fullWidth
                type='submit'
              >
                Güncelle
              </Button>
            </form>
          </CardBody>
        </Card>
      </div>
    </>
  );
};

export default Profile;

interface ModalProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}
function UpdateAvatarModal({ isOpen, setIsOpen }: ModalProps) {
  const { revalidate } = useRevalidator();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);

    try {
      const { data: files } = await http.post<string>("/files", form);
      await http.put("/users/me", {
        avatar: files[0]
      });
      toast.success("Avatar güncellendi!");
      revalidate();
    } catch (error) {
      http.handleError(error);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={setIsOpen}
    >
      <ModalContent>
        <ModalHeader className='flex flex-col gap-1'>
          Profil Resmini Güncelle
        </ModalHeader>
        <ModalBody>
          <form
            className='grid gap-3'
            onSubmit={handleSubmit}
          >
            <Input
              accept='image/*'
              className='mb-3'
              isRequired
              label='Yeni Profil Resmi'
              name='files'
              type='file'
            />

            <Button
              color='primary'
              type='submit'
            >
              Güncelle
            </Button>
          </form>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
