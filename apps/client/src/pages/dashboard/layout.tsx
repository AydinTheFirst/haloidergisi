import {
  Button,
  type ButtonProps,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Link,
  Navbar,
  NavbarContent
} from "@heroui/react";
import { UserCard } from "~/components/user-card";
import { useAuth } from "~/hooks/use-auth";
import { cdnSource } from "~/lib/utils";
import { useSidebarStore } from "~/store/sidebar-store";
import {
  LucideChartPie,
  LucideFile,
  LucideFiles,
  LucideMessageSquare,
  LucideNewspaper,
  LucideSmile,
  LucideUser,
  LucideUsers
} from "lucide-react";
import { Outlet } from "react-router";

import SidebarToggler from "./sidebar-toggler";

const SIDEBAR_WIDTH = 320;

export default function DashboardLayout() {
  const isOpen = useSidebarStore((s) => s.isOpen);

  return (
    <div className='flex h-screen overflow-hidden'>
      <Card
        className='bg-content2 h-full'
        radius='none'
        shadow='none'
        style={{
          marginLeft: isOpen ? 0 : -SIDEBAR_WIDTH,
          transition: "margin-left 0.3s ease-in-out",
          width: SIDEBAR_WIDTH
        }}
      >
        <CardHeader className='justify-between'>
          <h2 className='text-xl font-semibold'>Yönetim Paneli</h2>
          <SidebarToggler />
        </CardHeader>
        <CardBody>
          <ul className='grid gap-1'>
            <li>
              <SidebarItem href='/dashboard'>
                <LucideChartPie />
                Anasayfa
              </SidebarItem>
            </li>
            <li>
              <SidebarItem href='/dashboard/news'>
                <LucideNewspaper />
                Haberler
              </SidebarItem>
            </li>
            <li>
              <SidebarItem href='/dashboard/posts'>
                <LucideFile />
                Dergiler
              </SidebarItem>
            </li>
            <li>
              <SidebarItem href='/dashboard/categories'>
                <LucideFiles />
                Kategoriler
              </SidebarItem>
            </li>
            <li>
              <SidebarItem href='/dashboard/users'>
                <LucideUser />
                Kullanıcılar
              </SidebarItem>
            </li>
            <li>
              <SidebarItem href='/dashboard/squads'>
                <LucideUsers />
                Ekipler
              </SidebarItem>
            </li>
            <li>
              <SidebarItem href='/dashboard/reactions'>
                <LucideSmile />
                Reactions
              </SidebarItem>
            </li>
            <li>
              <SidebarItem href='/dashboard/comments'>
                <LucideMessageSquare />
                Yorumlar
              </SidebarItem>
            </li>
          </ul>
        </CardBody>
        <CardFooter>
          <UserDisplay />
        </CardFooter>
      </Card>
      <div className='h-screen flex-1 overflow-auto'>
        <DashboardNav />
        <main className='container py-10'>
          <Outlet />
        </main>
      </div>
    </div>
  );
}

function DashboardNav() {
  const isOpen = useSidebarStore((s) => s.isOpen);

  return (
    <Navbar
      className='bg-content2'
      maxWidth='full'
    >
      <NavbarContent justify='start'>
        {!isOpen && <SidebarToggler />}
      </NavbarContent>
    </Navbar>
  );
}

function SidebarItem(props: ButtonProps) {
  const newProps = {
    ...props,
    as: Link,
    className: "flex justify-start font-semibold",
    fullWidth: true,
    variant: "light"
  } as ButtonProps;

  return <Button {...newProps} />;
}

function UserDisplay() {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <Dropdown>
      <DropdownTrigger>
        <button className='flex w-full cursor-pointer justify-start'>
          <UserCard
            avatarProps={{
              ...(user.profile?.avatarUrl && {
                src: cdnSource(user.profile.avatarUrl)
              })
            }}
            description={user.email}
            name={user.profile?.displayName}
          />
        </button>
      </DropdownTrigger>
      <DropdownMenu>
        <DropdownItem
          href='/'
          key='home'
        >
          Anasayfa
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
}
