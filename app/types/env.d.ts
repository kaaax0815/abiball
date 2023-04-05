declare global {
  namespace NodeJS {
    interface ProcessEnv {
      COOKIE_SECRET: string | undefined;
      AZTEC_SECRET: string | undefined;
      EMAIL_SECRET: string | undefined;
      DATABASE_URL: string | undefined;
      STRIPE_KEY: string | undefined;
      STRIPE_WEBHOOK_SECRET: string | undefined;
      STRIPE_TICKET_ID: string | undefined;
      SENDINBLUE_KEY: string | undefined;
      ETHEREAL_MAIL: string | undefined;
      ETHEREAL_PASSWORD: string | undefined;
    }
  }
}

export {};
