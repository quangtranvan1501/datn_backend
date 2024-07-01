const nodemailer = require('nodemailer');
const config = require('../config/config');
const logger = require('../config/logger');

const transport = nodemailer.createTransport(config.email.smtp);
/* istanbul ignore next */
if (config.env !== 'test') {
  transport
    .verify()
    .then(() => logger.info('Connected to email server'))
    .catch(() => logger.warn('Unable to connect to email server. Make sure you have configured the SMTP options in .env'));
}

/**
 * Send an email
 * @param {string} to
 * @param {string} subject
 * @param {string} text
 * @returns {Promise}
 */
const sendEmail = async (to, subject, text) => {
  const msg = { from: config.email.from, to, subject, text };
  await transport.sendMail(msg);
};

/**
 * Send reset password email
 * @param {string} to
 * @param {string} token
 * @returns {Promise}
 */
// const sendResetPasswordEmail = async (to, token) => {
//   const subject = 'Reset password';
//   // replace this url with the link to the reset password page of your front-end app
//   const resetPasswordUrl = `http://localhost:3000/v1/auth/reset-password?token=${token}`;
//   const text = `Dear user,
// To reset your password: ${token}
// If you did not request any password resets, then ignore this email.`;
//   await sendEmail(to, subject, text);
// };
const sendResetPasswordEmail = async (to, token) => {
  const subject = 'Reset password';
  const html = `Dear user,
 Mật khẩu mới của bạn là: ${token}
  `;
  await sendEmail(to, subject, html);
};

/**
 * Send verification email
 * @param {string} to
 * @param {string} token
 * @returns {Promise}
 */
const sendVerificationEmail = async (to, token) => {
  const subject = 'Email Verification';
  // replace this url with the link to the email verification page of your front-end app
  const verificationEmailUrl = `https://phongkhamthaithinh.website/welcome?token=${token}`;
  const text = `Dear user,
Để xác nhận địa chỉ email, bạn hãy click vào link sau: ${verificationEmailUrl}`;
  await sendEmail(to, subject, text);
};

module.exports = {
  transport,
  sendEmail,
  sendResetPasswordEmail,
  sendVerificationEmail,
};
