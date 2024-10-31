import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Link,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenu,
  NavbarMenuItem,
  NavbarMenuToggle,
  Navbar as NextNavbar,
} from "@nextui-org/react";
import {
  LucideChartPie,
  LucideHome,
  LucideInfo,
  LucidePhone,
  LucideUser,
  LucideUsers,
} from "lucide-react";
import React from "react";
import { useLocation } from "react-router-dom";
import useSWR from "swr";

import { Logo, ThemeToggler } from "@/components";
import { useDeviceType } from "@/hooks";
import { User } from "@/types";

const menuItems = [
  {
    href: "/",
    icon: LucideHome,
    isAdmin: false,
    isAuth: false,
    label: "Anasayfa",
  },
  {
    href: "/about",
    icon: LucideInfo,
    isAdmin: false,
    isAuth: false,
    label: "Hakkımızda",
  },
  {
    href: "/contact",
    icon: LucidePhone,
    isAdmin: false,
    isAuth: false,
    label: "İletişim",
  },
  {
    href: "/team",
    icon: LucideUsers,
    isAdmin: false,
    isAuth: false,
    label: "Ekip",
  },
  {
    href: "/dashboard",
    icon: LucideChartPie,
    isAdmin: true,
    isAuth: true,
    label: "Yönetim Paneli",
  },
];

export default function Navbar() {
  const { data: me } = useSWR<User>("/auth/me", {
    onError: () => {},
  });
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const pathname = useLocation().pathname;

  const isLoggedIn = !!me;
  const isAdmin = me && me.roles.includes("ADMIN");

  const filteredMenuItems = menuItems.filter((item) => {
    if (item.isAuth && !isLoggedIn) return false;
    if (item.isAdmin && !isAdmin) return false;
    return true;
  });

  return (
    <NextNavbar
      className="bg-content1 bg-opacity-50"
      isBordered
      maxWidth="2xl"
      onMenuOpenChange={setIsMenuOpen}
      shouldHideOnScroll
    >
      <NavbarContent>
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className="sm:hidden"
        />
        <NavbarBrand as={Link} href={"/"}>
          <Logo className="h-14" />
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent className="hidden gap-4 sm:flex" justify="center">
        {filteredMenuItems.map((item, index) => (
          <NavbarItem isActive={pathname === item.href} key={index}>
            <Link color="foreground" href={item.href}>
              {item.label}
            </Link>
          </NavbarItem>
        ))}
      </NavbarContent>

      <NavbarContent justify="end">
        <NavbarItem>
          <ThemeToggler />
        </NavbarItem>
        <NavbarItem className="flex gap-1">
          <AuthItem />
        </NavbarItem>
      </NavbarContent>

      <NavbarMenu>
        {filteredMenuItems.map((item, index) => (
          <NavbarMenuItem key={`${item}-${index}`}>
            <Button
              as={Link}
              className="justify-start"
              fullWidth
              href={item.href}
              startContent={<item.icon />}
              variant="light"
            >
              <strong>{item.label}</strong>
            </Button>
          </NavbarMenuItem>
        ))}
      </NavbarMenu>
    </NextNavbar>
  );
}

const AuthItem = () => {
  const { data: me } = useSWR<User>("/auth/me", {
    onError: () => {},
  });

  const { isMobile } = useDeviceType();

  if (!me) {
    return (
      <>
        <Button as={Link} color="secondary" href="/login">
          <strong>Giriş Yap</strong>
        </Button>
        <Button
          as={Link}
          className="hidden md:flex"
          color="secondary"
          href="/register"
          variant="flat"
        >
          <strong>Kayıt Ol</strong>
        </Button>
      </>
    );
  }

  const logout = () => {
    localStorage.removeItem("token");
    location.reload();
  };

  return (
    <Dropdown>
      <DropdownTrigger>
        <Button
          color="secondary"
          isIconOnly={isMobile}
          startContent={<LucideUser />}
        >
          <strong className="mt-1 hidden md:block">{me.displayName}</strong>
        </Button>
      </DropdownTrigger>
      <DropdownMenu aria-label="Static Actions">
        <DropdownItem href="/account" key="account">
          Hesabım
        </DropdownItem>
        <DropdownItem
          className="text-danger"
          color="danger"
          key="delete"
          onClick={logout}
        >
          Çıkış Yap
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
};
