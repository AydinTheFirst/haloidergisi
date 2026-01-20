import { Button } from "@heroui/react";
import { LucidePanelLeft } from "lucide-react";

import { useSidebarStore } from "~/store/sidebar-store";

export default function SidebarToggler() {
  const toggle = useSidebarStore((s) => s.toggle);

  return (
    <Button isIconOnly onPress={toggle} variant="light">
      <LucidePanelLeft />
    </Button>
  );
}
