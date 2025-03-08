const express = require('express');
const Utilisateur = require('../models/Utilisateur')
const jwt = require('jsonwebtoken');


// Authentificaiton
const login = async (req, res) => {
    try {
        const { email, motDePasse } = req.body;
        const utilisateur = await Utilisateur.findOne({ email });

        if (!utilisateur || !(await utilisateur.compareMotDePasse(motDePasse))) {
            return res.status(401).json({ message: "Email ou mot de passe incorrect" });
        }

        // Vérifiez que process.env.JWT_SECRET existe
        if (!process.env.JWT_SECRET) {
            throw new Error('JWT_SECRET non défini');
        }

        const token = jwt.sign(
            { userId: utilisateur._id },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({
            token,
            user: {
                _id: utilisateur._id,
                email: utilisateur.email,
                role: utilisateur.role
            }
        });
    } catch (error) {
        console.error('Erreur lors de la connexion:', error);
        res.status(500).json({ message: error.message });
    }
};

// Déconnexion (pas encore de session/token)
const logout = async (req, res) => {
    try {
        res.status(200).json({ message: "Déconnexion réussie" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = { login, logout };
