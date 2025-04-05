import type { Selection } from "@heroui/react";

import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Input,
  Select,
  SelectItem,
  Textarea
} from "@heroui/react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { toast } from "sonner";
import useSWR from "swr";

import type { Squad, User } from "@/types";

import http from "@/http";

const ViewUser = () => {
  const navigate = useNavigate();

  const { userId } = useParams<{ userId: string }>();
  const isNew = userId === "new";
  const { data: user, isLoading } = useSWR<User>(
    isNew ? null : `/users/${userId}`
  );
  const { data: squads } = useSWR<Squad[]>("/squads");

  const [userRoles, setUserRoles] = useState<Selection>(new Set());
  const [password, setPassword] = useState<string>("");

  useEffect(() => {
    if (!user) return;
    setUserRoles(new Set(user.roles));
  }, [user]);

  const randomPassword = () => {
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let password = "";
    for (let i = 0; i < 10; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setPassword(password);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data: Record<string, unknown> = Object.fromEntries(
      formData.entries()
    );

    data.balance = parseFloat(data.balance as string);
    data.roles = Array.from(userRoles);

    try {
      await (isNew
        ? http.post("/auth/register", data)
        : http.patch(`/users/${userId}`, data));

      toast.success(
        isNew
          ? "Kullanıcı başarıyla oluşturuldu!"
          : "Kullanıcı başarıyla güncellendi!"
      );
      navigate("/dashboard/users");
    } catch (error) {
      http.handleError(error);
    }
  };

  const handleDelete = async () => {
    const confirm = window.confirm(
      "Bu işlem geri alınamaz. Kullanıcıyı silmek istediğinize emin misiniz?"
    );
    if (!confirm) return;

    try {
      await http.delete(`/users/${userId}`);
      toast.success("Kullanıcı başarıyla silindi!");
      navigate("/dashboard/users");
    } catch (error) {
      http.handleError(error);
    }
  };

  if (isLoading) return;

  return (
    <section className='grid gap-5'>
      <Card>
        <CardHeader>
          <h3 className='text-2xl font-semibold'>
            {isNew
              ? "Kullanıcı oluştur"
              : `Kullanıcı: ${user?.username} güncelle`}
          </h3>
        </CardHeader>
        <CardBody>
          <form
            className='grid grid-cols-12 gap-3'
            onSubmit={handleSubmit}
          >
            <Input
              className='col-span-12 md:col-span-6'
              defaultValue={user?.email}
              isRequired
              label='Email'
              name='email'
              type='email'
            />

            <Input
              className='col-span-12 md:col-span-6'
              defaultValue={user ? user.displayName || "" : ""}
              isRequired
              label='İsim'
              name='displayName'
            />

            <Input
              className='col-span-12 md:col-span-6'
              defaultValue={user ? user.title || "" : ""}
              isRequired
              label='Ünvan'
              name='title'
            />

            <Select
              className='col-span-12 md:col-span-6'
              defaultSelectedKeys={[user ? user.squadId || "" : ""]}
              items={squads || []}
              label='Takım'
              name='squadId'
            >
              {(squad) => <SelectItem key={squad.id}>{squad.name}</SelectItem>}
            </Select>

            {!isNew && (
              <Select
                className='col-span-12 md:col-span-6'
                items={[
                  { key: "ADMIN", value: "Admin" },
                  { key: "USER", value: "Kullanıcı" }
                ]}
                label='Roller'
                name='roles'
                onSelectionChange={setUserRoles}
                selectedKeys={userRoles}
                selectionMode='multiple'
              >
                {(role) => (
                  <SelectItem
                    key={role.key}
                    textValue={role.value}
                  >
                    {role.value}
                  </SelectItem>
                )}
              </Select>
            )}

            <Input
              className='col-span-12 md:col-span-6'
              description='Şifreyi değiştirmek için yeni bir şifre girin. Şifreyi değiştirmek istemiyorsanız, bu alanı boş bırakın.'
              endContent={
                <Button
                  color='secondary'
                  onPress={randomPassword}
                  size='sm'
                >
                  Rastgele
                </Button>
              }
              label='Şifre'
              name='password'
              onChange={(e) => setPassword(e.target.value)}
              value={password}
            />

            <Textarea
              className='col-span-12'
              defaultValue={user ? user.bio || "" : ""}
              isRequired
              label='Bio'
              name='bio'
            />

            <Button
              className='col-span-12'
              color='primary'
              fullWidth
              type='submit'
            >
              {isNew ? "Oluştur" : "Güncelle"}
            </Button>
          </form>
          {!isNew && (
            <div className='mt-3 flex justify-end'>
              <Button
                color='danger'
                onClick={handleDelete}
              >
                Sil
              </Button>
            </div>
          )}
        </CardBody>
      </Card>
    </section>
  );
};

export default ViewUser;
