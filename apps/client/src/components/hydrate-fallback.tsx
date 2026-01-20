import { Spinner } from "@heroui/react";

export function HydrateFallback() {
  return (
    <div className="grid h-screen place-items-center">
      <Spinner size="lg" />
    </div>
  );
}
