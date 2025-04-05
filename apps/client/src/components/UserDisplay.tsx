import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger
} from "@heroui/react";
import { UserIcon } from "lucide-react";
import useSWR from "swr";

import type { User } from "@/types";

export const UserDisplay = () => {
  const { data: me } = useSWR<User>("/auth/me", {
    onError: () => {}
  });

  const logout = () => {
    localStorage.removeItem("token");
    location.reload();
  };

  if (!me) return null;

  return (
    <Dropdown>
      <DropdownTrigger>
        <Button
          startContent={<UserIcon />}
          variant='faded'
        >
          <strong className='mt-1'>{me.displayName}</strong>
        </Button>
      </DropdownTrigger>
      <DropdownMenu aria-label='Static Actions'>
        <DropdownItem
          href='/account'
          key={"account"}
        >
          Hesap Ayarları
        </DropdownItem>
        <DropdownItem
          color='danger'
          key={"logout"}
          onPress={logout}
        >
          Çıkış Yap
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
};
