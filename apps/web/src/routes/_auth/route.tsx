import { createFileRoute, Outlet } from "@tanstack/react-router";

import LandingFooter from "@/components/landing/footer";

export const Route = createFileRoute("/_auth")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className='flex flex-col'>
      <main className='flex-1'>
        <Outlet />
      </main>
      <LandingFooter />
    </div>
  );
}
