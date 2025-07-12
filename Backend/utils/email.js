
const nodemailer = require('nodemailer');

exports.sendEmail = async options => {
  // Create a transporter
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD
    }
  });

  // Define email options
  const mailOptions = {
    from: 'ReWear <no-reply@rewear.com>',
    to: options.email,
    subject: options.subject,
    text: options.message
    // html: options.html (for HTML emails)
  };

  // Send email
  await transporter.sendMail(mailOptions);
};