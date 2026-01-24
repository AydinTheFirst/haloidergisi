import { Avatar, Card, IconButton, Sidebar } from "@adn-ui/react";
import { Icon } from "@iconify/react";
import { createFileRoute, Link, Navigate, Outlet } from "@tanstack/react-router";

import { useAuth, useLogout } from "@/hooks/use-auth";

const pages = [
  { name: "Dashboard", to: "/dashboard", icon: "mdi:view-dashboard-outline" },
  { name: "Kullanıcılar", to: "/dashboard/users", icon: "mdi:account-multiple-outline" },
  { name: "Gönderiler", to: "/dashboard/posts", icon: "mdi:post-outline" },
];

export const Route = createFileRoute("/dashboard")({
  component: RouteComponent,
});

function RouteComponent() {
  const { data: user } = useAuth();
  const logout = useLogout();

  if (!user) return null;

  if (!user.roles.includes("ADMIN")) return <Navigate to='/' />;

  return (
    <Sidebar.Root>
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
      </Sidebar.Panel>
      <Sidebar.Outlet className='flex-1'>
        <Card.Root className='w-full max-w-none flex-row items-center justify-between rounded-none'>
          <Card.Header className='flex-row'>
            <Sidebar.Trigger />
          </Card.Header>
          <Card.Content className='flex-row items-center justify-end'>
            <div className='flex gap-2'>
              <Avatar.Root size='sm'>
                <Avatar.Image src={user.profile?.avatarUrl || undefined} />
                <Avatar.Fallback>AD</Avatar.Fallback>
              </Avatar.Root>
              <div className='hidden md:block'>
                <div className='text-sm font-medium'>{user.profile?.name}</div>
                <div className='text-muted-foreground text-xs'>{user.email}</div>
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
        <div className='container max-w-none'>
          <Outlet />
        </div>
      </Sidebar.Outlet>
    </Sidebar.Root>
  );
}
