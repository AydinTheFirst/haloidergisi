import { Icon } from "@iconify/react";
import * as React from "react";

import { cn } from "@/lib/utils";

function Spinner({ className, ...props }: React.ComponentProps<typeof Icon>) {
  return (
    <Icon
      icon='lucide:loader-2'
      className={cn("animate-spin", className)}
      {...props}
    />
  );
}

export { Spinner };
