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

interface ArticleStatusUpdatedEmailProps {
  authorName: string;
  articleTitle: string;
  status: string;
  statusText: string;
  adminNote?: string;
}

export default function ArticleStatusUpdatedEmail({
  authorName,
  articleTitle,
  status,
  statusText,
  adminNote,
}: ArticleStatusUpdatedEmailProps) {
  const getBadgeColor = (statusKey: string) => {
    switch (statusKey) {
      case "APPROVED":
        return "bg-green-100 text-green-800 border-green-300";
      case "REJECTED":
        return "bg-red-100 text-red-800 border-red-300";
      case "REVISION_REQ":
        return "bg-purple-100 text-purple-800 border-purple-300";
      case "REVIEWING":
        return "bg-blue-100 text-blue-800 border-blue-300";
      default:
        return "bg-amber-100 text-amber-800 border-amber-300";
    }
  };

  return (
    <Html>
      <Head />
      <Preview>Yazınızın Durumu Güncellendi - HALO Dergisi</Preview>
      <Tailwind
        config={{
          presets: [pixelBasedPreset],
        }}
      >
        <Body className='bg-gray-50 font-sans'>
          <Container className='mx-auto mb-16 overflow-hidden rounded-lg bg-white p-0 shadow-sm'>
            <Section className='bg-indigo-900 px-12 py-8 text-white'>
              <Text className='m-0 text-3xl font-extrabold text-white'>HALO Dergisi</Text>
              <Text className='mt-2 text-lg text-indigo-200'>Yazı Durumu Güncellemesi</Text>
            </Section>

            <Section className='px-12 py-8'>
              <Text className='text-xl font-bold text-gray-900'>Merhaba {authorName},</Text>
              <Text className='mt-3 text-base leading-relaxed text-gray-700'>
                <strong>"{articleTitle}"</strong> başlıklı yazınızın değerlendirme durumu
                editörlerimiz tarafından güncellenmiştir.
              </Text>

              <div className='my-6 rounded-lg border border-gray-200 bg-gray-50 p-6'>
                <Text className='m-0 text-sm font-semibold tracking-wider text-gray-500 uppercase'>
                  Yeni Durum
                </Text>
                <div
                  className={`mt-2 inline-block rounded-full border px-4 py-1 text-base font-bold ${getBadgeColor(status)}`}
                >
                  {statusText}
                </div>

                {adminNote && (
                  <div className='mt-4 border-t border-gray-200 pt-4'>
                    <Text className='m-0 text-sm font-bold text-gray-800'>Editör Notu:</Text>
                    <Text className='mt-1 rounded border border-gray-200 bg-white p-3 text-sm text-gray-700 italic'>
                      "{adminNote}"
                    </Text>
                  </div>
                )}
              </div>
            </Section>

            <Section className='px-12 py-4 text-center'>
              <Button
                href={`${process.env.WEB_URL || "https://haloidergisi.com"}/articles/my`}
                className='rounded-lg bg-indigo-600 px-8 py-3 text-center text-base font-bold text-white shadow-md'
              >
                Yazılarımı Görüntüle
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
                  className='text-indigo-600 underline'
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

ArticleStatusUpdatedEmail.PreviewProps = {
  authorName: "Ahmet Yılmaz",
  articleTitle: "Yapay Zeka ve Edebiyatın Geleceği",
  status: "APPROVED",
  statusText: "Onaylandı",
  adminNote: "Tebrikler, yazınız harika bir inceleme ile onaylandı!",
} satisfies ArticleStatusUpdatedEmailProps;
