import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger
} from "@heroui/react";
import { UserIcon } from "lucide-react";
import { useLoaderData } from "react-router";

import type { User } from "@/types";

import http from "@/http";

export const clientLoader = async () => {
  const { data: user } = await http.get<User>("/auth/me");
  return user;
};

export const UserDisplay = () => {
  const me = useLoaderData<typeof clientLoader>();

  const logout = () => {
    localStorage.removeItem("token");
    location.replace("/");
  };

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
