import {
  SiFacebook,
  SiInstagram,
  SiWhatsapp,
} from "@icons-pack/react-simple-icons";
import { Button, Divider, Link } from "@nextui-org/react";
import { LucideGlobe } from "lucide-react";

import { Logo } from "@/components";

export default function Footer() {
  return (
    <footer className="backdrop-blur">
      <div className="container px-10 py-16">
        <div className="grid grid-cols-12 gap-5">
          <div className="col-span-12 flex max-w-lg flex-col gap-3 md:col-span-6">
            <div className="flex items-center gap-3">
              <Logo className="h-20 w-auto md:h-40" />
              <div className="text-center">
                <h1 className="text-3xl font-bold">HALO Dergisi</h1>
              </div>
            </div>
            <p>
              Bölümümüze ve öğrencilerine katkı sağlamak amacıyla, diğer
              fakülteler dahil olmak üzere; ortaya bir fikir- edebiyat dergisi
              sunmak için bir araya gelmiş bir grup öğrenciyiz.
            </p>
            <div className="flex gap-5">
              <Button
                as={Link}
                href="#"
                isExternal
                isIconOnly
                size="sm"
                variant="light"
              >
                <SiInstagram />
              </Button>
              <Button
                as={Link}
                href="#"
                isExternal
                isIconOnly
                size="sm"
                variant="light"
              >
                <SiFacebook />
              </Button>
              <Button
                as={Link}
                href="#"
                isExternal
                isIconOnly
                size="sm"
                variant="light"
              >
                <LucideGlobe />
              </Button>
              <Button
                as={Link}
                href="#"
                isExternal
                isIconOnly
                size="sm"
                variant="light"
              >
                <SiWhatsapp />
              </Button>
            </div>
          </div>
          <div className="col-span-12 md:col-span-3">
            <h3 className="text-xl font-semibold">Hızlı Erişim</h3>
            <ul className="mt-3 grid gap-2">
              <li>
                <Link href="#">Anasayfa</Link>
              </li>
              <li>
                <Link href="#">Hakkımızda</Link>
              </li>
              <li>
                <Link href="#">Ürünler</Link>
              </li>
              <li>
                <Link href="#">İletişim</Link>
              </li>
            </ul>
          </div>
          <div className="col-span-12 md:col-span-3">
            <h3 className="text-xl font-semibold">İletişim</h3>
            <ul className="mt-3 grid gap-2">
              <li>
                <Link href="tel:+905555555555">+90 555 555 55 55</Link>
              </li>
            </ul>
          </div>
          <Divider className="col-span-12" />
          <div className="col-span-6">
            <p className="text-sm text-gray-500">
              © {new Date().getFullYear()} Halo. Tüm hakları saklıdır.
            </p>
          </div>
          <div className="col-span-6 flex justify-end gap-1">
            <Link
              className="text-sm text-gray-500"
              href="https://aydinthefirst.com"
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
