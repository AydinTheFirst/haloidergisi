import { ErrorBoundary } from "react-error-boundary";
import { Outlet } from "react-router-dom";
import { Button } from "@nextui-org/react";
import { CenteredCard } from "./CenteredCard";

function fallbackRender({
  error,
  resetErrorBoundary,
}: {
  error: Error;
  resetErrorBoundary: () => void;
}) {
  return (
    <CenteredCard>
      <h1 className="p-3 text-center text-2xl">Something went wrong</h1>
      <p className="text-center">
        There was an error while rendering this component.
      </p>
      <br />
      <pre style={{ whiteSpace: "normal" }} className="text-sm text-red-500">
        {error.message}
      </pre>
      <br />
      <Button
        onClick={resetErrorBoundary}
        color="danger"
        size="sm"
        className="w-full"
      >
        Reload
      </Button>
    </CenteredCard>
  );
}

export const ErrorBoundaryLayout = () => (
  <ErrorBoundary FallbackComponent={fallbackRender}>
    <Outlet />
  </ErrorBoundary>
);
