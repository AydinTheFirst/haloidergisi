import { createRouter } from "@tanstack/react-router";

import { ErrorComponent } from "@/routes/-error";
import { NotFound } from "@/routes/-not-found";

// Import the generated route tree
import { routeTree } from "./routeTree.gen";

// Create a new router instance
export const getRouter = () => {
  const router = createRouter({
    routeTree,
    scrollRestoration: true,
    defaultPreloadStaleTime: 0,
    defaultNotFoundComponent: NotFound,
    defaultErrorComponent: ErrorComponent,
  });

  return router;
};
