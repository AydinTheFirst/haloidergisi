import { Icon } from "@iconify/react";
import { Link } from "@tanstack/react-router";

import { buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth, useLogout } from "@/hooks/use-auth";

export default function AccountDropdown() {
  const { data: user } = useAuth();
  const logout = useLogout();

  if (!user) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className={buttonVariants({ variant: "outline" })}>
        <Icon icon='mdi:account-circle-outline' />
        <span className='hidden md:block'>{user.profile?.name}</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className='gap-1'
        align='end'
      >
        <div className='space-y-2 px-3 py-2'>
          <DropdownMenuItem asChild>
            <Link to='/account'>
              <Icon icon='mdi:cog-outline' />
              Hesap Ayarları
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link to='/articles'>
              <Icon icon='mdi:file-document-edit-outline' />
              Yazı Gönder
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link to='/articles/my'>
              <Icon icon='mdi:file-document-outline' />
              Yazılarım
            </Link>
          </DropdownMenuItem>
          {user.roles.includes("ADMIN") && (
            <DropdownMenuItem asChild>
              <Link to='/dashboard'>
                <Icon icon='mdi:shield-account-outline' />
                Yönetici Paneli
              </Link>
            </DropdownMenuItem>
          )}
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className='text-destructive focus:text-destructive'
            onClick={logout}
          >
            <Icon icon='mdi:logout' />
            Çıkış Yap
          </DropdownMenuItem>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
