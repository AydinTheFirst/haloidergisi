import { Button, Divider, Link } from "@heroui/react";

import { Logo } from "@/components";
import { INSTAGRAM_URL, LINKEDIN_URL } from "@/config";

export default function Footer() {
  return (
    <footer className='bg-content2'>
      <div className='container px-10 py-16'>
        <div className='grid grid-cols-12 gap-5'>
          <div className='col-span-12 flex max-w-lg flex-col gap-3 md:col-span-6'>
            <Logo className='h-40 w-min' />
            <h1 className='text-3xl font-bold'>HALO Dergisi</h1>
            <p>
              Bölümümüze ve öğrencilerine katkı sağlamak amacıyla, diğer
              fakülteler dahil olmak üzere; ortaya bir fikir- edebiyat dergisi
              sunmak için bir araya gelmiş bir grup öğrenciyiz.
            </p>
            <div className='flex gap-5'>
              <Button
                as={Link}
                href={INSTAGRAM_URL}
                isExternal
                isIconOnly
                size='sm'
                variant='light'
              >
                Instagram
              </Button>
              <Button
                as={Link}
                href={LINKEDIN_URL}
                isExternal
                isIconOnly
                size='sm'
                variant='light'
              >
                LinkedIn
              </Button>
            </div>
          </div>
          <div className='col-span-12 md:col-span-3'>
            <h3 className='text-xl font-semibold'>Hızlı Erişim</h3>
            <ul className='mt-3 grid gap-2'>
              <li>
                <Link
                  color='foreground'
                  href='/'
                >
                  Anasayfa
                </Link>
              </li>
              <li>
                <Link
                  color='foreground'
                  href='/about'
                >
                  Hakkımızda
                </Link>
              </li>
              <li>
                <Link
                  color='foreground'
                  href='/contact'
                >
                  İletişim
                </Link>
              </li>
              <li>
                <Link
                  color='foreground'
                  href='/team'
                >
                  Ekip
                </Link>
              </li>
            </ul>
          </div>
          <div className='col-span-12 md:col-span-3'>
            <h3 className='text-xl font-semibold'>İletişim</h3>
            <ul className='mt-3 grid gap-2'>
              <li>
                <Link
                  color='foreground'
                  href={INSTAGRAM_URL}
                  isExternal
                >
                  Instagram
                </Link>
              </li>
              <li>
                <Link
                  color='foreground'
                  href={LINKEDIN_URL}
                  isExternal
                >
                  Linkedin
                </Link>
              </li>
              <li>
                <Link
                  color='foreground'
                  href='/contact'
                >
                  Mail Gönder
                </Link>
              </li>
            </ul>
          </div>
          <Divider className='col-span-12' />
          <div className='col-span-6'>
            <p className='text-sm text-gray-500'>
              © {new Date().getFullYear()} Halo. Tüm hakları saklıdır.
            </p>
          </div>
          <div className='col-span-6 flex justify-end gap-1'>
            <Link
              className='text-sm text-gray-500'
              href='https://aydinthefirst.com'
              isExternal
            >
              AydinTheFirst
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
