import {
  Button,
  Link,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenu,
  NavbarMenuItem,
  NavbarMenuToggle,
  Navbar as NextNavbar
} from "@heroui/react";
import { useEffect, useState } from "react";
import { useLocation } from "react-router";

import { Logo, ThemeToggler } from "@/components";
import { UserDisplay } from "@/components/UserDisplay";
import { useAuth } from "@/providers/AuthProvider";

const menuItems = [
  {
    href: "/",
    isAuth: false,
    label: "Anasayfa"
  },
  {
    href: "/posts",
    isAuth: false,
    label: "Dergiler"
  },
  {
    href: "/news",
    isAuth: false,
    label: "Haberler"
  },
  {
    href: "/about",
    isAuth: false,
    label: "Hakkımızda"
  },
  {
    href: "/contact",
    isAuth: false,
    label: "İletişim"
  },
  {
    href: "/team",
    isAuth: false,
    label: "Ekip"
  }
];

export default function Navbar() {
  const [scrollY, setScrollY] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const { isLoggedIn } = useAuth();
  const { pathname } = useLocation();

  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const filteredMenuItems = menuItems.filter((item) => {
    if (item.isAuth && !isLoggedIn) return false;
    return true;
  });

  return (
    <NextNavbar
      className='bg-content2'
      id='navbar'
      isBordered={scrollY > 20}
      isMenuOpen={isMenuOpen}
      onMenuOpenChange={setIsMenuOpen}
      shouldHideOnScroll
    >
      <NavbarContent>
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className='sm:hidden'
        />

        <NavbarBrand
          as={Link}
          className='min-w-fit max-w-fit'
          href='/'
        >
          <Logo className='h-14' />
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent justify='center'>
        <div className='hidden sm:flex sm:gap-4'>
          {filteredMenuItems.map((item, index) => (
            <NavbarItem
              isActive={pathname === item.href}
              key={index}
            >
              <Link
                color='foreground'
                href={item.href}
              >
                {item.label}
              </Link>
            </NavbarItem>
          ))}
        </div>
      </NavbarContent>

      <NavbarContent justify='end'>
        <NavbarItem>
          <ThemeToggler />
        </NavbarItem>
        <NavbarItem className='flex gap-1'>
          <UserDisplay />
        </NavbarItem>
      </NavbarContent>

      <NavbarMenu>
        {filteredMenuItems.map((item, index) => (
          <NavbarMenuItem key={`${item}-${index}`}>
            <Button
              as={Link}
              className='justify-start'
              fullWidth
              href={item.href}
              variant='light'
            >
              <strong>{item.label}</strong>
            </Button>
          </NavbarMenuItem>
        ))}
      </NavbarMenu>
    </NextNavbar>
  );
}
