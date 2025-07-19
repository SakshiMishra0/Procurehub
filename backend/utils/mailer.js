import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST, // mailtrap SMTP host
  port: 587,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

export const sendMail = async ({ to, subject, html }) => {
  await transporter.sendMail({
    from: `"ProcureHub" <${process.env.MAIL_USER}>`,
    to,
    subject,
    html,
  });
};
