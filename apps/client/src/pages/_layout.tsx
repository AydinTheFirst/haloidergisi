import type { MetaFunction } from "react-router";
import type { ToasterProps } from "sonner";

import { Progress } from "@heroui/react";
import { useTheme } from "next-themes";
import { Outlet, useNavigation } from "react-router";
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
  const navigation = useNavigation();
  const isLoading = navigation.state === "loading";

  return (
    <Providers>
      <SWRConfig
        value={{
          fetcher: http.fetcher,
          onError: http.handleError
        }}
      >
        <AuthProvider>
          {isLoading && (
            <Progress
              className='fixed top-0 z-50 w-full'
              color='warning'
              isIndeterminate
              size='sm'
            />
          )}
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
