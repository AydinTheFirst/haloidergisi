import { GraphQLClient } from "graphql-request";

function getToken(): string {
  if (typeof window === "undefined") return "";
  return localStorage.getItem("token") ?? "";
}

export const gqlClient = new GraphQLClient(
  `${import.meta.env.VITE_API_URL || "http://localhost:3000"}/graphql`,
  {
    headers: () => {
      const token = getToken();
      const headers: Record<string, string> = {};
      if (token) headers["Authorization"] = `Bearer ${token}`;
      return headers;
    },
  },
);
