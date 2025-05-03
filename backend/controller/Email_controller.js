const express = require('express');
const emailService = require("./../service/emailService");
const { sendEmailToClient } = require("./../service/emailService");

const sendEmail = async (req, res) => {
    const { email, subject, message } = req.body;

    if (!req.utilisateur) {
        return res.status(401).json({ message: 'Utilisateur non authentifié.' });
    }

    if (!email || !subject || !message) {
        return res.status(400).json({ error: "Tous les champs sont requis" });
    }

    const result = await emailService.sendEmailToClient(email, subject, message);

    if (result.success) {
        res.status(200).json({ message: "E-mail envoyé avec succès !" });
    } else {
        res.status(500).json({ error: "Échec de l'envoi de l'e-mail" });
    }
}

const sendDevisMailPost = async (req, res) => {
    try {
        const { email, subject, message } = req.body;
        //console.log("ReqFiles ", req.file); 

        const attachment = req.file;
        const result = await emailService.sendDevisMail(email, subject, message, attachment);

        res.status(200).json({ message: "E-mail envoyé avec succès !" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Échec de l'envoi de l'e-mail" });
    }
}

module.exports = { sendEmail, sendDevisMailPost };
