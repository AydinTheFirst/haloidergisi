import markdown from "~/assets/md/about.md?raw";
import { MarkdownContent } from "~/components/markdown-content";

export default function About() {
  return (
    <div className='container py-20'>
      <div className='prose mx-auto'>
        <MarkdownContent>{markdown}</MarkdownContent>
      </div>
    </div>
  );
}
