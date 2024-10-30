import { useTheme } from "next-themes";
import { Outlet } from "react-router-dom";
import { Toaster } from "sonner";
import { SWRConfig } from "swr";

import http from "@/http";
import { Providers } from "@/provider";

type Theme = "dark" | "light" | "system";

const Layout = () => {
  const { theme } = useTheme();

  return (
    <>
      <Providers>
        <SWRConfig
          value={{
            fetcher: http.fetcher,
            onError: http.handleError,
          }}
        >
          <Outlet />
        </SWRConfig>
        <Toaster richColors theme={theme as Theme} />
      </Providers>
    </>
  );
};

export default Layout;
