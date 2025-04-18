import { HeroUIProvider } from "@heroui/react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { useHref, useNavigate } from "react-router";

export const Providers = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  return (
    <HeroUIProvider
      navigate={navigate}
      useHref={useHref}
      validationBehavior='native'
    >
      <NextThemesProvider
        attribute='class'
        defaultTheme='light'
      >
        {children}
      </NextThemesProvider>
    </HeroUIProvider>
  );
};
