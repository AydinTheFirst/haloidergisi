import { Section } from "@/components";
import { Button } from "@nextui-org/react";
import { Link } from "react-router-dom";

export const NotFound = () => {
  return (
    <Section>
      <h1 className="bg-opacity-50 bg-gradient-to-b from-neutral-50 to-neutral-400 bg-clip-text text-center text-4xl font-bold text-transparent md:text-7xl">
        The page you are looking for does not exist.
      </h1>
      <br />

      <Button to={"/"} as={Link}>
        Go Home
      </Button>
    </Section>
  );
};

export default NotFound;
