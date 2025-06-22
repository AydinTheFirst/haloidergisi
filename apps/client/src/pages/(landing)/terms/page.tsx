import markdown from "~/assets/md/terms.md?raw";
import { MarkdownContent } from "~/components/markdown-content";

export default function Terms() {
  return (
    <div className='container py-20'>
      <div className='prose mx-auto'>
        <MarkdownContent>{markdown}</MarkdownContent>
      </div>
    </div>
  );
}
