const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.APP_EMAIL,
    pass: process.env.APP_PASSWORD,
  },
});

const OTP_EMAIL_TEMPLATES = {
  EMAIL_VERIFICATION: {
    subject: 'Verify your email | Chatty 💬',
    text: (otp) =>
      `Your OTP to verify your email is ${otp}. It will expire in 10 minutes.`,
  },
  PASSWORD_RESET: {
    subject: 'Reset password | Chatty 💬',
    text: (otp) =>
      `Your OTP to reset your password is ${otp}. It will expire in 10 minutes.`,
  },
};

const sendEmail = async (email, otp, purpose = 'PASSWORD_RESET') => {
  const template =
    OTP_EMAIL_TEMPLATES[purpose] || OTP_EMAIL_TEMPLATES.PASSWORD_RESET;

  const mailOptions = {
    from: process.env.APP_EMAIL,
    to: email,
    subject: template.subject,
    text: template.text(otp),
  };

  return transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
