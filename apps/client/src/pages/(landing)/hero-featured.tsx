import { useLayoutStore } from "~/store/layout-store";

export default function HeroFeatured() {
  const navbarHeight = useLayoutStore((s) => s.navbarHeight);

  return (
    <div
      className="relative w-full"
      style={{
        height: `calc(100vh - ${navbarHeight}px)`,
      }}
    >
      <img alt="29 Ekim Blurred" className="absolute inset-0 h-full w-full blur" src="hero.png" />
      <img
        alt="29 Ekim Desktop"
        className="absolute inset-0 h-full w-full object-contain"
        src="hero.png"
      />
      <img
        alt="29 Ekim Mobile"
        className="absolute inset-0 h-full w-full object-contain md:hidden"
        src="hero-mobile.png"
      />
    </div>
  );
}
