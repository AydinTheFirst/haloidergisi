import { cn } from "@adn-ui/react";

export interface Breadcrumbs extends React.ComponentProps<"ol"> {}

export const Breadcrumb = ({ children, className, ...props }: Breadcrumbs) => {
  return (
    <ol
      {...props}
      className={cn("breadcrumb", className)}
    >
      {children}
    </ol>
  );
};

export interface BreadcrumbItem extends React.ComponentProps<"li"> {}
export const BreadcrumbItem = ({ children, className, ...props }: BreadcrumbItem) => {
  return (
    <li
      className={cn("breadcrumb__item", className)}
      {...props}
    >
      {children}
    </li>
  );
};
