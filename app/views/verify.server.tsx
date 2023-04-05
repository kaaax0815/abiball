/* eslint-disable tailwindcss/no-custom-classname */
import { renderToString } from 'react-dom/server';

import Footer from './partials/Footer.server';
import Head from './partials/Head.server';

export type VerifyProps = {
  verify_url: string;
  origin: string;
  logo: string;
};

function Verify({ verify_url, origin, logo }: VerifyProps) {
  return (
    <Head subject="Verifiziere deine Email-Adresse">
      <div>
        <div
          className="preheader"
          style={{
            display: 'none',
            maxWidth: 0,
            maxHeight: 0,
            overflow: 'hidden',
            fontSize: '1px',
            lineHeight: '1px',
            color: '#fff',
            opacity: 0
          }}
        >
          Um Abiball zu benutzen musst du deine Email-Adresse verifizieren
        </div>
        <table border={0} cellPadding={0} cellSpacing={0} width="100%">
          <tbody>
            <tr>
              <td align="center" style={{ backgroundColor: '#e9ecef' }}>
                <table
                  border={0}
                  cellPadding={0}
                  cellSpacing={0}
                  width="100%"
                  style={{ maxWidth: '600px' }}
                >
                  <tbody>
                    <tr>
                      <td align="center" valign="top" style={{ padding: '36px 24px' }}>
                        <a
                          href={origin}
                          target="_blank"
                          style={{ display: 'inline-block' }}
                          rel="noreferrer"
                        >
                          <img
                            src={logo}
                            alt="Logo"
                            width={48}
                            style={{
                              display: 'block',
                              width: '48px',
                              maxWidth: '48px',
                              minWidth: '48px'
                            }}
                          />
                        </a>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>
            <tr>
              <td align="center" style={{ backgroundColor: '#e9ecef' }}>
                <table
                  border={0}
                  cellPadding={0}
                  cellSpacing={0}
                  width="100%"
                  style={{ maxWidth: '600px' }}
                >
                  <tbody>
                    <tr>
                      <td
                        align="left"
                        style={{
                          padding: '36px 24px 0',
                          fontFamily: '"Source Sans Pro", Helvetica, Arial, sans-serif',
                          borderTop: '3px solid #d4dadf',
                          backgroundColor: '#ffffff'
                        }}
                      >
                        <h1
                          style={{
                            margin: 0,
                            fontSize: '32px',
                            fontWeight: 700,
                            letterSpacing: '-1px',
                            lineHeight: '48px'
                          }}
                        >
                          Verifiziere deine Email-Adresse
                        </h1>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>
            <tr>
              <td align="center" style={{ backgroundColor: '#e9ecef' }}>
                <table
                  border={0}
                  cellPadding={0}
                  cellSpacing={0}
                  width="100%"
                  style={{ maxWidth: '600px' }}
                >
                  <tbody>
                    <tr>
                      <td
                        align="left"
                        style={{
                          padding: '24px',
                          fontFamily: '"Source Sans Pro", Helvetica, Arial, sans-serif',
                          fontSize: '16px',
                          lineHeight: '24px',
                          backgroundColor: '#ffffff'
                        }}
                      >
                        <p style={{ margin: 0 }}>
                          Tippe unten auf die Schaltfläche, um deine E-Mail-Adresse zu verifizieren.
                          Wenn du kein Konto bei <a href={origin}>Abiball</a> erstellt hast, kannst
                          du diese E-Mail getrost löschen.
                        </p>
                      </td>
                    </tr>
                    <tr>
                      <td align="left" style={{ backgroundColor: '#ffffff' }}>
                        <table border={0} cellPadding={0} cellSpacing={0} width="100%">
                          <tbody>
                            <tr>
                              <td
                                align="center"
                                style={{ padding: '12px', backgroundColor: '#ffffff' }}
                              >
                                <table border={0} cellPadding={0} cellSpacing={0}>
                                  <tbody>
                                    <tr>
                                      <td
                                        align="center"
                                        style={{ borderRadius: '6px', backgroundColor: '#1a82e2' }}
                                      >
                                        <a
                                          href={verify_url}
                                          target="_blank"
                                          rel="noreferrer"
                                          style={{
                                            display: 'inline-block',
                                            padding: '16px 36px',
                                            fontFamily:
                                              '"Source Sans Pro", Helvetica, Arial, sans-serif',
                                            fontSize: '16px',
                                            color: '#ffffff',
                                            textDecoration: 'none',
                                            borderRadius: '6px'
                                          }}
                                        >
                                          Email-Adresse verifizieren
                                        </a>
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </td>
                    </tr>
                    <tr>
                      <td
                        align="left"
                        style={{
                          padding: '24px',
                          fontFamily: '"Source Sans Pro", Helvetica, Arial, sans-serif',
                          fontSize: '16px',
                          lineHeight: '24px',
                          backgroundColor: '#ffffff'
                        }}
                      >
                        <p style={{ margin: 0 }}>
                          Wenn das nicht funktioniert, kopiere den folgenden Link und füge ihn in
                          deinen Browser ein:
                        </p>
                        <p style={{ margin: 0 }}>
                          <a href={verify_url} target="_blank" rel="noreferrer">
                            {verify_url}
                          </a>
                        </p>
                      </td>
                    </tr>
                    <tr>
                      <td
                        align="left"
                        style={{
                          padding: '24px',
                          fontFamily: '"Source Sans Pro", Helvetica, Arial, sans-serif',
                          fontSize: '16px',
                          lineHeight: '24px',
                          borderBottom: '3px solid #d4dadf',
                          backgroundColor: '#ffffff'
                        }}
                      >
                        <p style={{ margin: 0 }}>
                          Grüße,
                          <br /> Abiball Team
                        </p>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>
          </tbody>
          <Footer typeOfAction="VERIFY" />
        </table>
      </div>
    </Head>
  );
}

export default function verifyTemplate(props: VerifyProps) {
  return renderToString(<Verify {...props} />);
}
