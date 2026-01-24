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
          title={getLabelForTheme(t)}
          onClick={() => setTheme(t)}
          variant={theme === t ? "secondary" : "outline"}
          {...props}
          size='sm'
        >
          <Icon icon={getIconForTheme(t)} />
        </IconButton>
      ))}
    </ButtonGroup>
  );
}

function getIconForTheme(theme: string | undefined) {
  switch (theme) {
    case "light":
      return "mdi:white-balance-sunny";
    case "dark":
      return "mdi:moon-waning-crescent";
    default:
      return "mdi:monitor";
  }
}

function getLabelForTheme(theme: string | undefined) {
  switch (theme) {
    case "light":
      return "Light mode";
    case "dark":
      return "Dark mode";
    default:
      return "System mode";
  }
}
