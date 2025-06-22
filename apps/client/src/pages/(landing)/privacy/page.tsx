import markdown from "~/assets/md/privacy.md?raw";
import { MarkdownContent } from "~/components/markdown-content";

export default function Privacy() {
  return (
    <div className='container py-20'>
      <div className='prose mx-auto'>
        <MarkdownContent>{markdown}</MarkdownContent>
      </div>
    </div>
  );
}
