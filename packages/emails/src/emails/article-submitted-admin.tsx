import {
  Body,
  Button,
  Container,
  Head,
  Hr,
  Html,
  pixelBasedPreset,
  Preview,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";

interface ArticleSubmittedAdminEmailProps {
  adminName: string;
  authorName: string;
  authorEmail: string;
  articleTitle: string;
  callTitle: string;
  articleId: string;
}

export default function ArticleSubmittedAdminEmail({
  adminName,
  authorName,
  authorEmail,
  articleTitle,
  callTitle,
  articleId,
}: ArticleSubmittedAdminEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Yeni Yazı Bildirimi - HALO Dergisi Admin</Preview>
      <Tailwind
        config={{
          presets: [pixelBasedPreset],
        }}
      >
        <Body className='bg-gray-50 font-sans'>
          <Container className='mx-auto mb-16 overflow-hidden rounded-lg bg-white p-0 shadow-sm'>
            <Section className='bg-slate-900 px-12 py-8 text-white'>
              <Text className='m-0 text-3xl font-extrabold text-white'>HALO Yönetim Paneli</Text>
              <Text className='mt-2 text-lg text-slate-300'>Yeni Makale / Yazı Bildirimi</Text>
            </Section>

            <Section className='px-12 py-8'>
              <Text className='text-xl font-bold text-gray-900'>Merhaba {adminName},</Text>
              <Text className='mt-3 text-base leading-relaxed text-gray-700'>
                Sisteme yeni bir yazı gönderimi yapılmıştır:
              </Text>

              <div className='my-6 space-y-2 rounded-lg border border-slate-200 bg-slate-50 p-6'>
                <Text className='m-0 text-sm font-semibold tracking-wider text-gray-500 uppercase'>
                  Yazı Detayları
                </Text>
                <Text className='m-0 text-lg font-bold text-gray-900'>📌 {articleTitle}</Text>
                <Text className='m-0 text-sm text-gray-700'>
                  <strong>İlan:</strong> {callTitle}
                </Text>
                <Text className='m-0 text-sm text-gray-700'>
                  <strong>Yazar:</strong> {authorName} ({authorEmail})
                </Text>
              </div>
            </Section>

            <Section className='px-12 py-4 text-center'>
              <Button
                href={`${process.env.WEB_URL || "https://haloidergisi.com"}/dashboard/submissions/${articleId}`}
                className='rounded-lg bg-slate-900 px-8 py-3 text-center text-base font-bold text-white shadow-md'
              >
                Yazıyı İncele ve Değerlendir
              </Button>
            </Section>

            <Hr className='mx-0 my-8 border-gray-200' />

            <Section className='px-12 pb-8 text-center'>
              <Text className='m-1 text-sm text-gray-600'>
                © 2026 HALO Dergisi Yönetim Bildirim Sistemi
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}

ArticleSubmittedAdminEmail.PreviewProps = {
  adminName: "Editör",
  authorName: "Ahmet Yılmaz",
  authorEmail: "ahmet@example.com",
  articleTitle: "Yapay Zeka ve Edebiyatın Geleceği",
  callTitle: "2026 Güz Sayısı İlanı",
  articleId: "sample-article-id",
} satisfies ArticleSubmittedAdminEmailProps;
