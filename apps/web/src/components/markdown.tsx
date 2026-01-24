import { cn } from "@adn-ui/react";
import ReactMarkdown from "react-markdown";

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
