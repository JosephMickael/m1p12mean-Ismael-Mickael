const express = require('express');
const router = express.Router();
const Utilisateur = require('../models/Utilisateur')

// recupere tout les utilisateurs
const getAllUser = async (req, res) => {
    try {
        const utilisateurs = await Utilisateur.find();

        res.json(utilisateurs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// Ajoute un nouvel utilisateur
const createUser = async (req, res) => {
    try {
        const { nom, email, motDePasse, role } = req.body;

        // Vérification du rôle
        let roles = ['client']; // rôle par défaut
        if (role && Array.isArray(role)) {
            // Vérifie si les rôles fournis sont valides
            const rolesValides = ['client', 'mecanicien', 'manager'];
            const rolesValidesFournis = role.every(r => rolesValides.includes(r));

            if (rolesValidesFournis) {
                roles = role;
            } else {
                return res.status(400).json({ message: "Rôle invalide" });
            }
        }

        const utilisateur = new Utilisateur({
            nom,
            email,
            motDePasse,
            role: roles // Utiliser le tableau de rôles
        });

        await utilisateur.save();
        res.status(201).json(utilisateur);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

// Met à jour un utilisateur existant
const updateUser = async (req, res) => {
    try {
        const { nom, email, roles } = req.body;

        const updatedUser = await Utilisateur.findByIdAndUpdate(
            req.params.id,
            { nom, email, roles },
            { new: true }
        );

        res.json(updatedUser);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

// Supprime un utilisateur
const deleteUser = async (req, res) => {
    try {
        await Utilisateur.findByIdAndDelete(req.params.id);
        res.json({ message: "Utilisateur supprimé" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = { getAllUser, createUser, updateUser, deleteUser }
