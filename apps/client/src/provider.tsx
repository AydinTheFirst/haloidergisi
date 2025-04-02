import { HeroUIProvider } from "@heroui/react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { useNavigate } from "react-router";

export const Providers = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  return (
    <HeroUIProvider navigate={navigate} validationBehavior="native">
      <NextThemesProvider attribute="class" defaultTheme="light">
        {children}
      </NextThemesProvider>
    </HeroUIProvider>
  );
};
