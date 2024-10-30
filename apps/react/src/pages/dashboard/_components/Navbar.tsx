import { Card } from "@nextui-org/react";

import { ThemeToggler } from "@/components";
import { UserDisplay } from "@/components/UserDisplay";

import { SidebarToggler } from "./SidebarToggler";

interface NavbarProps {
  toggleSidebar: () => void;
}

export const Navbar = ({ toggleSidebar }: NavbarProps) => {
  return (
    <Card className="p-3" radius="none">
      <div className="flex justify-between gap-3">
        <SidebarToggler toggleSidebar={toggleSidebar} />
        <div className="flex items-center gap-3">
          <ThemeToggler />
          <UserDisplay />
        </div>
      </div>
    </Card>
  );
};
