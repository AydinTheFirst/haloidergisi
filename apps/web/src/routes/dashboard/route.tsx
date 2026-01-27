import { Avatar, Card, IconButton, Sidebar } from "@adn-ui/react";
import { Icon } from "@iconify/react";
import { createFileRoute, Link, Outlet, redirect } from "@tanstack/react-router";
import { useLocation } from "@tanstack/react-router";
import { useEffect } from "react";
import { useWindowSize } from "usehooks-ts";

import ThemeSwitcher from "@/components/theme-switcher";
import { useAuth, useLogout } from "@/hooks/use-auth";
import { useSidebarStore } from "@/store/sidebar-store";

const pages = [
  { name: "Dashboard", to: "/dashboard", icon: "mdi:view-dashboard-outline" },
  { name: "Kullanıcılar", to: "/dashboard/users", icon: "mdi:account-multiple-outline" },
  { name: "Profiller", to: "/dashboard/profiles", icon: "mdi:account-circle-outline" },
  { name: "Gönderiler", to: "/dashboard/posts", icon: "mdi:post-outline" },
  { name: "Kategoriler", to: "/dashboard/categories", icon: "mdi:shape-outline" },
  { name: "Ekipler", to: "/dashboard/crews", icon: "mdi:account-group-outline" },
  { name: "Mesajlar", to: "/dashboard/messages", icon: "mdi:email" },
  { name: "Analitik", to: "/dashboard/analytics", icon: "mdi:chart-bar" },
];

export const Route = createFileRoute("/dashboard")({
  component: RouteComponent,
});

function RouteComponent() {
  useSidebarListener();

  const { data: user, isLoading } = useAuth();
  const logout = useLogout();

  const isOpen = useSidebarStore((state) => state.isOpen);
  const setIsOpen = useSidebarStore((state) => state.setIsOpen);

  if (isLoading) return null;

  console.log(user);

  if (!user || !user.roles.includes("ADMIN")) {
    return redirect({ to: "/" });
  }

  return (
    <Sidebar.Root
      isOpen={isOpen}
      onOpenChange={setIsOpen}
    >
      <Sidebar.Panel>
        <Sidebar.Header>
          <Link to='/'>Anasayfa</Link>
          <Sidebar.Trigger className='md:hidden' />
        </Sidebar.Header>
        <Sidebar.Content>
          <Sidebar.Menu>
            <Sidebar.MenuLabel>Sayfalar</Sidebar.MenuLabel>
            {pages.map((page) => (
              <Link
                key={page.to}
                to={page.to}
                activeOptions={{ exact: true }}
              >
                <Sidebar.MenuItem>
                  <Icon icon={page.icon} />
                  {page.name}
                </Sidebar.MenuItem>
              </Link>
            ))}
          </Sidebar.Menu>
        </Sidebar.Content>
        <Sidebar.Footer>
          <ThemeSwitcher />
        </Sidebar.Footer>
      </Sidebar.Panel>
      <Sidebar.Outlet className='flex-1'>
        <Card.Root className='w-full max-w-none flex-row items-center justify-between rounded-none'>
          <Card.Header className='flex-row'>
            <Sidebar.Trigger />
          </Card.Header>
          <Card.Content className='flex-row items-center justify-end'>
            <div className='flex gap-2'>
              <Avatar.Root size='sm'>
                <Avatar.Image src={user?.profile?.avatarUrl || undefined} />
                <Avatar.Fallback>AD</Avatar.Fallback>
              </Avatar.Root>
              <div className='hidden md:block'>
                <div className='text-sm font-medium'>{user?.profile?.name}</div>
                <div className='text-muted-foreground text-xs'>{user?.email}</div>
              </div>
            </div>
            <IconButton
              size='sm'
              variant='ghost'
              onClick={logout}
            >
              <Icon icon='mdi:logout' />
            </IconButton>
          </Card.Content>
        </Card.Root>
        <div className='container max-w-none py-10'>
          <Outlet />
        </div>
      </Sidebar.Outlet>
    </Sidebar.Root>
  );
}

function useSidebarListener() {
  const setIsOpen = useSidebarStore((state) => state.setIsOpen);
  const { width = 0 } = useWindowSize();
  const { pathname } = useLocation();

  useEffect(() => {
    if (width <= 768) setIsOpen(false);
  }, [width, setIsOpen, pathname]);

  return null;
}
