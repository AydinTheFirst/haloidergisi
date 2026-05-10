import { Link } from "@tanstack/react-router";
import { Menu } from "lucide-react";
import React from "react";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useAuth } from "@/hooks/use-auth";

import AccountDropdown from "../account-dropdown";
import Logo from "../logo";
import ThemeSwitcher from "../theme-switcher";

const items = [
  {
    url: "/posts",
    label: "Dergiler",
  },
  {
    url: "/about",
    label: "Hakkımızda",
  },
  {
    url: "/contact",
    label: "İletişim",
  },
  {
    url: "/team",
    label: "Ekibimiz",
  },
  {
    url: "/archive",
    label: "Arşiv",
  },
];

export default function LandingNavbar() {
  const [isOpen, setIsOpen] = React.useState(false);

  const { data: user } = useAuth();

  return (
    <nav className='bg-background/95 supports-backdrop-filter:bg-background/60 sticky top-0 z-50 w-full border-b backdrop-blur-sm'>
      <div className='container flex h-16 items-center justify-between px-4 md:px-8'>
        <div className='flex items-center gap-4'>
          <Sheet
            open={isOpen}
            onOpenChange={setIsOpen}
          >
            <SheetTrigger asChild>
              <Button
                variant='ghost'
                size='icon'
                className='md:hidden'
              >
                <Menu className='size-5' />
                <span className='sr-only'>Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side='left'>
              <SheetHeader>
                <SheetTitle>
                  <Logo className='h-10' />
                </SheetTitle>
              </SheetHeader>
              <div className='flex flex-col gap-4 py-8'>
                {items.map((item) => (
                  <Link
                    key={item.url}
                    to={item.url}
                    className='hover:text-primary text-lg font-medium'
                    onClick={() => setIsOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}
                <div className='mt-4 flex flex-col gap-2'>
                  {!user && (
                    <>
                      <Button
                        variant='outline'
                        asChild
                        className='w-full'
                      >
                        <Link
                          to='/login'
                          onClick={() => setIsOpen(false)}
                        >
                          Giriş Yap
                        </Link>
                      </Button>
                      <Button
                        asChild
                        className='w-full'
                      >
                        <Link
                          to='/register'
                          onClick={() => setIsOpen(false)}
                        >
                          Kayıt Ol
                        </Link>
                      </Button>
                    </>
                  )}
                </div>
                <div className='mt-auto flex items-center justify-between'>
                  <span>Tema</span>
                  <ThemeSwitcher />
                </div>
              </div>
            </SheetContent>
          </Sheet>
          <Link
            to='/'
            className='flex items-center'
          >
            <Logo className='h-12' />
          </Link>
        </div>

        <div className='hidden md:flex md:items-center md:gap-6'>
          {items.map((item) => (
            <Link
              key={item.url}
              to={item.url}
              className='hover:text-primary text-sm font-medium transition-colors'
            >
              {item.label}
            </Link>
          ))}
        </div>

        <div className='flex items-center gap-4'>
          {user && <AccountDropdown />}
          {!user && (
            <>
              <Button
                variant='ghost'
                asChild
                className='hidden md:flex'
              >
                <Link to='/login'>Giriş Yap</Link>
              </Button>
              <Button asChild>
                <Link to='/register'>Kayıt Ol</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
