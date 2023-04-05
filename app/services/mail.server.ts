import nodemailer from 'nodemailer';
import type { HbsTransporter } from 'nodemailer-express-handlebars';
import Transport from 'nodemailer-sendinblue-transport';

import { returnBasedOnEnv } from '~/utils/debug.server';

import { handlebars } from '../utils/handlebars.server';

const sendinblueKey = process.env.SENDINBLUE_KEY;
if (!sendinblueKey) {
  throw new Error('SENDINBLUE_KEY is not defined');
}

const etherealConfig = {
  host: 'smtp.ethereal.email',
  port: 587,
  auth: {
    user: process.env.ETHEREAL_MAIL,
    pass: process.env.ETHEREAL_PASSWORD
  }
};

export const transporter = nodemailer.createTransport(
  returnBasedOnEnv({ prod: new Transport({ apiKey: sendinblueKey }), dev: etherealConfig })
) as HbsTransporter;
transporter.use('compile', handlebars);
