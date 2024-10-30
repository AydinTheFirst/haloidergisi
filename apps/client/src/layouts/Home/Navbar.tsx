import { useEffect, useRef, useState } from "react";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Link,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem,
} from "@nextui-org/react";
import { Logo } from "./Logo";
import { navbarHeightSignal } from "@/lib/signals";
import { useHTTP } from "@/hooks";
import { IUser } from "@/types";

const menuItems = [
  {
    label: "Ana Sayfa",
    href: "/",
  },
  {
    label: "Hakkımızda",
    href: "/about",
  },
  {
    label: "İletişim",
    href: "/contact",
  },
  {
    label: "Takımımız",
    href: "/team",
  },
];

export const NavbarComponent = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const navbarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);

    if (navbarRef.current) {
      navbarHeightSignal.value = navbarRef.current.clientHeight;
    }

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <Navbar
      id="navbar"
      ref={navbarRef}
      className="p-6"
      style={{
        transition: "all 0.5s",
      }}
      shouldHideOnScroll
      isBordered={isScrolled}
      onMenuOpenChange={setIsMenuOpen}
    >
      <NavbarBrand className="flex justify-center md:justify-start">
        <Link href="/" color="foreground">
          <Logo />
        </Link>
      </NavbarBrand>

      <NavbarMenuToggle
        aria-label={isMenuOpen ? "Close menu" : "Open menu"}
        className="sm:hidden"
      />

      <NavbarContent justify="center" className="hidden sm:flex">
        {menuItems.map((item, i) => (
          <NavbarItem key={i}>
            <Link href={item.href} color="foreground">
              {item.label}
            </Link>
          </NavbarItem>
        ))}

        <UserRoutes />
      </NavbarContent>

      <NavbarMenu>
        {menuItems.map((item, index) => (
          <NavbarMenuItem key={index}>
            <Link href={item.href} color="foreground">
              {item.label}
            </Link>
          </NavbarMenuItem>
        ))}

        <UserRoutes />
      </NavbarMenu>
    </Navbar>
  );
};

const UserRoutes = () => {
  const { data: user } = useHTTP<IUser>("/users/@me", {
    onError: () => null,
  });

  const logout = async () => {
    localStorage.removeItem("token");
    location.href = "/";
  };

  if (!user) {
    return (
      <>
        <NavbarMenuItem>
          <Link href="/login" color="success">
            Giriş Yap
          </Link>
        </NavbarMenuItem>
      </>
    );
  }

  return (
    <>
      <NavbarMenuItem>
        <Link href="/profile" color="secondary">
          Profil
        </Link>
      </NavbarMenuItem>

      {user.isAdmin && (
        <NavbarMenuItem>
          <Link href="/dashboard" color="primary">
            Admin
          </Link>
        </NavbarMenuItem>
      )}

      <NavbarMenuItem>
        <Link href="#" onClick={logout} color="danger">
          Çıkış Yap
        </Link>
      </NavbarMenuItem>
    </>
  );
};
