import { Icon } from "@iconify/react";
import { createFileRoute, Link, Outlet, redirect } from "@tanstack/react-router";
import { useLocation } from "@tanstack/react-router";
import { useEffect } from "react";
import { useWindowSize } from "usehooks-ts";

import ThemeSwitcher from "@/components/theme-switcher";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
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
    <SidebarProvider
      open={isOpen}
      onOpenChange={setIsOpen}
    >
      <Sidebar>
        <SidebarHeader>
          <div className='flex h-12 items-center px-4'>
            <Link
              to='/'
              className='text-lg font-bold'
            >
              Anasayfa
            </Link>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Sayfalar</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {pages.map((page) => (
                  <SidebarMenuItem key={page.to}>
                    <SidebarMenuButton asChild>
                      <Link
                        to={page.to}
                        activeOptions={{ exact: true }}
                        className='[&.active]:bg-sidebar-accent [&.active]:text-sidebar-accent-foreground'
                      >
                        <Icon icon={page.icon} />
                        <span>{page.name}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <ThemeSwitcher />
        </SidebarFooter>
      </Sidebar>
      <SidebarInset className='flex flex-1 flex-col'>
        <Card className='flex w-full max-w-none flex-row items-center justify-between rounded-none border-x-0 border-t-0'>
          <CardHeader className='flex-row p-4'>
            <SidebarTrigger />
          </CardHeader>
          <CardContent className='flex-row items-center justify-end gap-4 p-4'>
            <div className='flex gap-2'>
              <Avatar className='size-8'>
                <AvatarImage src={user?.profile?.avatarUrl || undefined} />
                <AvatarFallback>AD</AvatarFallback>
              </Avatar>
              <div className='hidden md:block'>
                <div className='text-sm font-medium'>{user?.profile?.name}</div>
                <div className='text-muted-foreground text-xs'>{user?.email}</div>
              </div>
            </div>
            <Button
              size='icon-sm'
              variant='ghost'
              onClick={logout}
            >
              <Icon icon='mdi:logout' />
            </Button>
          </CardContent>
        </Card>
        <div className='container max-w-none py-10'>
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
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
