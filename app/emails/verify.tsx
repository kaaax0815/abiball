import { Body } from '@react-email/body';
import { Button } from '@react-email/button';
import { Container } from '@react-email/container';
import { Head } from '@react-email/head';
import { Heading } from '@react-email/heading';
import { Html } from '@react-email/html';
import { Img } from '@react-email/img';
import { Link } from '@react-email/link';
import { Preview } from '@react-email/preview';
import { render } from '@react-email/render';
import { Section } from '@react-email/section';
import { Text } from '@react-email/text';

export type VerifyProps = {
  verifyUrl: string;
  logoUrl: string;
};

const DefaultVerifyProps: VerifyProps = {
  verifyUrl: 'https://example.com/api/email?token=123',
  logoUrl: 'https://example.com/Logo.png'
};

export function Verify({
  verifyUrl = DefaultVerifyProps.verifyUrl,
  logoUrl = DefaultVerifyProps.logoUrl
}: VerifyProps) {
  return (
    <Html>
      <Head />
      <Preview>Verifiziere deine Email-Adresse</Preview>
      <Body style={main}>
        <Container>
          <Img src={logoUrl} alt="Logo" height={150} width={327} style={logo} />
          <Heading>Verifiziere deine Email-Adresse</Heading>
          <Text>Klicke auf den Button um deine Email-Adresse zu verifizieren.</Text>
          <Section style={btnSection}>
            <Button pX={12} pY={12} style={button} href={verifyUrl}>
              Email-Adresse verifizieren
            </Button>
          </Section>
          <Text style={text}>
            Wenn der Button nicht funktioniert, kopiere den folgenden Link in deinen Browser:
          </Text>
          <Section>
            <Link href={verifyUrl}>{verifyUrl}</Link>
          </Section>
          <Text style={text}>
            Wenn du dich nicht bei uns registriert hast, kannst du diese Email einfach ignorieren.
          </Text>
          <Text style={text}>
            Grüße,
            <br />
            Abiball Team
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

export default function renderVerify(props: VerifyProps) {
  return {
    html: render(<Verify {...props} />, {
      pretty: false
    }),
    text: render(<Verify {...props} />, {
      pretty: false,
      plainText: true
    })
  };
}

const btnSection = {
  textAlign: 'center'
} satisfies React.CSSProperties;

const logo = {
  margin: '0 auto'
} satisfies React.CSSProperties;

const button = {
  backgroundColor: '#5F51E8',
  borderRadius: '3px',
  color: '#fff',
  fontSize: '16px',
  textDecoration: 'none',
  textAlign: 'center',
  display: 'block'
} satisfies React.CSSProperties;

const text = {
  color: '#000',
  fontSize: '14px',
  lineHeight: '24px'
} satisfies React.CSSProperties;

const main = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif"
} satisfies React.CSSProperties;
