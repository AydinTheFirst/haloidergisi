import markdown from "~/assets/md/privacy.md?raw";
import { MarkdownContent } from "~/components/markdown-content";

import type { Route } from "./+types/page";

export const meta: Route.MetaFunction = () => {
  return [
    {
      title: "HALO Dergisi - Gizlilik Politikası"
    }
  ];
};

export default function Privacy() {
  return (
    <div className='container py-20'>
      <div className='prose mx-auto'>
        <MarkdownContent>{markdown}</MarkdownContent>
      </div>
    </div>
  );
}
