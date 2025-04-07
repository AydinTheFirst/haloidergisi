import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Link
} from "@heroui/react";
import { LucideUser } from "lucide-react";

import { useDeviceType } from "@/hooks";
import { useAuth } from "@/providers/AuthProvider";

export function UserDisplay() {
  const { isLoggedIn, logout, user } = useAuth();
  const { isMobile } = useDeviceType();

  if (!isLoggedIn) {
    return (
      <div className='flex gap-1'>
        <Button
          as={Link}
          href='/login'
        >
          <strong>Giriş Yap</strong>
        </Button>
        <Button
          as={Link}
          className='hidden md:flex'
          href='/register'
          variant='light'
        >
          <strong>Kayıt Ol</strong>
        </Button>
      </div>
    );
  }

  if (!user) return null;

  return (
    <Dropdown>
      <DropdownTrigger>
        <Button
          isIconOnly={isMobile}
          startContent={<LucideUser />}
        >
          <strong className='mt-1 hidden md:block'>{user.displayName}</strong>
        </Button>
      </DropdownTrigger>
      <DropdownMenu aria-label='Static Actions'>
        <DropdownItem
          className={user.roles.includes("ADMIN") ? "" : "hidden"}
          href='/dashboard'
          key='dashboard'
        >
          Yönetim Paneli
        </DropdownItem>

        <DropdownItem
          href='/account'
          key='account'
        >
          Hesabım
        </DropdownItem>

        <DropdownItem
          className='text-danger'
          color='danger'
          key='delete'
          onClick={logout}
        >
          Çıkış Yap
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
}
