import type { MetaFunction } from "react-router";

import markdown from "~/assets/md/about.md?raw";
import { MarkdownContent } from "~/components/markdown-content";

export const meta: MetaFunction = () => {
  return [
    {
      description:
        "HALO Dergisi, bölümümüze ve öğrencilerimize katkı sağlamak amacıyla, diğer fakülteler dahil olmak üzere; ortaya bir fikir- edebiyat dergisi sunmak için bir araya gelmiş bir grup öğrencidir.",
      title: "HALO Dergisi - Hakkında"
    }
  ];
};

export default function About() {
  return (
    <div className='container py-20'>
      <div className='prose mx-auto'>
        <MarkdownContent>{markdown}</MarkdownContent>
      </div>
    </div>
  );
}
