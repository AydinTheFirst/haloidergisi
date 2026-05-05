import ReactMarkdown from "react-markdown";

import { cn } from "@/lib/utils";

interface MarkdownProps extends React.ComponentProps<"article"> {
  children: string;
}

export default function Markdown({ children, className, ...props }: MarkdownProps) {
  return (
    <article
      className={cn("prose dark:prose-invert max-w-none", className)}
      {...props}
    >
      <ReactMarkdown>{children}</ReactMarkdown>
    </article>
  );
}
