import type { MetaFunction } from "react-router";

import {
  Button,
  Divider,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  User
} from "@heroui/react";
import { useState } from "react";
import { useLoaderData } from "react-router";

import type { User as IUser } from "@/types";
import type { SquadWithUsers } from "@/types/extended";

import http from "@/http";
import { getAvatar } from "@/utils";

const instagram = "https://www.instagram.com/haloidergisi";

export const loader = async () => {
  const squads = await http.fetcher<SquadWithUsers[]>("/squads");
  return squads;
};

export const meta: MetaFunction = ({ data }) => {
  const squads = data as SquadWithUsers[];
  const allMembers = squads.reduce<IUser[]>(
    (acc, squad) => acc.concat(squad.users),
    []
  );

  const desc =
    "HALO Ekibi, HALO Dergisi'nin arkasındaki yaratıcı güçtür. Ekibimiz, dergiyi oluşturmak ve geliştirmek için bir araya gelmiştir.";

  return [
    { title: "HALO Ekibi" },
    {
      content: desc,
      name: "description"
    },
    {
      content: allMembers.map((user) => user.displayName).join(", "),
      name: "keywords"
    },
    {
      content: "HALO Ekibi",
      property: "og:title"
    },
    {
      content: desc,
      property: "og:description"
    }
  ];
};

export const Team = () => {
  const squads = useLoaderData<typeof loader>();

  const allMembersCount = squads.reduce(
    (acc, squad) => acc + squad.users.length,
    0
  );

  squads.sort((a, b) => a.order - b.order);

  return (
    <div className='container my-10 max-w-3xl'>
      <div>
        <h1 className='text-3xl font-bold'>HALO Ekibi</h1>
        <p className='text-lg text-neutral-500'>
          {allMembersCount} kişiden oluşan HALO ekibini burada bulabilirsiniz ve
          kartlara tıklayarak kişiler hakkında daha fazla bilgi edinebilirsiniz!
        </p>
      </div>
      <Divider className='my-3' />
      {squads.map(
        (squad) =>
          squad.users.length > 0 && (
            <UserGroup
              key={squad.id}
              title={squad.name}
              users={squad.users}
            />
          )
      )}
    </div>
  );
};

const UserGroup = ({
  title,
  users
}: {
  title: string;
  users: SquadWithUsers["users"];
}) => {
  const className =
    title === "Yönetim"
      ? "grid grid-cols-1 gap-3 md:grid-cols-3 lg:grid-cols-3"
      : "grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-3";
  return (
    <>
      <div>
        <h2 className='mb-3 text-2xl'>{title}</h2>
        <div className={className}>
          {users.reverse().map((user) => (
            <UserCard
              key={user.id}
              user={user}
            />
          ))}
        </div>
      </div>
      <br />
    </>
  );
};

const UserCard = ({ user }: { user: IUser }) => {
  const [isOpen, setOpen] = useState(false);

  const renderBio = (bio: string) => {
    return bio.replace(
      /(https?:\/\/[^\s]+)/g, // URL'yi eşleştiren regex
      `<a href="$1" target="_blank" class="text-blue-500 underline">$1</a>`
    );
  };

  const bio = user.bio ?? user.displayName ?? "";

  return (
    <>
      <div className='h-full w-full'>
        <User
          avatarProps={{
            src: getAvatar(user)
          }}
          className='flex h-full w-full cursor-pointer justify-start bg-content1 p-3'
          description={user.title}
          name={user.displayName}
          onClick={() => setOpen(true)}
        />
      </div>

      <Modal
        isOpen={isOpen}
        onOpenChange={setOpen}
      >
        <ModalContent>
          <ModalHeader>
            <User
              avatarProps={{
                src: getAvatar(user)
              }}
              description={user.title}
              name={user.displayName}
            />
          </ModalHeader>
          <ModalBody>
            <p dangerouslySetInnerHTML={{ __html: renderBio(bio) }} />
          </ModalBody>
          <ModalFooter>
            {user.website && (
              <Button
                color='primary'
                onPress={() => window.open(instagram, "_blank")}
              >
                İnternet Sitesi
              </Button>
            )}
            <Button
              color='danger'
              onPress={() => setOpen(false)}
            >
              Kapat
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default Team;
