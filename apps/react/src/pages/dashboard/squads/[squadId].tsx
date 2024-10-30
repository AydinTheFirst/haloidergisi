import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Input,
  Select,
  Selection,
  SelectItem,
  Textarea,
} from "@nextui-org/react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import useSWR from "swr";

import http from "@/http";
import { Squad, User } from "@/types";

const ViewSquad = () => {
  const navigate = useNavigate();

  const { squadId } = useParams<{ squadId: string }>();
  const isNew = squadId === "new";
  const { data: squad, isLoading } = useSWR<Squad>(
    isNew ? null : `/squads/${squadId}`,
  );

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data: Record<string, unknown> = Object.fromEntries(
      formData.entries(),
    );

    data.order = parseInt(data.order as string);

    try {
      await (isNew
        ? http.post("/squads", data)
        : http.patch(`/squads/${squadId}`, data));

      toast.success(
        isNew ? "Squad created successfully!" : "Squad updated successfully!",
      );
      navigate("/dashboard/squads");
    } catch (error) {
      http.handleError(error);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this squad?")) return;

    try {
      await http.delete(`/squads/${squadId}`);
      toast.success("Squad deleted successfully!");
      navigate("/dashboard/squads");
    } catch (error) {
      http.handleError(error);
    }
  };

  if (isLoading) return "Loading...";

  return (
    <section className="grid gap-5">
      <Card>
        <CardHeader>
          <h3 className="text-2xl font-semibold">
            {!squad
              ? "Yeni Kategori Oluştur"
              : `Kategori Düzenle: ${squad.name}`}
          </h3>
        </CardHeader>
        <CardBody>
          <form className="grid grid-cols-12 gap-3" onSubmit={handleSubmit}>
            <Input
              className="col-span-12"
              defaultValue={squad ? squad.name : ""}
              isRequired
              label="İsim"
              name="name"
            />

            <Input
              className="col-span-12"
              defaultValue={squad ? squad.order.toString() : ""}
              isRequired
              label="Sıra"
              name="order"
              type="number"
            />

            <Textarea
              className="col-span-12"
              defaultValue={squad ? squad.description : ""}
              label="Açıklama"
              name="description"
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
      {!isNew && squad && <ViewAndEditUsers squad={squad as SquadWithUsers} />}
    </section>
  );
};

export default ViewSquad;

interface SquadWithUsers extends Squad {
  users: User[];
}

interface ViewAndEditUsersProps {
  squad: SquadWithUsers;
}

const ViewAndEditUsers = ({ squad }: ViewAndEditUsersProps) => {
  const [selectedUsers, setSelectedUsers] = useState<Selection>(new Set([]));

  const { data: users } = useSWR<User[]>("/users");

  useEffect(() => {
    setSelectedUsers(new Set(squad.users.map((u) => u.id)));
  }, [squad]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const userIds = Array.from(selectedUsers);

    try {
      await http.patch(`/squads/${squad.id}/users`, { userIds });
      toast.success("Users updated successfully!");
    } catch (error) {
      http.handleError(error);
    }
  };

  if (!users) return "Loading...";

  return (
    <Card>
      <CardBody>
        <form className="grid grid-cols-12 gap-3" onSubmit={handleSubmit}>
          <Select
            className="col-span-12"
            label="Kullanıcılar"
            name="users"
            onSelectionChange={setSelectedUsers}
            selectedKeys={selectedUsers}
            selectionMode="multiple"
          >
            {users.map((user) => (
              <SelectItem key={user.id} value={user.id}>
                {user.displayName}
              </SelectItem>
            ))}
          </Select>
          <Button
            className="col-span-12"
            color="primary"
            fullWidth
            type="submit"
          >
            Güncelle
          </Button>
        </form>
      </CardBody>
    </Card>
  );
};
