import { cn } from "@heroui/react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export interface MarkdownContentProps {
  children: string;
  className?: string;
}

export const MarkdownContent: React.FC<MarkdownContentProps> = ({ children, className }) => {
  return (
    <div className={cn("prose max-w-none", className)}>
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{children}</ReactMarkdown>
    </div>
  );
};
