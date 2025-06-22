import {
  Body,
  Button,
  Container,
  Font,
  Head,
  Html,
  Link,
  Preview,
  Section,
  Tailwind,
  Text
} from "@react-email/components";
import { StyledButton } from "~/components/styled-button";

export interface WelcomeProps {
  name?: string;
}

export default function Welcome() {
  return (
    <Html lang='tr'>
      <Head>
        <Font
          fontFamily='Open Sans'
          fallbackFontFamily={["Arial", "sans-serif"]}
          webFont={{
            url: "https://fonts.gstatic.com/s/opensans/v43/memtYaGs126MiZpBA-UFUIcVXSCEkx2cmqvXlWqWuU6F.woff2",
            format: "woff2"
          }}
          fontWeight={400}
          fontStyle='normal'
        />
      </Head>
      <Body>
        <Tailwind>
          <Preview>Welcome to HALO</Preview>
          <Container>
            <Text className='text-2xl font-bold text-gray-900'>
              Hoş geldiniz!
            </Text>
            <Text className='mt-4 text-gray-700'>
              HALO'ya katıldığınız için teşekkür ederiz. Size en iyi deneyimi
              sunmak için buradayız.
            </Text>
            <Text className='mt-4 text-gray-700'>
              Daha fazla bilgi almak için lütfen web sitemizi ziyaret edin.
            </Text>
            <Section>
              <StyledButton href='https://example.com'>
                Hello World
              </StyledButton>
              <Link>Click Me</Link>
            </Section>
          </Container>
        </Tailwind>
      </Body>
    </Html>
  );
}
