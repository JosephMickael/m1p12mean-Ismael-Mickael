const express = require('express');
const Utilisateur = require('../models/Utilisateur');
const Contact = require('../models/Contact');

// Envoyer un message à tous les managers
const sendMessage = async (req, res) => {
    try {
        const { clientId, title, content } = req.body;
        console.log(clientId)

        const managers = await Utilisateur.find({ role: "manager" }).select('_id');
        const managerIds = managers.map(manager => manager._id);

        const newMessage = new Contact({
            client: clientId,
            managers: managerIds,
            title,
            content
        });

        await newMessage.save();

        res.status(201).json({ message: "Message envoyé avec succès" });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de l'envoi du message", error: error.message });
    }
}

// Récupère les messages (pour tous les managers)
const getMessage = async (req, res) => {
    try {
        const messages = await Contact.find({ managers: 'manager' })
            .populate('client', 'nom email')
        res.json(messages)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

// Marquer "lu ou vu" par les managers 
const markAsRead = async (req, res) => {
    try {
        const { managerId } = res.body
        const message = await Contact.findById(req.params.messageId)

        if (!message) {
            return res.status(404).json({ error: "Message non trouvé" });
        }

        // Ajout dans la liste des lecteurs si le manager n'y est pas
        if (!message.readBy.includes(managerId)) {
            message.readBy.push(managerId);
            await message.save();
        }

        res.json({ message: "Lu par un manager" });
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

module.exports = { sendMessage, getMessage, markAsRead }
