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

export const Login = () => {
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const data = Object.fromEntries(form.entries());
    console.log(data);

    try {
      const res = await http.post("/auth/login", data);
      toast.success("Login success!", {
        description: "Redirecting...",
      });

      localStorage.setItem("token", res.data.token);

      setTimeout(() => {
        window.location.href = "/";
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
            <h5 className="w-full text-center text-3xl font-bold">Login</h5>
          </CardHeader>
          <CardBody>
            <form onSubmit={handleSubmit} className="row g-3">
              <Input label="Email" type="email" name="username" />

              <Input label="Password" type="password" name="password" />

              <div>
                <Button type="submit" color="success" fullWidth>
                  Login
                </Button>
              </div>
            </form>

            <Divider className="my-5" />

            <div className="text-center">
              <Link href="/register" size="sm">
                Already have an account? <span className="ms-1">Register</span>
              </Link>
            </div>
          </CardBody>
        </Card>
      </div>
    </>
  );
};

export default Login;
