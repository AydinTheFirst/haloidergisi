import { QueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import apiClient from "./api-client";

export const queryClient = new QueryClient({
  defaultOptions: {
    mutations: {
      onError: (error) => {
        console.error("Mutation Error:", error);
        const resolved = apiClient.resolveApiError(error);
        toast.error(resolved.message);
      },
    },
  },
});
