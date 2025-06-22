import markdown from "~/assets/md/terms.md?raw";
import { MarkdownContent } from "~/components/markdown-content";

import type { Route } from "./+types/page";

export const meta: Route.MetaFunction = () => {
  return [
    {
      title: "HALO Dergisi - Kullanım Şartları"
    }
  ];
};

export default function Terms() {
  return (
    <div className='container py-20'>
      <div className='prose mx-auto'>
        <MarkdownContent>{markdown}</MarkdownContent>
      </div>
    </div>
  );
}
