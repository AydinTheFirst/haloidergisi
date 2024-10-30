import { NextUIProvider } from "@nextui-org/react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { useNavigate } from "react-router-dom";

export const Providers = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  return (
    <NextUIProvider navigate={navigate} validationBehavior="native">
      <NextThemesProvider attribute="class" defaultTheme="light">
        {children}
      </NextThemesProvider>
    </NextUIProvider>
  );
};
