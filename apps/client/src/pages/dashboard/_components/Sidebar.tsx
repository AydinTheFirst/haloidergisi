import { Button, Card, Divider } from "@nextui-org/react";
import { LucidePlus } from "lucide-react";
import { Link } from "react-router-dom";

import { sidebarItems } from "./sidebarItems";
import { SidebarToggler } from "./SidebarToggler";

interface SidebarProps {
  toggleSidebar: () => void;
}

export const Sidebar = ({ toggleSidebar }: SidebarProps) => {
  return (
    <Card className="h-full min-h-screen p-3" radius="none">
      <div className="flex h-10 justify-between">
        <div className="flex w-full items-center">
          <Link to={"/"}>
            <h1 className="text-xl font-bold">Yönetim Paneli</h1>
          </Link>
        </div>
        <div className="block md:hidden">
          <SidebarToggler toggleSidebar={toggleSidebar} />
        </div>
      </div>
      <Divider className="my-3" />
      <div className="grid gap-1">
        {sidebarItems.map((item, index) => (
          <div className="flex justify-between" key={index}>
            <Button
              as={Link}
              className="justify-start"
              fullWidth
              radius="none"
              startContent={<item.icon size={20} />}
              to={item.href}
              variant="light"
            >
              <div className="mt-1">
                <strong>{item.label}</strong>
              </div>
            </Button>
            {item.canCreate && (
              <Button
                as={Link}
                isIconOnly
                radius="none"
                to={`${item.href}/new`}
                variant="light"
              >
                <LucidePlus />
              </Button>
            )}
          </div>
        ))}
      </div>
    </Card>
  );
};
