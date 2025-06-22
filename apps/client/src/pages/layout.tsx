import { HeroUIProvider } from "@heroui/react";
import LoadingBar from "~/components/loading-bar";
import { AuthProvider } from "~/context/auth-context";
import { fetcher, handleError } from "~/lib/http";
import { ThemeProvider } from "next-themes";
import { type MetaFunction, Outlet, useHref, useNavigate } from "react-router";
import { Toaster } from "sonner";
import { SWRConfig } from "swr";

export const meta: MetaFunction = () => {
  return [
    { title: "HALO Dergisi" },
    {
      content:
        "Bölümümüze ve öğrencilerine katkı sağlamak amacıyla, diğer fakülteler dahil olmak üzere; ortaya bir fikir- edebiyat dergisi sunmak için bir araya gelmiş bir grup öğrenciyiz.",
      name: "description"
    }
  ];
};

export default function Layout() {
  const navigate = useNavigate();

  return (
    <>
      <ThemeProvider
        attribute='class'
        forcedTheme='light'
      >
        <HeroUIProvider
          navigate={navigate}
          useHref={useHref}
        >
          <LoadingBar />

          <SWRConfig
            value={{
              fetcher,
              onError: handleError
            }}
          >
            <AuthProvider>
              <Outlet />
            </AuthProvider>
          </SWRConfig>
        </HeroUIProvider>
        <Toaster richColors />
      </ThemeProvider>
    </>
  );
}
