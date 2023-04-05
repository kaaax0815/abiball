export type FooterProps = {
  typeOfAction: string;
};

export default function Footer({ typeOfAction }: FooterProps) {
  return (
    <table border={0} cellPadding={0} cellSpacing={0} width="100%" style={{ maxWidth: '600px' }}>
      <tbody>
        <tr>
          <td
            align="center"
            style={{
              padding: '12px 24px',
              fontFamily: '"Source Sans Pro", Helvetica, Arial, sans-serif',
              fontSize: '14px',
              lineHeight: '20px',
              color: '#666',
              backgroundColor: '#e9ecef'
            }}
          >
            <p style={{ margin: 0 }}>
              Sie haben diese E-Mail erhalten, weil wir eine Anfrage für {typeOfAction} für Ihr
              Konto erhalten haben. Wenn Sie {typeOfAction} nicht angefordert haben, können Sie
              diese E-Mail getrost löschen.
            </p>
          </td>
        </tr>
      </tbody>
    </table>
  );
}
