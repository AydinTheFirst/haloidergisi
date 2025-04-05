import { Button, CardFooter, Input, Link } from "@heroui/react";
import { useState } from "react";
import { toast } from "sonner";

import { CenteredCard } from "@/components";
import { PasswordInput } from "@/components/PasswordInput";
import http from "@/http";
import { sleep } from "@/utils";

const Register = () => {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const form = new FormData(e.currentTarget);
    const data = Object.fromEntries(form.entries());
    try {
      await http.post("/auth/register", data);
      toast.success("Hesap başarıyla oluşturuldu!", {
        description: "Giriş yapmak için yönlendiriliyorsunuz..."
      });
      await sleep(1000);
      location.replace("/login");
    } catch (error) {
      http.handleError(error);
    }

    setIsLoading(false);
  };

  return (
    <CenteredCard title='Kayıt Ol'>
      <form
        className='grid gap-3'
        onSubmit={handleSubmit}
      >
        <Input
          isRequired
          label='Email'
          name='email'
          type='email'
        />

        <Input
          isRequired
          label='Gösterilecek Ad'
          name='displayName'
        />

        <PasswordInput />
        <Button
          color='secondary'
          fullWidth
          isLoading={isLoading}
          type='submit'
        >
          Kayıt Ol
        </Button>
      </form>
      <CardFooter className='flex-col justify-center'>
        <p>Zaten bir hesabın var mı?</p>
        <Link href='/login'>Giriş Yap</Link>
      </CardFooter>
    </CenteredCard>
  );
};

export default Register;
