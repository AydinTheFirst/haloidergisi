import type { MetaFunction } from "react-router";
import type { ToasterProps } from "sonner";

import { useTheme } from "next-themes";
import { Outlet } from "react-router";
import { Toaster } from "sonner";
import { SWRConfig } from "swr";

import { Loader } from "@/components";
import http from "@/http";
import { Providers } from "@/provider";
import { AuthProvider } from "@/providers/AuthProvider";

export const meta: MetaFunction = () => {
  return [
    { title: "HALO Dergisi" },
    { content: "HALO Dergisi", name: "description" }
  ];
};

export function HydrateFallback() {
  return <Loader />;
}

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
        <AuthProvider>
          <Outlet />
        </AuthProvider>
      </SWRConfig>
      <Toaster
        richColors
        theme={theme as ToasterProps["theme"]}
      />
    </Providers>
  );
}
