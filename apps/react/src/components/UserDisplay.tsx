import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@nextui-org/react";
import { UserIcon } from "lucide-react";
import useSWR from "swr";

import { User } from "@/types";

export const UserDisplay = () => {
  const { data: me } = useSWR<User>("/auth/me", {
    onError: () => {},
  });

  const logout = () => {
    localStorage.removeItem("token");
    location.reload();
  };

  if (!me) return null;

  return (
    <Dropdown>
      <DropdownTrigger>
        <Button startContent={<UserIcon />} variant="faded">
          <strong className="mt-1">{me.displayName}</strong>
        </Button>
      </DropdownTrigger>
      <DropdownMenu aria-label="Static Actions">
        <DropdownItem href="/account">Hesap Ayarları</DropdownItem>
        <DropdownItem color="danger" onPress={logout}>
          Çıkış Yap
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
};
