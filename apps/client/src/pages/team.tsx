import { Loader } from "@/components/Loader";
import { useHTTP } from "@/hooks";
import { HomeLayout } from "@/layouts/Home/Layout";
import { getGravatar } from "@/lib";
import { IUser } from "@/types";
import {
  Divider,
  User,
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/react";
import { useEffect, useState } from "react";

const instagram = "https://www.instagram.com/haloidergisi";

export const Team = () => {
  const { data: users } = useHTTP<IUser[]>("/users");
  const { data: squads } = useHTTP<any[]>("/squads");
  const [squadWithMembers, setSquadWithMembers] = useState<any[]>();

  useEffect(() => {
    if (users && squads) {
      const squadWithMembers = squads.map((squad) => ({
        ...squad,
        members: users.filter((user) => user.squadId === squad.id),
      }));
      setSquadWithMembers(squadWithMembers);
    }
  }, [users, squads]);

  if (!users || !squads) return <Loader />;

  const allMembersCount = squadWithMembers?.reduce(
    (acc, squad) => acc + squad.members.length,
    0,
  );

  return (
    <Wrapper>
      <div>
        <h1 className="text-center text-3xl font-bold">
          HALO Ekibi{" "}
          <span className="text-xl font-bold text-neutral-500">
            ({allMembersCount})
          </span>
        </h1>
        <p className="text-center text-lg text-neutral-500">
          HALO ekibini oluşturan kişileri burada bulabilirsiniz ve kartlara
          tıklayarak daha fazla bilgi edinebilirsiniz!
        </p>
      </div>
      <Divider className="my-3" />
      {squadWithMembers?.map((squad) => (
        <UserGroup key={squad.id} title={squad.name} users={squad.members} />
      ))}
    </Wrapper>
  );
};

const UserGroup = ({ title, users }: { title: string; users: IUser[] }) => {
  const className =
    title === "Yönetim"
      ? "grid grid-cols-1 gap-3 md:grid-cols-3 lg:grid-cols-3"
      : "grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-3";
  return (
    <>
      <div>
        <h2 className="mb-3 text-center text-2xl">{title}</h2>
        <div className={className}>
          {users.reverse().map((user) => (
            <UserCard key={user.id} user={user} />
          ))}
        </div>
      </div>
      <br />
    </>
  );
};

const Wrapper = ({ children }: { children: React.ReactNode }) => (
  <HomeLayout>
    <main className="container my-10">
      <div className="mx-auto max-w-4xl">{children}</div>
    </main>
  </HomeLayout>
);

const UserCard = ({ user }: { user: IUser }) => {
  const [isOpen, setOpen] = useState(false);

  if (!user.bio) user.bio = user.displayName;

  return (
    <>
      <div className="h-full w-full">
        <User
          className="flex h-full w-full cursor-pointer justify-start bg-[rgb(248,239,208)] p-3"
          name={user.displayName}
          description={user.role}
          avatarProps={{
            src: getGravatar(user.email),
          }}
          onClick={() => setOpen(true)}
        />
      </div>

      <Modal isOpen={isOpen} onOpenChange={setOpen}>
        <ModalContent>
          <ModalHeader>
            <User
              name={user.displayName}
              description={user.role}
              avatarProps={{
                src: getGravatar(user.email),
              }}
            />
          </ModalHeader>
          <ModalBody>
            <p>{user.bio}</p>
          </ModalBody>
          <ModalFooter>
            <Button
              onClick={() => window.open(instagram, "_blank")}
              color="primary"
            >
              İnternet Sitesi
            </Button>
            <Button onClick={() => setOpen(false)} color="danger">
              Kapat
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default Team;
