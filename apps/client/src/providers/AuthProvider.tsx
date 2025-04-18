import React from "react";
import useSWR from "swr";

import type { User } from "@/types";

export interface AuthContextType {
  isAdmin: boolean;
  isLoggedIn: boolean;
  logout: () => void;
  user?: User;
}

export const AuthContext = React.createContext<AuthContextType>({
  isAdmin: false,
  isLoggedIn: false,
  logout: () => {
    throw new Error("Not Implemented");
  }
});

export const useAuth = () => React.useContext(AuthContext);

export const AuthProvider = ({ children }: React.PropsWithChildren) => {
  const { data: user } = useSWR<User>("/auth/me", {
    errorRetryCount: 0,
    onError: (err) => {
      console.error(err);
    }
  });

  const isLoggedIn = Boolean(user);
  const isAdmin = Boolean(user && user.roles.includes("ADMIN"));

  const logout = () => {
    localStorage.removeItem("token");
    location.replace("/login");
  };

  return (
    <AuthContext.Provider value={{ isAdmin, isLoggedIn, logout, user }}>
      {children}
    </AuthContext.Provider>
  );
};
