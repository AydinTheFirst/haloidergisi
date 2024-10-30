import React from "react";
import { NavbarComponent } from "./Navbar";
import { useTheme } from "next-themes";
import { Switch } from "@nextui-org/react";
import { FaSun, FaMoon } from "react-icons/fa";
import { Footer } from "./Footer";

export const HomeLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <NavbarComponent />
      <main>{children}</main>
      <ThemeController />
      <Footer />
    </>
  );
};

const ThemeController = () => {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return;

  return (
    <Switch
      className="fixed bottom-4 right-4"
      defaultSelected={theme !== "dark"}
      startContent={<FaSun />}
      endContent={<FaMoon />}
      onChange={toggleTheme}
    />
  );
};
