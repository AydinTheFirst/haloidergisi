import {
  Button,
  Link,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@heroui/react";
import { LucideExternalLink } from "lucide-react";
import { useLoaderData } from "react-router";

import type { Squad } from "~/models/Squad";
import type { User } from "~/models/User";

import { MarkdownContent } from "~/components/markdown-content";
import { UserCard } from "~/components/user-card";
import { http } from "~/lib/http";
import { cdnSource } from "~/lib/utils";

import type { Route } from "./+types/page";

export const meta: Route.MetaFunction = () => {
  return [
    {
      description:
        "HALO Dergisi ekibi, edebiyat dünyasına katkıda bulunan yetenekli bireylerden oluşmaktadır. Ekibimiz hakkında daha fazla bilgi edinebilirsiniz.",
      title: "HALO Dergisi - Ekibimiz",
    },
  ];
};

export const loader = async () => {
  const { data: squads } = await http.get<Squad[]>("/squads");

  return { squads };
};

export default function Team() {
  const { squads } = useLoaderData<typeof loader>();

  const sortedSquads = squads.sort((a, b) => {
    if (a.order === b.order) {
      return a.name.localeCompare(b.name);
    }
    return a.order - b.order;
  });

  const allMembersCount = squads.reduce((acc, squad) => {
    return acc + (squad.users?.length || 0);
  }, 0);

  return (
    <div className="container max-w-3xl py-20">
      <div className="grid gap-3">
        <h2 className="text-2xl font-semibold">Ekibimiz</h2>
        <p className="text-muted">
          {allMembersCount} kişiden oluşan HALO ekibini burada bulabilirsiniz ve kartlara tıklayarak
          kişiler hakkında daha fazla bilgi edinebilirsiniz!
        </p>
        <SquadsList squads={sortedSquads} />
      </div>
    </div>
  );
}

function SquadsList({ squads }: { squads: Squad[] }) {
  return (
    <ul className="grid gap-5">
      {squads.map((squad) => (
        <li className="grid gap-2" key={squad.id}>
          <h4 className="font-semibold">{squad.name}</h4>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
            {squad.users?.map((user) => (
              <UserDetailsModal key={user.id} user={user} />
            ))}
          </div>
        </li>
      ))}
    </ul>
  );
}
function UserDetailsModal({ user }: { user: User }) {
  const { isOpen, onClose, onOpen, onOpenChange } = useDisclosure();

  return (
    <>
      <div>
        <UserCard
          avatarProps={{
            className: "shrink-0",
            name: user.profile?.displayName,
            src: user.profile?.avatarUrl && cdnSource(user.profile.avatarUrl),
          }}
          className="cursor-pointer"
          description={user.profile?.title}
          name={user.profile?.displayName || user.username}
          onClick={onOpen}
        />
      </div>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          <ModalHeader className="flex gap-1">
            <UserCard
              avatarProps={{
                className: "shrink-0",
                name: user.profile?.displayName,
                src: user.profile?.avatarUrl && cdnSource(user.profile.avatarUrl),
              }}
              description={user.profile?.title}
              name={user.profile?.displayName || user.username}
            />
          </ModalHeader>
          <ModalBody>
            <MarkdownContent>{user.profile?.bio ?? "İçerik bulunamadı"}</MarkdownContent>
          </ModalBody>
          <ModalFooter>
            <Button color="danger" onPress={onClose} variant="light">
              Kapat
            </Button>
            {user.profile?.website && (
              <Link href={user.profile.website} isExternal>
                <span className="mx-2">Web Sitesi</span>
                <LucideExternalLink size={16} />
              </Link>
            )}
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
