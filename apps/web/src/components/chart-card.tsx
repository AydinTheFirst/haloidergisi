import type { ReactNode } from "react";

import { cn } from "@adn-ui/react";

interface ChartCardProps {
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
}

interface SurfaceProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Surface({ className = "", ...props }: SurfaceProps) {
  return (
    <div
      className={cn("bg-surface text-surface-foreground rounded px-3 py-2 shadow", className)}
      {...props}
    />
  );
}

export function ChartCard({ title, description, children, className = "" }: ChartCardProps) {
  return (
    <Surface className={cn("p-6", className)}>
      <div className='mb-4'>
        <h3 className='text-lg font-semibold'>{title}</h3>
        {description && <p className='text-muted-foreground mt-1 text-sm'>{description}</p>}
      </div>
      <div className='w-full'>{children}</div>
    </Surface>
  );
}
