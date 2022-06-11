// const Client = require('twilio');
const sendGridMail = require('@sendgrid/mail');
const axios = require('axios');
const qs = require('qs');
const logger = require('./logger');
const { throwError } = require('./handle-error');

const {
  // TWILIO_ACCOUNT_SID,
  // TWILIO_AUTH_TOKEN,
  // TWILIO_PHONE_NUMBER,
  SENDGRID_API_KEY,
  SENDGRID_EMAIL_FROM,
  MULTITEXT_EMAIL,
  MULTITEXT_PASSWORD,
  MULTITEXT_SENDER_NAME,
  MULTITEXT_URL,
} = require('../config');

// const accountSid = TWILIO_ACCOUNT_SID;
// const authToken = TWILIO_AUTH_TOKEN;
// const clientTwilio = new Client(accountSid, authToken);
sendGridMail.setApiKey(SENDGRID_API_KEY);

// Send SMS using Twilio
// const sendSms = async (to, body) => {
//   clientTwilio.messages
//     .create({
//       body,
//       from: TWILIO_PHONE_NUMBER,
//       to,
//     })
//     .then(() => console.log('SMS sent successfully'))
//     .catch((err) => throwError(err.message, 500));
// };

const sendSms = async (to, body) => {
  const data = qs.stringify({
    sender_name: MULTITEXT_SENDER_NAME,
    message: body,
    recipients: to,
    email: MULTITEXT_EMAIL,
    password: MULTITEXT_PASSWORD,
  });
  const config = {
    method: 'post',
    url: MULTITEXT_URL,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    data,
  };

  axios(config)
    .then(() => {
      logger.info(`SMS sent successfully to ${to}`);
    })
    .catch((error) => {
      console.log(error);
    });
};

// Send Email using SendGrid
// eslint-disable-next-line consistent-return
const sendMail = async (email, subject, message) => {
  try {
    const data = {
      to: `${email}`,
      from: `JemiEats <${SENDGRID_EMAIL_FROM}>`,
      subject,
      html: message,
    };
    await sendGridMail.send(data);
    logger.info(`SMS sent successfully to ${email}`);
  } catch (err) {
    logger.log({
      level: 'error',
      message: err.message,
    });
    return throwError(err.message, 404);
  }
};

module.exports = { sendSms, sendMail };
