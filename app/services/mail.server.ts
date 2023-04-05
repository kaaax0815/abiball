import nodemailer from 'nodemailer';
import Transport from 'nodemailer-sendinblue-transport';

const sendinblueKey = process.env.SENDINBLUE_KEY;
if (!sendinblueKey) {
  throw new Error('SENDINBLUE_KEY is not defined');
}

export const transporter = nodemailer.createTransport(new Transport({ apiKey: sendinblueKey }));
