const nodemailer = require("nodemailer");
require('dotenv').config();

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
        console.log("E-mail envoyé : ", info.response);
        return { success: true, info };
    } catch (error) {
        console.error("Erreur lors de l'envoi de l'e-mail : ", error);
        return { success: false, error };
    }
};

const sendDevisMail = async (client, services, totalGeneral, clientMail) => {

    const mailOptions = {
      from: process.env.EMAIL_FROM,  
      to: clientMail, 
      subject: `Devis pour ${client}`,
      html: `
        <h2>Devis pour ${client}</h2>
        <p><strong>Total Général :</strong> ${totalGeneral}€</p>
        <h3>Services :</h3>
        <ul>
          ${services.map(s => `<li>${s.description} - ${s.coutServices}€</li>`).join('')}
        </ul>
      `
    };
  
    try {
      await transporter.sendMail(mailOptions);
      res.status(200).json({ message: 'E-mail envoyé avec succès via Mailtrap' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Erreur lors de l’envoi du mail' });
    }
  };

module.exports = {sendEmailToClient, sendDevisMail};
