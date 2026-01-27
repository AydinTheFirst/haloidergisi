import { useMutation } from "@tanstack/react-query";
import { useLocation } from "@tanstack/react-router";
import { useEffect } from "react";

import apiClient from "@/lib/api-client";

const ignoredPaths = [/^\/assets\//, /^\/api\//, /^\/dashboard(\/.*|$)/];

export default function AnalyticsTracker() {
  const { pathname } = useLocation();

  const { mutate } = useMutation({
    mutationFn: (newUrl: string) => {
      return apiClient.post("/analytics/track-visit", { url: newUrl });
    },
    onError: (err) => console.error("Analytics Error:", err),
  });

  useEffect(() => {
    if (ignoredPaths.some((regex) => regex.test(pathname))) return;
    mutate(pathname);
  }, [pathname, mutate]);

  return null;
}
