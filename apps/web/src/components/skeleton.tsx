import { cn } from "@adn-ui/react";

interface SkeletonProps extends React.ComponentProps<"div"> {}

export function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      className={cn(`animate-pulse bg-gray-300 dark:bg-gray-700`, className)}
      {...props}
    />
  );
}
