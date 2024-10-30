import { Card, CardBody } from "@nextui-org/react";
import React from "react";

export const Box = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Card>
        <CardBody>{children}</CardBody>
      </Card>
    </>
  );
};
