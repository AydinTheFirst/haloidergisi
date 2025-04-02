import { cn } from "@heroui/react";
import { useTheme } from "next-themes";

interface LogoProps {
  className?: string;
}
export const Logo = ({ className }: LogoProps) => {
  const { theme } = useTheme();
  const lightLogo = "/halo-light.png";
  const darkLogo = "/halo-dark.png";

  return (
    <img
      alt="Halo Logo"
      className={cn(className)}
      src={theme === "dark" ? darkLogo : lightLogo}
    />
  );
};
