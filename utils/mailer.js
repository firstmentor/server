const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  secure: false,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

const sendEmailWithAttachment = async (options) => {
  const { to, subject, html, attachments } = options;

  return transporter.sendMail({
    from: `"SR | Web Consultancy Services Jobs" <${process.env.MAIL_USER}>`,
    to,
    subject,
    html,
    attachments, // 👈 Pass resume here
  });
};

module.exports = sendEmailWithAttachment;
