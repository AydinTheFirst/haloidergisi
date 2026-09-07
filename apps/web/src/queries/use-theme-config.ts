import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import apiClient from "@/lib/api-client";
import { ThemeConfig } from "@/types";

export interface UpdateThemeConfigInput {
  primaryColor?: string;
  primaryDarkColor?: string;
  accentColor?: string;
  radius?: string;
  fontFamily?: string;
  preset?: string;
}

export function useThemeConfig() {
  return useQuery({
    queryKey: ["theme-config"],
    queryFn: async () => {
      const { data } = await apiClient.get<ThemeConfig>("/theme-config");
      return data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes cache
  });
}

export function useUpdateThemeConfig() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: UpdateThemeConfigInput) => {
      const { data } = await apiClient.put<ThemeConfig>("/theme-config", payload);
      return data;
    },
    onSuccess: async (data) => {
      queryClient.setQueryData(["theme-config"], data);
      await queryClient.invalidateQueries({ queryKey: ["theme-config"] });
    },
  });
}
