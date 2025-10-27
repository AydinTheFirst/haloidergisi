import {
  Button,
  Divider,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  Navbar as HeroNavbar,
  Link,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  useDisclosure
} from "@heroui/react";
import Logo from "~/components/logo";
import { useLayoutStore } from "~/store/layout-store";
import { LucideMenu, LucideX } from "lucide-react";
import { useEffect, useRef } from "react";

import AuthItems from "./auth-items";

const navbarItems = [
  {
    href: "/",
    label: "Anasayfa"
  },
  {
    href: "/posts",
    label: "Dergiler"
  },
  {
    href: "/about",
    label: "Hakkımızda"
  },
  {
    href: "/contact",
    label: "İletişim"
  },
  {
    href: "/team",
    label: "Ekip"
  }
];

export default function Navbar() {
  const navbarRef = useRef<HTMLDivElement>(null);
  const setNavbarHeight = useLayoutStore((s) => s.setNavbarHeight);

  useEffect(() => {
    const updateHeight = () => {
      setNavbarHeight(navbarRef.current?.offsetHeight || 0);
    };

    updateHeight();
    window.addEventListener("resize", updateHeight);
    return () => window.removeEventListener("resize", updateHeight);
  }, [setNavbarHeight]);

  return (
    <HeroNavbar
      maxWidth='2xl'
      ref={navbarRef}
    >
      <NavbarContent justify='start'>
        <NavbarBrand>
          <Link
            color='foreground'
            href='/'
          >
            <Logo className='h-14' />
            <span className='sr-only'>Halo</span>
          </Link>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent justify='end'>
        <div className='hidden md:flex md:gap-4'>
          {navbarItems.map((item) => (
            <NavbarItem key={item.href}>
              <Link
                color='foreground'
                href={item.href}
              >
                {item.label}
              </Link>
            </NavbarItem>
          ))}
        </div>
        <Divider
          className='hidden h-6 md:block'
          orientation='vertical'
        />
        <div className='flex gap-2'>
          <AuthItems />
        </div>
        <div className='md:hidden'>
          <NavbarDrawer />
        </div>
      </NavbarContent>
    </HeroNavbar>
  );
}

function NavbarDrawer() {
  const { isOpen, onClose, onOpen, onOpenChange } = useDisclosure();

  return (
    <>
      <Button
        isIconOnly
        onPress={onOpen}
        variant='light'
      >
        <LucideMenu />
      </Button>
      <Drawer
        closeButton={<div />}
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        placement='bottom'
      >
        <DrawerContent>
          <DrawerHeader className='flex items-center justify-between'>
            <Logo className='h-14' />
            <Button
              isIconOnly
              onPress={onClose}
              variant='light'
            >
              <LucideX />
            </Button>
          </DrawerHeader>
          <DrawerBody className='mb-10'>
            <div className='flex flex-col gap-3'>
              {navbarItems.map((item) => (
                <Link
                  color='foreground'
                  href={item.href}
                  key={item.href}
                  onPress={onClose}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
}
