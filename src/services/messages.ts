import dotenv from 'dotenv';
import * as Mailgun from 'mailgun-js';

dotenv.config();

export const gunner = Mailgun.default({
  apiKey: process.env.MAILGUN_KEY,
  domain: process.env.MAILGUN_DOMAIN
});