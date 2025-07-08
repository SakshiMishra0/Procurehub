const nodemailer = require("nodemailer");
require("dotenv").config(); // ✅ This ensures env vars are available inside this file

let transporter;
const queue = [];

(async () => {
  transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });

  try {
    await transporter.verify();
    console.log("📬 Mailer ready");
  } catch (e) {
    console.error("❌ Mailer error:", e);
  }

  for (const { args, resolve, reject } of queue) {
    transporter
      .sendMail(...args)
      .then(resolve)
      .catch(reject);
  }
})();

module.exports = {
  sendMail: async (...args) => {
    if (transporter) return transporter.sendMail(...args);
    return new Promise((resolve, reject) =>
      queue.push({ args, resolve, reject })
    );
  },
};
