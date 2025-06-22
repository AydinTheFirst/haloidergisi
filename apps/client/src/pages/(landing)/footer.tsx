import { Divider, Link } from "@heroui/react";
import Logo from "~/components/logo";
import { links } from "~/data/links";

export default function Footer() {
  return (
    <>
      <Divider className='my-5' />
      <footer className='bg-content1'>
        <div className='container py-10'>
          <div className='grid gap-3'>
            <div className='grid grid-cols-12 gap-3'>
              <div className='col-span-12 md:col-span-6'>
                <div className='flex flex-col gap-3'>
                  <Logo className='h-32' />
                  <h2 className='text-2xl font-bold'>HALO Dergisi</h2>
                  <p className='text-muted max-w-lg text-sm'>
                    Bölümümüze ve öğrencilerine katkı sağlamak amacıyla, diğer
                    fakülteler dahil olmak üzere; ortaya bir fikir- edebiyat
                    dergisi sunmak için bir araya gelmiş bir grup öğrenciyiz.
                  </p>
                </div>
              </div>
              <div className='col-span-12 md:col-span-2'>
                <h3 className='mb-3 text-lg font-semibold'>Hızlı Erişim</h3>
                <ul className='mt-2 space-y-1'>
                  <li>
                    <Link
                      color='foreground'
                      href='/'
                      size='sm'
                    >
                      Anasayfa
                    </Link>
                  </li>
                  <li>
                    <Link
                      color='foreground'
                      href='/about'
                      size='sm'
                    >
                      Hakkımızda
                    </Link>
                  </li>
                  <li>
                    <Link
                      color='foreground'
                      href='/posts'
                      size='sm'
                    >
                      Dergiler
                    </Link>
                  </li>
                  <li>
                    <Link
                      color='foreground'
                      href='/news'
                      size='sm'
                    >
                      Haberler
                    </Link>
                  </li>
                  <li>
                    <Link
                      color='foreground'
                      href='/contact'
                      size='sm'
                    >
                      İletişim
                    </Link>
                  </li>
                  <li>
                    <Link
                      color='foreground'
                      href='/team'
                      size='sm'
                    >
                      Ekip
                    </Link>
                  </li>
                </ul>
              </div>
              <div className='col-span-12 md:col-span-2'>
                <h3 className='mb-3 text-lg font-semibold'>Takip Et</h3>
                <ul className='mt-2 space-y-1'>
                  <li>
                    <Link
                      color='foreground'
                      href={links.instagram}
                      isExternal
                      size='sm'
                    >
                      Instagram
                    </Link>
                  </li>
                  <li>
                    <Link
                      color='foreground'
                      href={links.linkedin}
                      isExternal
                      size='sm'
                    >
                      LinkedIn
                    </Link>
                  </li>
                </ul>
              </div>
              <div className='col-span-12 md:col-span-2'>
                <h3 className='mb-3 text-lg font-semibold'>İletişim</h3>
                <ul className='mt-2 space-y-1'>
                  <li>
                    <Link
                      color='foreground'
                      href={links.mail}
                      size='sm'
                    >
                      Mail Gönder
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
            <Divider />
            <div className='grid grid-cols-1 gap-3 md:grid-cols-2'>
              <div>
                <p className='text-muted text-sm'>
                  © {new Date().getFullYear()} HALO Tüm Hakları Saklıdır.
                </p>
              </div>
              <div className='flex justify-end gap-3'>
                <Link
                  color='foreground'
                  href='/privacy'
                  size='sm'
                >
                  Gizlilik Politikası
                </Link>
                <Link
                  color='foreground'
                  href='/terms'
                  size='sm'
                >
                  Kullanım Şartları
                </Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
