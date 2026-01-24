import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/users/$userId")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/dashboard/users/$userId"!</div>;
}
