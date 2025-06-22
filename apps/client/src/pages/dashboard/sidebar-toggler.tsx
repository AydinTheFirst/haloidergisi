import { Button } from "@heroui/react";
import { useSidebarStore } from "~/store/sidebar-store";
import { LucidePanelLeft } from "lucide-react";

export default function SidebarToggler() {
  const toggle = useSidebarStore((s) => s.toggle);

  return (
    <Button
      isIconOnly
      onPress={toggle}
      variant='light'
    >
      <LucidePanelLeft />
    </Button>
  );
}
