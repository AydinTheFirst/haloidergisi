import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Link } from "@heroui/react";
import { LucideUser } from "lucide-react";

import { useAuth } from "~/hooks/use-auth";
import { UserRole } from "~/models/enums";

export default function AuthItems() {
  const { user } = useAuth();

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  if (!user) {
    return (
      <>
        <Button as={Link} className="hidden md:flex" href="/login">
          Giriş Yap
        </Button>
        <Button as={Link} href="/register">
          Kayıt Ol
        </Button>
      </>
    );
  }

  return (
    <Dropdown>
      <DropdownTrigger>
        <Button isIconOnly variant="light">
          <LucideUser />
        </Button>
      </DropdownTrigger>
      <DropdownMenu aria-label="Static Actions">
        <DropdownItem href="/account" key="profile">
          Profil
        </DropdownItem>
        <DropdownItem
          hidden={!user.roles.includes(UserRole.ADMIN)}
          href="/dashboard"
          key="dashboard"
        >
          Yönetim Paneli
        </DropdownItem>
        <DropdownItem className="text-danger" color="danger" key="logout" onPress={handleLogout}>
          Çıkış Yap
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
}
