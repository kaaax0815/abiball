declare module 'nodemailer-sendinblue-transport' {
  export default class SendinblueTransport {
    constructor({ apiKey }: { apiKey: string });
  }
}
