const nodemailer = require('nodemailer');

const sendEmail = async (to, subject, htmlContent) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.MAIL_USER, // 👉 your email
      pass: process.env.MAIL_PASS,  // 👉 app password
    },
  });

  await transporter.sendMail({
    from: `"Web  Desk" <${process.env.SMTP_EMAIL}>`,
    to,
    subject,
    html: htmlContent,
  });
};

module.exports = sendEmail;
