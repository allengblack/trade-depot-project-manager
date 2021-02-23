import dotenv from 'dotenv';
import Nexmo from "nexmo";
import nodemailer from "nodemailer";
import * as Mailgun from 'mailgun-js';

dotenv.config();

export const transport = nodemailer.createTransport({
  host: "smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: process.env.MAILTRAP_USER,
    pass: process.env.MAILTRAP_PASS
  }
});

export const nexmo = new Nexmo({
  apiKey: process.env.NEXMO_KEY,
  apiSecret: process.env.NEXMO_SECRET
})

export const gunner = Mailgun.default({
  apiKey: '3e139942e454c21cf4d88cf39f5f91b2-6e0fd3a4-54801fa3',
  domain: 'sandbox72fb9a060c11490c950d2c0f6aec76ac.mailgun.org'
});

// const data = {
//   from: 'Admin <tradedepottest@sandbox72fb9a060c11490c950d2c0f6aec76ac.mailgun.org>',
//   to: 'allengblack@gmail.com,	tradedepotinterview@mailinator.com',
//   subject: 'Hi',
//   text: 'Testing some Mailgun awesomeness!'
// };


// // gunner.messages().send(data, (error, body) => {
// //   console.log(body);
// // });
