import React from "react";
import useSWR from "swr";

import type { ClientUser } from "~/models/ClientUser";

interface AuthContextType {
  isAuthenticated: boolean;
  user: ClientUser | null | undefined;
}

export const AuthContext = React.createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: React.PropsWithChildren) {
  const { data: user } = useSWR<ClientUser>("/account/me", {
    onError: undefined,
  });

  const isAuthenticated = Boolean(user);

  return <AuthContext.Provider value={{ isAuthenticated, user }}>{children}</AuthContext.Provider>;
}
