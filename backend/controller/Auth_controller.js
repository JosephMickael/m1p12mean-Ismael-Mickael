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

        // Vérifie que process.env.JWT_SECRET existe
        if (!process.env.JWT_SECRET) {
            throw new Error('JWT_SECRET non défini');
        }

        const token = jwt.sign(
            {
                userId: utilisateur._id,
                role: utilisateur.role,
                nom: utilisateur.nom,
                email: utilisateur.email,
                specialite: utilisateur.specialite,
                dateCreation: utilisateur.createdAt
            },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({
            token,
            user: {
                _id: utilisateur._id,
                nom: utilisateur.nom,
                email: utilisateur.email,
                role: utilisateur.role,
                specialite: utilisateur.specialite,
                dateCreation: utilisateur.createdAt
            }
        });
    } catch (error) {
        console.error('Erreur lors de la connexion:', error);
        res.status(500).json({ message: error.message });
    }
};

const logout = async (req, res) => {
    try {
        res.status(200).json({ message: "Déconnexion réussie" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = { login, logout };
