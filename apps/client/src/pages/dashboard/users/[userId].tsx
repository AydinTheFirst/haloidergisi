import { Loader } from "@/components/Loader";
import { Wrapper } from "@/components/Wrapper";
import { useHTTP } from "@/hooks";
import { http, httpError } from "@/lib";
import { IUser } from "@/types";
import { Button, Input, Select, SelectItem } from "@nextui-org/react";
import { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { toast } from "sonner";

export const Users = () => {
  const { userId } = useParams<{ userId: string }>();

  const { data: user, isLoading } = useHTTP<IUser>(
    userId !== "new" ? `/users/${userId}` : "",
  );

  const { data: squads } = useHTTP<any[]>("/squads");

  useEffect(() => {
    squads?.push({ id: "", name: "None" });
  }, [squads]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data: any = Object.fromEntries(new FormData(e.currentTarget));

    data.isAdmin = data.isAdmin === "true";

    try {
      user
        ? await http.put(`/users/${userId}`, data)
        : await http.post("/users", data);
      toast.success(user ? "User updated" : "User created");
    } catch (error) {
      httpError(error);
    }
  };

  if (isLoading || !squads) return <Loader />;

  return (
    <Wrapper>
      <div className="mb-3">
        <Button as={Link} to={"/dashboard?tab=users"} variant="light">
          <strong>← Back</strong>
        </Button>
      </div>
      <div>
        <h1 className="mb-3 text-center text-3xl font-bold">
          {user ? "Update" : "Create"} User
        </h1>
      </div>
      <form onSubmit={handleSubmit} className="row g-3">
        <Input
          label="Name"
          type="text"
          name="displayName"
          defaultValue={user?.displayName}
          className="col-md-6"
        />

        <Input
          label="Email"
          type="email"
          name="email"
          defaultValue={user?.email}
          className="col-md-6"
        />

        <Input
          label="Role"
          type="text"
          name="role"
          className="col-md-6"
          defaultValue={user?.role}
        />

        <Select
          label="Squad"
          name="squadId"
          defaultSelectedKeys={[String(user?.squadId || "")]}
          className="col-md-6"
        >
          {squads.map((squad) => (
            <SelectItem key={squad.id} value={String(squad.id)}>
              {squad.name}
            </SelectItem>
          ))}
        </Select>

        <Select
          label="Admin ?"
          name="isAdmin"
          defaultSelectedKeys={[String(user?.isAdmin || "false")]}
          className="col-md-6"
        >
          <SelectItem key={"true"} value="true">
            Admin
          </SelectItem>
          <SelectItem key={"false"} value="false">
            User
          </SelectItem>
        </Select>

        <div className="col-12">
          <Button type="submit" color="secondary" fullWidth>
            {user ? "Update" : "Create"}
          </Button>
        </div>
      </form>
    </Wrapper>
  );
};

export default Users;
