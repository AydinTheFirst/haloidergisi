import type { MetaFunction } from "react-router";

import { useTheme } from "next-themes";
import { Outlet } from "react-router";
import { Toaster } from "sonner";
import { SWRConfig } from "swr";

import http from "@/http";
import { Providers } from "@/provider";

type Theme = "dark" | "light" | "system";

export const meta: MetaFunction = () => {
  return [
    { title: "HALO Dergisi" },
    { content: "HALO Dergisi", name: "description" }
  ];
};

export default function Layout() {
  const { theme } = useTheme();

  return (
    <Providers>
      <SWRConfig
        value={{
          fetcher: http.fetcher,
          onError: http.handleError
        }}
      >
        <Outlet />
      </SWRConfig>
      <Toaster
        richColors
        theme={theme as Theme}
      />
    </Providers>
  );
}
