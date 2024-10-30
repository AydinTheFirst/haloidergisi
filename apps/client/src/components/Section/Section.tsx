import { cn } from "@nextui-org/react";
import React from "react";

export const Section = ({
  children,
  height,
  className,
}: {
  children: React.ReactNode;
  height?: string;
  className?: string;
}) => {
  return (
    <>
      <section
        className={cn(
          "container flex flex-col items-center justify-center",
          className,
        )}
        style={{
          minHeight: height || "100vh",
        }}
      >
        {children}
      </section>
    </>
  );
};
