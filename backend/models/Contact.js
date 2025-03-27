const mongoose = require('mongoose');
const Utilisateur = require('../models/Utilisateur');

const contactSchema = new mongoose.Schema({
    client: { type: mongoose.Schema.Types.ObjectId, ref: "Utilisateur", required: true },
    managers: [{ type: mongoose.Schema.Types.ObjectId, ref: "Utilisateur" }], // Liste des managers
    title: { type: String, required: true },
    content: { type: String, required: true },
    readBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "Utilisateur" }] // Managers ayant lu le message
}, { timestamps: true });

module.exports = mongoose.model('Contact', contactSchema); 
