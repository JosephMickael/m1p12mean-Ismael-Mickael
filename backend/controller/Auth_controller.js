const express = require('express');
const Utilisateur = require('../models/Utilisateur')


// Authentificaiton
const login = async (req, res) => {
    const { email, motDePasse } = req.body;

    const utilisateur = await Utilisateur.findOne({ email });
    if (!utilisateur) {
        return res.status(400).send('Utilisateur non trouvé');
    }

    const isMatch = await utilisateur.compareMotDePasse(motDePasse);
    if (!isMatch) {
        return res.status(400).send('Mot de passe incorrect');
    }

    res.status(200).send('Connexion réussie');
}

// Déconnexion (pas encore de session/token)
const logout = async (req, res) => {
    try {
        res.status(200).json({ message: "Déconnexion réussie" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = { login, logout };
