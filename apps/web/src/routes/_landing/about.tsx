import { createFileRoute } from "@tanstack/react-router";

import Markdown from "@/components/markdown";
import content from "@/contents/about.md?raw";

export const Route = createFileRoute("/_landing/about")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className='container max-w-3xl py-20'>
      <Markdown>{content}</Markdown>
    </div>
  );
}
