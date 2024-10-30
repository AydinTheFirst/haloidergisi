import { http, httpError } from "@/lib";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Divider,
  Input,
  Link,
} from "@nextui-org/react";
import { toast } from "sonner";

export const Register = () => {
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const data = Object.fromEntries(form.entries());

    try {
      await http.post("/users", data);

      toast.success("Register success!", {
        description: "Redirecting... Login with your new account.",
      });

      setTimeout(() => {
        window.location.href = "/login";
      }, 3000);
    } catch (error) {
      httpError(error);
    }
  };

  return (
    <>
      <div className="container flex h-screen items-center justify-center">
        <Card className="col-md-6 col-lg-4">
          <CardHeader>
            <h5 className="w-full text-center text-3xl font-bold">Register</h5>
          </CardHeader>
          <CardBody>
            <form onSubmit={handleSubmit} className="row g-3">
              <Input label="Name" type="text" name="displayName" />

              <Input label="Email" type="email" name="email" />

              <Input label="Password" type="password" name="password" />

              <div>
                <Button type="submit" color="secondary" fullWidth>
                  Register
                </Button>
              </div>
            </form>

            <Divider className="my-5" />

            <div className="text-center">
              <Link href="/register" size="sm">
                Already have an account? <span className="ms-1">Login</span>
              </Link>
            </div>
          </CardBody>
        </Card>
      </div>
    </>
  );
};

export default Register;
