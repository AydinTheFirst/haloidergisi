import { Profile, User } from "@repo/db";
import { useQuery } from "@tanstack/react-query";

import apiClient from "@/lib/api-client";

interface _User extends User {
  profile?: Profile;
}

export const useAuth = () => {
  return useQuery({
    queryKey: ["auth"],
    queryFn: async () => {
      const { data } = await apiClient.get<_User>("/account");
      return data;
    },
  });
};

export const useLogout = () => {
  return async () => {
    await apiClient.post("/auth/logout", { token: localStorage.getItem("token") });
    localStorage.removeItem("token");
    window.location.href = "/";
  };
};
