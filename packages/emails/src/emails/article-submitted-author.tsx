import {
  Body,
  Button,
  Container,
  Head,
  Hr,
  Html,
  Link,
  pixelBasedPreset,
  Preview,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";

interface ArticleSubmittedAuthorEmailProps {
  authorName: string;
  articleTitle: string;
  callTitle: string;
}

export default function ArticleSubmittedAuthorEmail({
  authorName,
  articleTitle,
  callTitle,
}: ArticleSubmittedAuthorEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Yazınız Başarıyla Alındı - HALO Dergisi</Preview>
      <Tailwind
        config={{
          presets: [pixelBasedPreset],
        }}
      >
        <Body className='bg-gray-50 font-sans'>
          <Container className='mx-auto mb-16 overflow-hidden rounded-lg bg-white p-0 shadow-sm'>
            <Section className='bg-blue-900 px-12 py-8 text-white'>
              <Text className='m-0 text-3xl font-extrabold text-white'>HALO Dergisi</Text>
              <Text className='mt-2 text-lg text-blue-100'>Yazı Gönderim Onayı</Text>
            </Section>

            <Section className='px-12 py-8'>
              <Text className='text-xl font-bold text-gray-900'>Merhaba {authorName},</Text>
              <Text className='mt-3 text-base leading-relaxed text-gray-700'>
                <strong>"{callTitle}"</strong> ilanı için hazırladığınız{" "}
                <strong>"{articleTitle}"</strong> başlıklı yazınız tarafımıza başarıyla ulaşmıştır.
              </Text>
              <Text className='mt-3 text-base leading-relaxed text-gray-700'>
                Yazınız editör ekibimiz tarafından inceleme sırasına alınmıştır. İnceleme süreci
                tamamlandığında ve durum güncellemesi yapıldığında tarafınıza tekrar bilgilendirme
                e-postası iletilecektir.
              </Text>
            </Section>

            <Section className='px-12 py-4 text-center'>
              <Button
                href={`${process.env.WEB_URL || "https://haloidergisi.com"}/articles/my`}
                className='rounded-lg bg-blue-600 px-8 py-3 text-center text-base font-bold text-white shadow-md'
              >
                Gönderdiğim Yazıları Görüntüle
              </Button>
            </Section>

            <Hr className='mx-0 my-8 border-gray-200' />

            <Section className='px-12 pb-8 text-center'>
              <Text className='m-1 text-sm text-gray-600'>
                © 2026 HALO Dergisi. Tüm hakları saklıdır.
              </Text>
              <Text className='m-1 text-sm text-gray-600'>
                <Link
                  href={process.env.WEB_URL || "https://haloidergisi.com"}
                  className='text-blue-600 underline'
                >
                  Web sitemizi ziyaret edin
                </Link>
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}

ArticleSubmittedAuthorEmail.PreviewProps = {
  authorName: "Ahmet Yılmaz",
  articleTitle: "Yapay Zeka ve Edebiyatın Geleceği",
  callTitle: "2026 Güz Sayısı İlanı",
} satisfies ArticleSubmittedAuthorEmailProps;
