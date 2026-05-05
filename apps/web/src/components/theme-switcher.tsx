import { Icon } from "@iconify/react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";

interface ThemeSwitcherProps extends React.ComponentProps<typeof Button> {}
export default function ThemeSwitcher({ ...props }: ThemeSwitcherProps) {
  const { themes, setTheme, theme } = useTheme();

  return (
    <div className='flex items-center gap-1'>
      {themes?.map((t) => (
        <Button
          key={t}
          title={ThemeLabel[t]}
          onClick={() => setTheme(t)}
          variant={theme === t ? "secondary" : "outline"}
          {...props}
          size='icon-sm'
        >
          <Icon icon={ThemeIcon[t]} />
        </Button>
      ))}
    </div>
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
