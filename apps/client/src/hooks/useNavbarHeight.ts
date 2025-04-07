import { useEffect, useState } from "react";

export function useNavbarHeight() {
  const [navbarHeight, setNavbarHeight] = useState(0);

  useEffect(() => {
    const navbar = document.getElementById("navbar");

    const updateNavbarHeight = () => {
      if (!navbar) return;
      setNavbarHeight(navbar.offsetHeight);
    };

    updateNavbarHeight();
    window.addEventListener("resize", updateNavbarHeight);

    // Temizleme işlemi
    return () => {
      window.removeEventListener("resize", updateNavbarHeight);
    };
  }, []);

  return navbarHeight;
}
