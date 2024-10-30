import { useHTTP } from "@/hooks";
import { HomeLayout } from "@/layouts/Home/Layout";
import { getGravatar, http, httpError } from "@/lib";
import { IUser } from "@/types";
import {
  Card,
  CardBody,
  Input,
  Button,
  Avatar,
  Textarea,
} from "@nextui-org/react";
import { toast } from "sonner";

export const Profile = () => {
  const { data: user } = useHTTP<IUser>("/users/@me");

  if (!user) return <div>Loading...</div>;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const data = Object.fromEntries(form.entries());

    try {
      await http.put("/users", data);
      toast.success("Profile updated!");
    } catch (error) {
      httpError(error);
    }
  };

  return (
    <>
      <HomeLayout>
        <div className="container my-10 flex h-screen items-center justify-center">
          <Card className="col-lg-4 col-md-6 relative">
            <div className="to--500 h-[100px] rounded-lg bg-gradient-to-tr from-yellow-500 to-red-500" />
            <div
              className="flex justify-center"
              style={{
                position: "absolute",
                top: "70px",
                left: "50%",
                transform: "translateX(-50%)",
              }}
            >
              <Avatar size="lg" src={getGravatar(user.email)} />
            </div>
            <div style={{ height: "25px" }} />
            <div>
              <h1 className="text-3lg text-center font-bold">
                {user.displayName}
              </h1>
            </div>
            <CardBody>
              <form onSubmit={handleSubmit} className="row g-3">
                <Input
                  label="Name"
                  name="displayName"
                  defaultValue={user.displayName}
                />

                <Input label="Email" name="email" defaultValue={user.email} />

                <Input
                  label="Website"
                  name="website"
                  defaultValue={user.website}
                />

                <Textarea label="Bio" name="bio" defaultValue={user.bio} />

                <Input
                  label="Role"
                  name="role"
                  defaultValue={user.role}
                  isReadOnly
                />

                <Input label="Password" name="password" type="password" />

                <div className="col-12">
                  <Button type="submit" color="primary" fullWidth>
                    Update
                  </Button>
                </div>
              </form>
            </CardBody>
          </Card>
        </div>
      </HomeLayout>
    </>
  );
};

export default Profile;
