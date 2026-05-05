import { GoogleOAuthProvider } from "@react-oauth/google";
import { QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";

import { queryClient } from "@/lib/query-client";

function composeProviders(...providers: React.FC<React.PropsWithChildren>[]) {
  return ({ children }: React.PropsWithChildren) => {
    return providers.reduceRight((acc, Provider) => <Provider>{acc}</Provider>, children);
  };
}

const AppProviders = composeProviders(
  ({ children }) => (
    <ThemeProvider
      attribute='class'
      defaultTheme='light'
      enableSystem
    >
      {children}
    </ThemeProvider>
  ),
  ({ children }) => <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>,
  ({ children }) => (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      {children}
    </GoogleOAuthProvider>
  ),
);

export default AppProviders;
