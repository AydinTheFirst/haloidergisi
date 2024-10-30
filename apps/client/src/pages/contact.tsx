import { HomeLayout } from "@/layouts/Home/Layout";
import { Button, Divider, Input, Textarea } from "@nextui-org/react";
import { FaInstagram, FaLinkedin } from "react-icons/fa";
import { Link } from "react-router-dom";
const instagram = "https://www.instagram.com/haloidergisi";
const linkedin = "https://tr.linkedin.com/in/halo-edebiyat-dergisi-8a7bb8273";

export const Contact = () => {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    window.open(
      `mailto:haloidergisipau@gmail.com?subject=${data.subject}&body=${data.body}`,
      "_blank",
    );
  };

  return (
    <HomeLayout>
      <main className="container my-10">
        <div className="mx-auto max-w-2xl">
          <div className="flex flex-col gap-10">
            <section className="flex flex-col gap-3">
              <span className="text-2xl">Bize ulaşın!</span>
              <p>
                Bir sorunuz ya da öneriniz mi var? Bizimle iletişime geçin!
                Aşağıdaki iletişim bilgilerini kullanarak çekinmeden bize ulaşın
                veya formu kullanarak mail gönderin.
              </p>
            </section>

            <Divider />

            <section className="flex flex-col gap-3">
              <span className="text-center text-2xl">Sosyal</span>
              <div className="flex justify-center gap-3">
                <Button
                  as={Link}
                  target="_blank"
                  to={instagram}
                  variant="light"
                >
                  <FaInstagram size={24} />
                  Instagram
                </Button>
                <Button as={Link} target="_blank" to={linkedin} variant="light">
                  <FaLinkedin size={24} />
                  LinkedIn
                </Button>
              </div>
            </section>

            <Divider />

            <section className="flex flex-col gap-3">
              <span className="text-center text-2xl">Mail</span>
              <div className="flex justify-center gap-3">
                <form onSubmit={handleSubmit} className="row g-3">
                  <Input
                    label="Konu"
                    name="subject"
                    placeholder="Konu"
                    color="warning"
                  />
                  <Textarea
                    type="text"
                    label="Mesajınız"
                    name="body"
                    placeholder="Mesajınız"
                    color="warning"
                  />
                  <div>
                    <Button color="warning" type="submit" fullWidth>
                      Gönder
                    </Button>
                  </div>
                </form>
              </div>
            </section>
          </div>
        </div>
      </main>
    </HomeLayout>
  );
};

export default Contact;
