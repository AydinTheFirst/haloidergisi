import React from "react";

import { cn } from "@/lib/utils";

interface TurnstileProps extends React.HTMLAttributes<HTMLDivElement> {
  onVerify: (token: string) => void;
}

export function Turnstile({ onVerify, className, ...props }: TurnstileProps) {
  const widgetRef = React.useRef<HTMLDivElement>(null);
  const onVerifyRef = React.useRef(onVerify);

  React.useEffect(() => {
    onVerifyRef.current = onVerify;
  }, [onVerify]);

  React.useEffect(() => {
    if (!widgetRef.current) return;

    const widgetId = window.turnstile?.render(widgetRef.current, {
      sitekey: import.meta.env.VITE_TURNSTILE_SITE_KEY,
      callback: (token: string) => {
        onVerifyRef.current(token);
      },
    });

    return () => {
      window.turnstile?.remove(widgetId!);
    };
  }, []);

  return (
    <div
      ref={widgetRef}
      className={cn("mx-auto", className)}
      {...props}
    />
  );
}
