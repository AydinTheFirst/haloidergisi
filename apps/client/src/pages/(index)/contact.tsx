import type { MetaFunction } from "react-router";

import { Button, Input, Link, Textarea } from "@heroui/react";
import { SiInstagram, SiLinkedin } from "@icons-pack/react-simple-icons";

import { INSTAGRAM_URL, LINKEDIN_URL } from "@/config";

export const meta: MetaFunction = () => {
  return [
    { title: "HALO Dergisi | İletişim" },
    { content: "HALO Dergisi İletişim", name: "description" }
  ];
};

const Contact = () => {
  return (
    <div className='mx-auto grid max-w-3xl gap-10'>
      <div className='grid gap-3'>
        <h2 className='text-3xl font-extrabold'>Bize Ulaşın!</h2>
        <p className='text-lg font-bold'>
          Bir sorunuz ya da öneriniz mi var? Bizimle iletişime geçin! Aşağıdaki
          iletişim bilgilerini kullanarak çekinmeden bize ulaşın veya formu
          kullanarak mail gönderin.
        </p>
      </div>
      <div className='grid gap-3'>
        <h4 className='text-2xl font-bold'>Sosyal Medya Hesaplarımız:</h4>
        <ul className='flex list-none flex-col gap-5'>
          <li>
            <Link
              className='flex gap-1'
              color='foreground'
              href={INSTAGRAM_URL}
              isExternal
            >
              <SiInstagram />
              Instagram
            </Link>
          </li>
          <li>
            <Link
              className='flex gap-1'
              color='foreground'
              href={LINKEDIN_URL}
              isExternal
            >
              <SiLinkedin />
              Linkedin
            </Link>
          </li>
        </ul>
      </div>
      <div className='grid gap-3'>
        <h4 className='text-2xl font-bold'>Mail Gönderme Formu</h4>
        <MailForm />
      </div>
    </div>
  );
};

export default Contact;

const MailForm = () => {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    window.open(
      `mailto:haloidergisipau@gmail.com?subject=${data.subject}&body=${data.body}`,
      "_blank"
    );
  };

  return (
    <form
      className='grid grid-cols-12 gap-3 rounded-lg bg-content1 p-3'
      onSubmit={handleSubmit}
    >
      <Input
        className='col-span-12 md:col-span-6'
        color='warning'
        isRequired
        label='Adınız'
        placeholder='Adınız'
      />
      <Input
        className='col-span-12 md:col-span-6'
        color='warning'
        isRequired
        label='Konu'
        placeholder='konu'
      />
      <Textarea
        className='col-span-12'
        color='warning'
        isRequired
        label='Mesajınız'
        placeholder='Mesajınız'
      />
      <Button
        className='col-span-12'
        color='secondary'
        type='submit'
      >
        Gönder
      </Button>
    </form>
  );
};
