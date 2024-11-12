import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Input,
  Select,
  Selection,
  SelectItem,
} from "@nextui-org/react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import useSWR from "swr";

import http from "@/http";
import { Squad, User } from "@/types";

const ViewUser = () => {
  const navigate = useNavigate();

  const { userId } = useParams<{ userId: string }>();
  const isNew = userId === "new";
  const { data: user, isLoading } = useSWR<User>(
    isNew ? null : `/users/${userId}`,
  );
  const { data: squads } = useSWR<Squad[]>("/squads");

  const [userRoles, setUserRoles] = useState<Selection>(new Set());

  useEffect(() => {
    if (!user) return;
    setUserRoles(new Set(user.roles));
  }, [user]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data: Record<string, unknown> = Object.fromEntries(
      formData.entries(),
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
          : "Kullanıcı başarıyla güncellendi!",
      );
      navigate("/dashboard/users");
    } catch (error) {
      http.handleError(error);
    }
  };

  const handleDelete = async () => {
    const confirm = window.confirm(
      "Bu işlem geri alınamaz. Kullanıcıyı silmek istediğinize emin misiniz?",
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
    <section className="grid gap-5">
      <Card>
        <CardHeader>
          <h3 className="text-2xl font-semibold">
            {isNew
              ? "Kullanıcı oluştur"
              : `Kullanıcı: ${user?.username} güncelle`}
          </h3>
        </CardHeader>
        <CardBody>
          <form className="grid grid-cols-12 gap-3" onSubmit={handleSubmit}>
            {!isNew && (
              <Input
                className="col-span-12 md:col-span-6"
                defaultValue={user?.username}
                isRequired
                label="Kullanıcı adı"
                name="username"
              />
            )}

            <Input
              className="col-span-12 md:col-span-6"
              defaultValue={user?.email}
              isRequired
              label="Email"
              name="email"
              type="email"
            />

            <Input
              className="col-span-12 md:col-span-6"
              defaultValue={user ? user.displayName || "" : ""}
              isRequired
              label="İsim"
              name="displayName"
            />

            <Select
              className="col-span-12 md:col-span-6"
              defaultSelectedKeys={[user ? user.squadId || "" : ""]}
              label="Takım"
              name="squadId"
            >
              {squads ? (
                squads.map((squad) => (
                  <SelectItem key={squad.id} value={squad.id}>
                    {squad.name}
                  </SelectItem>
                ))
              ) : (
                <SelectItem key={""}>Yükleniyor...</SelectItem>
              )}
            </Select>

            {!isNew && (
              <Select
                className="col-span-12 md:col-span-6"
                label="Roller"
                name="roles"
                onSelectionChange={setUserRoles}
                selectedKeys={userRoles}
                selectionMode="multiple"
              >
                {["ADMIN", "USER"].map((role) => (
                  <SelectItem key={role} value={role}>
                    {role}
                  </SelectItem>
                ))}
              </Select>
            )}

            <Input
              className="col-span-12 md:col-span-6"
              label="Şifre"
              name="password"
            />

            <Button
              className="col-span-12"
              color="primary"
              fullWidth
              type="submit"
            >
              {isNew ? "Oluştur" : "Güncelle"}
            </Button>
          </form>
          {!isNew && (
            <div className="mt-3 flex justify-end">
              <Button color="danger" onClick={handleDelete}>
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
