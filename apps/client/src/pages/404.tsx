import { Button } from "@nextui-org/react";
import { Link } from "react-router-dom";

import { CenteredCard } from "@/components";

const NotFound = () => {
  return (
    <CenteredCard title="Not Found - 404">
      <div className="grid place-items-center gap-3">
        <p className="max-w-sm text-center text-lg text-red-500">
          The page you are looking for does not exist. Please check the URL or
          click the button below to go back to the homepage.
        </p>

        <Button as={Link} color="primary" fullWidth to={"/"}>
          <strong>Go back to the homepage</strong>
        </Button>
      </div>
    </CenteredCard>
  );
};

export default NotFound;
