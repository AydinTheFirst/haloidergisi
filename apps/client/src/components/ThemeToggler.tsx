import { Button } from "@heroui/react";
import { MoonIcon, SunIcon } from "lucide-react";
import { useTheme } from "next-themes";

export const ThemeToggler = () => {
  const theme = useTheme();

  const toggleTheme = () => {
    theme.setTheme(theme.resolvedTheme === "dark" ? "light" : "dark");
  };

  const icon = theme.resolvedTheme === "dark" ? <SunIcon /> : <MoonIcon />;

  return null;

  return (
    <Button
      isIconOnly
      onPress={toggleTheme}
      variant='light'
    >
      {icon}
    </Button>
  );
};
