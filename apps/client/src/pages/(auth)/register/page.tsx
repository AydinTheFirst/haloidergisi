import type { MetaFunction } from "react-router";

import { Button, Card, CardBody, CardFooter, CardHeader, Input, Link } from "@heroui/react";
import { LucideChevronLeft } from "lucide-react";
import React from "react";
import { toast } from "sonner";

import PasswordInput from "~/components/password-input";
import { handleError, http } from "~/lib/http";
import { sleep } from "~/lib/utils";

export const meta: MetaFunction = () => {
  return [
    { title: "HALO Dergisi - Kayıt Ol" },
    {
      content:
        "HALO Dergisi platformuna kayıt olarak en son haberleri, makaleleri ve etkinlikleri takip edebilirsiniz.",
      name: "description",
    },
  ];
};

export default function RegisterPage() {
  const [isLoading, setIsLoading] = React.useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget),
      data: Record<string, unknown> = Object.fromEntries(formData.entries());

    setIsLoading(true);

    try {
      await http.post("/auth/register", data);
      toast.success("Kayıt başarılı!", {
        description: "Hesabın başarıyla oluşturuldu. Giriş yapabilirsin.",
      });

      await sleep(2000);

      location.href = "/login";
    } catch (error) {
      handleError(error);
    }

    setIsLoading(false);
  };

  return (
    <div className="container">
      <div className="grid h-screen place-items-center">
        <Card className="w-full max-w-md">
          <CardHeader className="flex flex-col items-start gap-3">
            <Link color="foreground" href="/">
              <LucideChevronLeft size={20} />
              Anasayfaya Dön
            </Link>
            <h1 className="text-2xl font-semibold">Kayıt Ol</h1>
            <p className="text-muted">
              HALO Dergi platformuna kayıt olmak için lütfen formu doldurun.
            </p>
          </CardHeader>
          <CardBody>
            <form className="grid gap-3" onSubmit={handleSubmit}>
              <Input isRequired label="E-posta" name="email" />

              <Input description="Adınız ve soyadınız" isRequired label="Ad" name="displayName" />

              <PasswordInput isRequired label="Şifre" name="password" type="password" />

              <Button isLoading={isLoading} type="submit">
                Kayıt Ol
              </Button>
            </form>
          </CardBody>
          <CardFooter className="flex-col">
            <p className="text-muted text-sm">Zaten bir hesabım var</p>
            <Link color="foreground" href="/login" size="sm">
              Giriş Yap
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
