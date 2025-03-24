const jwt = require('jsonwebtoken');
const Utilisateur = require('../models/Utilisateur');

// Vérifie l'utilisateur connecté par son token
const verifierAuthentification = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
        return res.status(401).json({ message: 'Accès non autorisé, token manquant' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Au cas ou l'utilasateur n'est pas trouvé
        Utilisateur.findById(decoded.userId).then(utilisateur => {
            if (!utilisateur) {
                return res.status(401).json({ message: 'Utilisateur non trouvé' });
            }
            req.utilisateur = utilisateur;
            next();
        }).catch(error => {
            return res.status(500).json({ message: 'Erreur de vérification de l\'utilisateur', error: error.message });
        });

    } catch (error) {
        return res.status(401).json({ message: 'Token invalide ou expiré' });
    }
};

module.exports = verifierAuthentification;