import { Link } from "@heroui/react";
import { links } from "~/data/links";
import { LucideInstagram, LucideLinkedin, LucideMail } from "lucide-react";

export default function Contact() {
  return (
    <div className='container max-w-3xl py-20'>
      <div className='prose'>
        <h2>İletişim</h2>
        <p>
          Bir sorunuz ya da öneriniz mi var? Bizimle iletişime geçin! Aşağıdaki
          iletişim bilgilerini kullanarak çekinmeden bize ulaşın.
        </p>
        <h4>Sosyal Medya Hesaplarımız</h4>
        <ul>
          <li>
            <Link
              color='foreground'
              href={links.instagram}
              isExternal
            >
              <LucideInstagram size={20} />
              <span className='mx-2'>Instagram</span>
            </Link>
          </li>
          <li>
            <Link
              color='foreground'
              href={links.linkedin}
              isExternal
            >
              <LucideLinkedin size={20} />
              <span className='mx-2'>LinkedIn</span>
            </Link>
          </li>
        </ul>
        <h4>E-posta</h4>
        <ul>
          <li>
            <Link
              color='foreground'
              href={links.mail}
              isExternal
            >
              <LucideMail size={20} />
              <span className='mx-2'>haloidergisi@gmail.com</span>
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}
