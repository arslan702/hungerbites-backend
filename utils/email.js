const nodemailer = require("nodemailer");

exports.sendEmail = async (email, subject, text, token) => {
  try {
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 456,
      service: "gmail",
      auth: {
        user: 'arslanra761@gmail.com',
        pass: 'omer/786',
      },
    });

    const mailOptions = {
      from: 'arslanra761@gmail.com',
      to: 'muhammadarslanjabbar@gmail.com',
      subject: subject,
      text: text,
      // subject: "Password Reset Request",
      // text: `Hi, you recently requested to reset your password. Please click on the link below to reset your password:\n\n${process.env.CLIENT_URL}/resetpassword/${token}`,
    };

    const result = await transporter.sendMail(mailOptions);
    console.log(`Reset password email sent to ${email}.`);
    return result;
  } catch (error) {
    console.error(error);
    return null;
  }
};
