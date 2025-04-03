import { Avatar, Button, Card, CardBody, Input, Textarea } from "@heroui/react";
import { toast } from "sonner";
import useSWR from "swr";

import type { User as IUser } from "@/types";

import http from "@/http";
import { getGravatar } from "@/utils";

export const Profile = () => {
  const { data: user } = useSWR<IUser>("/auth/me");

  if (!user) return <div>Loading...</div>;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const data = Object.fromEntries(form.entries());

    try {
      await http.put("/users", data);
      toast.success("Profile updated!");
    } catch (error) {
      http.handleError(error);
    }
  };

  if (!user) return <div>Loading...</div>;

  return (
    <>
      <Card className='mx-auto max-w-xl'>
        <div className='to--500 h-[100px] rounded-lg bg-gradient-to-tr from-yellow-500 to-red-500' />
        <div
          className='flex justify-center'
          style={{
            left: "50%",
            position: "absolute",
            top: "70px",
            transform: "translateX(-50%)"
          }}
        >
          <Avatar
            size='lg'
            src={getGravatar(user.email)}
          />
        </div>
        <div style={{ height: "25px" }} />
        <div>
          <h1 className='text-3lg text-center font-bold'>{user.displayName}</h1>
        </div>
        <CardBody>
          <form
            className='grid gap-3'
            onSubmit={handleSubmit}
          >
            <Input
              defaultValue={user.displayName || ""}
              label='Name'
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
              label='Role'
              name='role'
            />

            <div className='col-12'>
              <Button
                color='secondary'
                fullWidth
                type='submit'
              >
                Update
              </Button>
            </div>
          </form>
        </CardBody>
      </Card>
    </>
  );
};

export default Profile;
