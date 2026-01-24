import { composeProviders } from "@adn-ui/react";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";

const queryClient = new QueryClient();

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
