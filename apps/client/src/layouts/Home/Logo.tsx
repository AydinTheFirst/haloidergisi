import { useTheme } from "next-themes";
import React, { useMemo, useEffect } from "react";

export const Logo = () => {
  const logos = useMemo(() => {
    return {
      dark: "/halo-dark.png",
      light: "/halo-light.png",
    };
  }, []);

  const [logo, setLogo] = React.useState(logos.dark);

  const { theme } = useTheme();

  useEffect(() => {
    setLogo(theme === "dark" ? logos.dark : logos.light);
  }, [theme, logos]);

  return <img src={logo} alt="HALO" className="h-24" />; // Fix: Remove .dark from logo
};
