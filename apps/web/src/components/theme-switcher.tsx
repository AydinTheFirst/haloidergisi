import { ButtonGroup, IconButton } from "@adn-ui/react";
import { Icon } from "@iconify/react";
import { useTheme } from "next-themes";

interface ThemeSwitcherProps extends React.ComponentProps<typeof IconButton> {}
export default function ThemeSwitcher({ ...props }: ThemeSwitcherProps) {
  const { themes, setTheme, theme } = useTheme();

  return (
    <ButtonGroup>
      {themes?.map((t) => (
        <IconButton
          key={t}
          title={ThemeLabel[t]}
          onClick={() => setTheme(t)}
          variant={theme === t ? "secondary" : "outline"}
          {...props}
          size='sm'
        >
          <Icon icon={ThemeIcon[t]} />
        </IconButton>
      ))}
    </ButtonGroup>
  );
}

const ThemeIcon: Record<string, string> = {
  light: "mdi:white-balance-sunny",
  dark: "mdi:moon-waning-crescent",
  system: "mdi:monitor",
};

const ThemeLabel: Record<string, string> = {
  light: "Light mode",
  dark: "Dark mode",
  system: "System mode",
};
