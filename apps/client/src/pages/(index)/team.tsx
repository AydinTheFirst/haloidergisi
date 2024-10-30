import {
  Button,
  Divider,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  User,
} from "@nextui-org/react";
import { useEffect, useState } from "react";
import useSWR from "swr";

import { Loader } from "@/components/Loader";
import { User as IUser } from "@/types";
import { getGravatar } from "@/utils";

const instagram = "https://www.instagram.com/haloidergisi";

interface ISquad {
  id: string;
  name: string;
}

interface ISquadWithMembers extends ISquad {
  members: IUser[];
}

export const Team = () => {
  const { data: users } = useSWR<IUser[]>("/users");
  const { data: squads } = useSWR<ISquad[]>("/squads");
  const [squadWithMembers, setSquadWithMembers] =
    useState<ISquadWithMembers[]>();

  console.log(squadWithMembers);

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
    <div className="mx-auto max-w-3xl">
      <div>
        <h1 className="text-3xl font-bold">HALO Ekibi</h1>
        <p className="text-lg text-neutral-500">
          {allMembersCount} kişiden oluşan HALO ekibini burada bulabilirsiniz ve
          kartlara tıklayarak kişiler hakkında daha fazla bilgi edinebilirsiniz!
        </p>
      </div>
      <Divider className="my-3" />
      {squadWithMembers?.map((squad) => (
        <UserGroup key={squad.id} title={squad.name} users={squad.members} />
      ))}
    </div>
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
        <h2 className="mb-3 text-2xl">{title}</h2>
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

const UserCard = ({ user }: { user: IUser }) => {
  const [isOpen, setOpen] = useState(false);

  if (!user.bio) user.bio = user.displayName;

  return (
    <>
      <div className="h-full w-full">
        <User
          avatarProps={{
            src: getGravatar(user.email),
          }}
          className="flex h-full w-full cursor-pointer justify-start bg-[rgb(248,239,208)] p-3"
          description={user.title}
          name={user.displayName}
          onClick={() => setOpen(true)}
        />
      </div>

      <Modal isOpen={isOpen} onOpenChange={setOpen}>
        <ModalContent>
          <ModalHeader>
            <User
              avatarProps={{
                src: getGravatar(user.email),
              }}
              description={user.title}
              name={user.displayName}
            />
          </ModalHeader>
          <ModalBody>
            <p>{user.bio}</p>
          </ModalBody>
          <ModalFooter>
            <Button
              color="primary"
              onClick={() => window.open(instagram, "_blank")}
            >
              İnternet Sitesi
            </Button>
            <Button color="danger" onClick={() => setOpen(false)}>
              Kapat
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default Team;
