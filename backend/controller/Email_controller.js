const express = require('express');
const { sendEmailToClient } = require("./../service/emailService");

const sendEmail = async (req, res) => {
    const { email, subject, message } = req.body;

    if (!req.utilisateur) {
        return res.status(401).json({ message: 'Utilisateur non authentifié.' });
    }

    if (!email || !subject || !message) {
        return res.status(400).json({ error: "Tous les champs sont requis" });
    }

    const result = await sendEmailToClient(email, subject, message);

    if (result.success) {
        res.status(200).json({ message: "E-mail envoyé avec succès !" });
    } else {
        res.status(500).json({ error: "Échec de l'envoi de l'e-mail" });
    }
}

const sendDevisMail = async (req, res) => {
    const { client, services, totalGeneral, clientMail } = req.body;

    const result = await sendDevisMail(client, services, totalGeneral, clientMail);

    if (result.success) {
        res.status(200).json({ message: "E-mail envoyé avec succès !" });
    } else {
        res.status(500).json({ error: "Échec de l'envoi de l'e-mail" });
    }
}

module.exports = { sendEmail, sendDevisMail };
