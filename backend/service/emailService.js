const nodemailer = require("nodemailer");
require('dotenv').config();
const multer = require('multer');
const fs = require('fs');
const path = require('path');


const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false, // Mettre true si port 465 (SSL)
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

const sendEmailToClient = async (clientEmail, subject, message) => {
  try {
    // Configuration du transporteur SMTP
    let mailOptions = {
      from: process.env.EMAIL_FROM,
      to: clientEmail,
      subject: subject,
      text: message,
      html: `<p>${message}</p>`
    };

    // Envoi de l'e-mail
    let info = await transporter.sendMail(mailOptions);

    return { success: true, info };
  } catch (error) {
    console.error("Erreur lors de l'envoi de l'e-mail : ", error);
    return { success: false, error };
  }
};

const sendDevisMail = async (email, subject, message, attachment) => {


  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: email,
    subject: subject,
    text: message,
    attachments: [
      {
        filename: attachment.originalname,
        content: attachment.buffer,
      }
    ]
  };

  try {
    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error("Erreur d'envoi d'e-mail :", error);
    throw new Error("Erreur lors de l’envoi du mail");
  }
};

module.exports = { sendEmailToClient, sendDevisMail };

