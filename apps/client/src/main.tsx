import React from "react";
import ReactDOM from "react-dom/client";

import { Provider } from "@/providers";

import "@/styles/tailwind.css";
import "@/styles/index.css";
import "@/styles/bs.css";

import "@preact/signals-react/auto";
import { Toaster } from "@/components/Toaster";

import { routes } from "@generouted/react-router";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { ErrorBoundaryLayout } from "@/components/ErrorBoundary";

const router = createBrowserRouter([
  {
    element: <ErrorBoundaryLayout />,
    children: routes,
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider>
      <RouterProvider router={router} />
      <Toaster />
    </Provider>
  </React.StrictMode>,
);
