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

const getUserById = async (req, res) => {
    try {
        const utilisateur = Utilisateur.findById(req.params.id)
        res.json(utilisateur)
    } catch (err) {
        res.status(500).json({ message: error.message })
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
        if (error.code === 11000) {
            return res.status(400).json({ message: 'Email déjà utilisé' });
        }
        res.status(400).json({ message: error.message });
    }
}

// Met à jour un utilisateur existant
const updateUser = async (req, res) => {
    try {
        const { nom, email, motDePasse, role } = req.body;

        const updatedUser = await Utilisateur.findByIdAndUpdate(
            req.params.id,
            { nom, email, motDePasse, role },
            { new: true }
        );

        res.json(updatedUser);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

const getCurrentUser = async (req, res) => {
    res.json({
        userId: req.utilisateur._id,
        email: req.utilisateur.email,
        nom: req.utilisateur.name,
        role: req.utilisateur.role
    });
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

module.exports = { getAllUser, createUser, getUserById, updateUser, getCurrentUser, deleteUser }
