import { Button } from "@nextui-org/react";
import { MenuIcon } from "lucide-react";

export const SidebarToggler = ({
  toggleSidebar,
}: {
  toggleSidebar: () => void;
}) => {
  return (
    <Button isIconOnly onClick={toggleSidebar} variant="light">
      <MenuIcon size={20} />
    </Button>
  );
};
