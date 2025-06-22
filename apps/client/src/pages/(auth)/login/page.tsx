import type { MetaFunction } from "react-router";

import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Input,
  Link
} from "@heroui/react";
import PasswordInput from "~/components/password-input";
import { handleError, http } from "~/lib/http";
import { LucideChevronLeft } from "lucide-react";
import React from "react";
import { toast } from "sonner";

export const meta: MetaFunction = () => {
  return [
    { title: "HALO Dergisi - Giriş Yap" },
    {
      content:
        "HALO Dergisi'ne giriş yaparak en son haberleri, makaleleri ve etkinlikleri takip edebilirsiniz.",
      name: "description"
    }
  ];
};

export default function LoginPage() {
  const [isLoading, setIsLoading] = React.useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget),
      data: Record<string, unknown> = Object.fromEntries(formData.entries());

    setIsLoading(true);

    try {
      const { data: response } = await http.post("/auth/login", data);
      toast.success("Giriş başarılı! Yönlendiriliyorsunuz...");

      localStorage.setItem("token", response.token);
      location.href = "/";
    } catch (error) {
      handleError(error);
    }

    setIsLoading(false);
  };

  return (
    <div className='container'>
      <div className='grid h-screen place-items-center'>
        <Card className='w-full max-w-md'>
          <CardHeader className='flex flex-col items-start gap-3'>
            <Link
              color='foreground'
              href='/'
            >
              <LucideChevronLeft size={20} />
              Anasayfaya Dön
            </Link>
            <h1 className='text-2xl font-semibold'>Giriş Yap</h1>
            <p className='text-muted'>
              Tekrar hoş geldin! Hesabına giriş yaparak devam edebilirsin.
            </p>
          </CardHeader>
          <CardBody>
            <form
              className='grid gap-3'
              onSubmit={handleSubmit}
            >
              <Input
                description='Kullanıcı adınızı veya e-posta adresinizi girin'
                isRequired
                label='Kullanıcı Adı'
                name='username'
              />
              <PasswordInput
                isRequired
                label='Şifre'
                name='password'
                type='password'
              />
              <div className='flex justify-end'>
                <Link
                  color='foreground'
                  href='/reset-password'
                  size='sm'
                >
                  Şifremi Unuttum
                </Link>
              </div>
              <Button
                isLoading={isLoading}
                type='submit'
              >
                Giriş Yap
              </Button>
            </form>
          </CardBody>
          <CardFooter className='flex-col'>
            <p className='text-muted text-sm'>Hesabın yok mu?</p>
            <Link
              color='foreground'
              href='/register'
              size='sm'
            >
              Kayıt Ol
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
