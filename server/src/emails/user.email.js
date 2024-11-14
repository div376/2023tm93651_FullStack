import nodemailer from 'nodemailer';
import generateToken from '../utils/generateToken.js';

export const sendEmail = async (options) => {
  try {
    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "divyachautani376@gmail.com", // sender email
        pass: "iwkz hlmn ugjn mmoa", // sender email password (or app password)
      },
    });

    // send mail with defined transport object
    const resetURL = `${process.env.FRONTEND_URL}/reset-password/${options.token}`;
    let info = await transporter.sendMail({
      from: `"Elonsol Library 👻" <rituchautani376@gmail.com>`,
      to: options.email, // recipient's email
      subject: "Elonsol Library password reset", // subject line
      html: `<a href="${resetURL}">Click here to reset your password</a>`,
    });

    console.log("Email sent: ", info.response);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};
