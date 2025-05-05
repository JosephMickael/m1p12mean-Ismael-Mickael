const express = require('express');
const router = express.Router();
const Utilisateur = require('../models/Utilisateur')
const bcrypt = require('bcrypt')

// recupere tout les utilisateurs
const getAllUser = async (req, res) => {
    try {
        const utilisateurs = await Utilisateur.find()

        res.json(utilisateurs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const getAllManagers = async (req, res) => {
    try {
        const managers = await Utilisateur.find({ role: 'manager' })

        res.json(managers)
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const getUserById = async (req, res) => {
    try {
        const utilisateur = await Utilisateur.findById(req.params.id)
        res.json(utilisateur)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

const usersDetails = async (req, res) => {
    try {
        const lastClients = await Utilisateur.find({ role: 'client' }).sort({ createdAt: -1 }).limit(3)
        const lastMecaniciens = await Utilisateur.find({ role: 'mecanicien' }).sort({ createdAt: -1 }).limit(3)
        const totalClients = await Utilisateur.countDocuments({ role: 'client' })
        const totalMecaniciens = await Utilisateur.countDocuments({ role: 'mecanicien' })

        // console.log("Données récupérées :", { lastClients, lastMecaniciens, totalClients, totalMecaniciens })

        res.json({
            lastClients: lastClients,
            lastMecaniciens: lastMecaniciens,
            totalClients: totalClients,
            totalMecaniciens: totalMecaniciens
        })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

// Ajoute un nouvel utilisateur
const createUser = async (req, res) => {
    try {
        const { nom, email, motDePasse, role, specialite } = req.body;

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
            role: roles,
            specialite
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
        const { nom, email, motDePasse, role, specialite } = req.body;

        const updatedUser = await Utilisateur.findByIdAndUpdate(
            req.params.id,
            { nom, email, motDePasse, role, specialite },
            { new: true }
        );

        res.json(updatedUser);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

const updatePassword = async (req, res) => {
    const { currentPassword, newPassword, confirmPassword } = req.body;

    try {
        if (!currentPassword || !newPassword || !confirmPassword) {
            return res.status(400).json({ message: "Tous les champs sont requis." });
        }

        if (newPassword !== confirmPassword) {
            return res.status(400).json({ message: "Le nouveau mot de passe et la confirmation ne correspondent pas." });
        }

        // Récupérer l'utilisateur par son ID
        const utilisateur = await Utilisateur.findById(req.utilisateur._id);

        if (!utilisateur) {
            return res.status(404).json({ message: "Utilisateur non trouvé." });
        }

        // Vérifier si le mot de passe actuel est correct
        const isMatch = await utilisateur.compareMotDePasse(currentPassword);
        if (!isMatch) {
            return res.status(400).json({ message: "Le mot de passe actuel est incorrect." });
        }

        // Mettre à jour le mot de passe
        // Le hachage est pris en charge dans le model (pre)
        utilisateur.motDePasse = newPassword;
        await utilisateur.save();

        res.status(200).json({ message: "Mot de passe modifié avec succès." });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur du serveur." });
    }
};

const getCurrentUser = async (req, res) => {
    res.json({
        userId: req.utilisateur._id,
        email: req.utilisateur.email,
        nom: req.utilisateur.name,
        role: req.utilisateur.role,
        specialite: req.utilisateur.specialite,
        dateCreation: req.utilisateur.createdAt
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

// recupere tous les utilisateurs selon la gestion de devis
const getAllUserDevis = async (req, res) => {
    try {
        let users = {};

        if (req.utilisateur.role == "mecanicien") {
            users.client = await Utilisateur.find({ role: "client" });
        } else if (req.utilisateur.role == "manager") {
            users.client = await Utilisateur.find({ role: "client" });
            users.mecanicien = await Utilisateur.find({ role: "mecanicien" });
        } else if (req.utilisateur.role == "client") {
            users.client = null
        }
        else {
            return res.status(403).json({ message: "Accès refusé" });
        }

        return res.status(200).json(users);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}


module.exports = { getAllUserDevis, getAllUser, createUser, getUserById, updateUser, updatePassword, getCurrentUser, deleteUser, usersDetails, getAllManagers }
