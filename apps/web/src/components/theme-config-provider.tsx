import { useEffect } from "react";

import { useThemeConfig } from "@/queries/use-theme-config";
import { loadGoogleFont } from "@/utils/google-fonts";

export function ThemeConfigProvider({ children }: { children: React.ReactNode }) {
  const { data: config } = useThemeConfig();

  useEffect(() => {
    if (!config) return;

    const root = document.documentElement;

    if (config.preset === "default") {
      root.style.removeProperty("--primary");
      root.style.removeProperty("--radius");
      root.style.removeProperty("--font-sans");
      document.body.style.fontFamily = "";
      return;
    }

    if (config.primaryColor) {
      root.style.setProperty("--primary", config.primaryColor);
    }
    if (config.radius) {
      root.style.setProperty("--radius", config.radius);
    }
    if (config.fontFamily) {
      loadGoogleFont(config.fontFamily);
      root.style.setProperty("--font-sans", config.fontFamily);
      document.body.style.fontFamily = config.fontFamily;
    }
  }, [config]);

  return <>{children}</>;
}
