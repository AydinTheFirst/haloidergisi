import { Button, Navbar, NavbarContainer } from "@adn-ui/react";
import { Link } from "@tanstack/react-router";
import React from "react";

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
];

export default function LandingNavbar() {
  const [isOpen, setIsOpen] = React.useState(false);

  const { data: user } = useAuth();

  return (
    <Navbar
      open={isOpen}
      onOpenChange={setIsOpen}
    >
      <NavbarContainer>
        <Navbar.Content>
          <Navbar.Toggle className='md:hidden' />
          <Link
            to='/'
            className='flex items-center'
          >
            <Logo className='h-14' />
          </Link>
        </Navbar.Content>
        <Navbar.Content className='hidden justify-center md:flex'>
          {items.map((item) => (
            <Navbar.Item key={item.url}>
              <Link
                className='link'
                to={item.url}
              >
                {item.label}
              </Link>
            </Navbar.Item>
          ))}
        </Navbar.Content>
        <Navbar.Content className='justify-end'>
          {user && <AccountDropdown />}
          {!user && (
            <>
              <Navbar.Item className='hidden md:block'>
                <Button
                  variant='secondary'
                  render={<Link to='/login' />}
                >
                  Giriş Yap
                </Button>
              </Navbar.Item>
              <Navbar.Item>
                <Button
                  render={<Link to='/register' />}
                  variant='primary'
                >
                  Kayıt Ol
                </Button>
              </Navbar.Item>
            </>
          )}
        </Navbar.Content>
        <Navbar.Menu position='bottom'>
          <Navbar.MenuContent>
            <div className='py-2'>Navigasyon</div>
            <ul className='space-y-2'>
              {items.map((item) => (
                <li key={item.url}>
                  <Link
                    className='link'
                    to={item.url}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
              {!user && (
                <li className='flex items-center gap-2'>
                  <Button
                    variant='secondary'
                    render={<Link to='/login' />}
                    className='flex-1'
                  >
                    Giriş Yap
                  </Button>
                  <Button
                    className='flex-1'
                    variant='primary'
                    render={<Link to='/register' />}
                  >
                    Kayıt Ol
                  </Button>
                </li>
              )}
              <li className='flex items-center justify-between'>
                <span>Tema</span>
                <ThemeSwitcher />
              </li>
            </ul>
          </Navbar.MenuContent>
        </Navbar.Menu>
      </NavbarContainer>
    </Navbar>
  );
}
