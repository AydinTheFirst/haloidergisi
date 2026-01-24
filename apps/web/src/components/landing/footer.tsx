import { Separator } from "@adn-ui/react";
import { Icon } from "@iconify/react";
import { Link } from "@tanstack/react-router";

import { socialLinks } from "@/constants";

import Logo from "../logo";
import ThemeSwitcher from "../theme-switcher";

export default function LandingFooter() {
  return (
    <footer className='bg-surface border-t'>
      <div className='container py-8 md:px-16'>
        <div className='grid grid-cols-12 gap-4'>
          <div className='col-span-12 md:col-span-6'>
            <div className='max-w-md space-y-4'>
              <Logo className='h-20' />
              <h2 className='text-2xl font-semibold'>HALO Dergisi</h2>
              <p className='text-muted-foreground'>
                Bölümümüze ve öğrencilerine katkı sağlamak amacıyla, diğer fakülteler dahil olmak
                üzere; ortaya bir fikir- edebiyat dergisi sunmak için bir araya gelmiş bir grup
                öğrenciyiz.
              </p>
            </div>
          </div>
          <div className='col-span-12 md:col-span-2'>
            <h3 className='mb-4 text-lg font-semibold'>Hızlı Linkler</h3>
            <div className='flex flex-col gap-2'>
              <Link
                to='/posts'
                className='link'
              >
                Dergiler
              </Link>
              <Link
                to='/about'
                className='link'
              >
                Hakkımızda
              </Link>
              <Link
                to='/contact'
                className='link'
              >
                İletişim
              </Link>
              <Link
                to='/team'
                className='link'
              >
                Ekibimiz
              </Link>
            </div>
          </div>
          <div className='col-span-12 md:col-span-2'>
            <h3 className='mb-4 text-lg font-semibold'>Yasal</h3>
            <div className='flex flex-col gap-2'>
              <Link
                to='/terms'
                className='link'
              >
                Kullanım Şartları
              </Link>
              <Link
                to='/privacy'
                className='link'
              >
                Gizlilik Politikası
              </Link>
            </div>
          </div>
          <div className='col-span-12 md:col-span-2'>
            <h3 className='mb-4 text-lg font-semibold'>Sosyal Medya</h3>
            <div className='flex flex-col gap-2'>
              {Object.values(socialLinks).map((link) => (
                <a
                  key={link.url}
                  href={link.url}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='link'
                >
                  <Icon icon={link.icon} />
                  {link.label}
                </a>
              ))}
            </div>
          </div>
          <div className='col-span-12'>
            <div className='flex justify-end'>
              <ThemeSwitcher />
            </div>
          </div>
          <Separator className='col-span-12' />
          <div className='col-span-12'>
            <div className='flex justify-between gap-4'>
              <p>© {new Date().getFullYear()} HALO Tüm Hakları Saklıdır.</p>
              <div className='flex justify-end gap-2'>
                <Link
                  to='/terms'
                  className='link'
                >
                  Kullanım Şartları
                </Link>
                <Link
                  to='/privacy'
                  className='link'
                >
                  Gizlilik Politikası
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
