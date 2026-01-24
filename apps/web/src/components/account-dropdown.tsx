import { buttonVariants, Menu } from "@adn-ui/react";
import { Icon } from "@iconify/react";
import { Link } from "@tanstack/react-router";

import { useAuth, useLogout } from "@/hooks/use-auth";

export default function AccountDropdown() {
  const { data: user } = useAuth();
  const logout = useLogout();

  if (!user) return null;

  return (
    <Menu.Root>
      <Menu.Trigger className={buttonVariants({ variant: "outline" })}>
        <Icon icon='mdi:account-circle-outline' />
        <span className='hidden md:block'>{user.profile?.name}</span>
      </Menu.Trigger>
      <Menu.Portal>
        <Menu.Positioner>
          <Menu.Popup className='gap-1'>
            <div className='space-y-2 px-3 py-2'>
              <Menu.Item render={<Link to='/account' />}>
                <Icon icon='mdi:cog-outline' />
                Hesap Ayarları
              </Menu.Item>
              {user.roles.includes("ADMIN") && (
                <Menu.Item render={<Link to='/dashboard' />}>
                  <Icon icon='mdi:shield-account-outline' />
                  Yönetici Paneli
                </Menu.Item>
              )}
              <Menu.Separator />
              <Menu.Item
                className='text-danger'
                onClick={logout}
              >
                <Icon icon='mdi:logout' />
                Çıkış Yap
              </Menu.Item>
            </div>
          </Menu.Popup>
        </Menu.Positioner>
      </Menu.Portal>
    </Menu.Root>
  );
}
