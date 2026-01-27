import { composeProviders } from "@adn-ui/react";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";

import { queryClient } from "@/lib/query-client";

const AppProviders = composeProviders(
  ({ children }) => <ThemeProvider attribute='class'>{children}</ThemeProvider>,
  ({ children }) => <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>,
  ({ children }) => (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      {children}
    </GoogleOAuthProvider>
  ),
);

export default AppProviders;
