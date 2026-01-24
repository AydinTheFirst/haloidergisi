import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_landing/team")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className='bg-surface'>
      <div className='container'>
        <div className='grid auto-cols-max grid-flow-col'>
          <div className='flex justify-start'>LOGO</div>
          <div className='flex justify-center'>LINKS</div>
          <div className='flex justify-end'>ACTIONS</div>
        </div>
      </div>
    </div>
  );
}
