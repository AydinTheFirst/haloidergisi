import { routes } from "@generouted/react-router";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import { ErrorBoundaryLayout } from "@/components";
import "@/styles/globals.css";

const router = createBrowserRouter([
  {
    children: routes,
    element: <ErrorBoundaryLayout />,
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
