import { Card, CardBody, CardHeader } from "@nextui-org/react";
import React from "react";

export const CenteredCard = ({
  children,
  title,
}: {
  children: React.ReactNode;
  title?: string;
}) => {
  return (
    <div className="container h-screen">
      <div className="grid h-full place-items-center">
        <Card className="w-full max-w-lg">
          {title && (
            <CardHeader className="justify-center">
              <h1 className="text-center text-2xl font-bold">{title}</h1>
            </CardHeader>
          )}
          <CardBody>{children}</CardBody>
        </Card>
      </div>
    </div>
  );
};
