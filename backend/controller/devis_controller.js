const Devis  = require('../models/Devis'); 
const Utilisateur = require('../models/Utilisateur');
const nodemailer = require('nodemailer'); 


//  Créer un devis
const creerDevis = async (req, res) => {
     try {
        const mecanicien = req.utilisateur._id;
        const status = "En attente"; 
        const devisData = { ...req.body, mecanicien, status }; // Ajout du mécanicien sans extraire manuellement

        // Créer une nouvelle instance avec seulement les champs reçus
        const nouveauDevis = new Devis(devisData);

        await nouveauDevis.save();
        console.log("Nouveau devis ", nouveauDevis); 
        res.status(201).json({ nouveauDevis });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la création du devis", error });
    } 
};

//  Modifier un devis
const modifierDevis = async (req, res) => {
     try {
        const { id } = req.params;
        const devisMisAJour = await Devis.findByIdAndUpdate(id, req.body, { new: true });

        if (!devisMisAJour) {
            return res.status(404).json({ message: " Devis non trouvé" });
        }

        res.status(200).json({ message: " Devis mis à jour avec succès", devis: devisMisAJour });
     } catch (error) {
         res.status(500).json({ message: " &#x274C Erreur lors de la mise à jour", error });

     }
};

// Récupérer tous les devis
const getAllDevis = async (req, res) => {
    try {
        let devis; 
        if (req.utilisateur.role == "client") {
            const clientId = req.utilisateur._id; 
             devis = await Devis.find({ client: clientId }).populate(['client', 'mecanicien', 'services', 'pieces']);
        //console.log("liste des devis", devis)
        } else if (req.utilisateur.role == "mecanicien") {
            const mecaId = req.utilisateur._id; 
             devis = await Devis.find({ mecanicien: mecaId }).populate(['client', 'mecanicien', 'services', 'pieces']);
        } else if (req.utilisateur.role == "manager") {
            devis = await Devis.find().populate(['client', 'mecanicien', 'services', 'pieces']);
            //console.log("devis de manager", devis); 
        }
        res.status(200).json(devis);
    } catch (error) {
        res.status(500).json({ message: " Erreur lors de la récupération des devis", error });
    }
};

//  Récupérer un devis par ID
const getDevisById = async (req, res) => {
    try {
        const { id } = req.params;
        const devis = await Devis.findById(id).populate("client mecanicien manager");

        if (!devis) {
            return res.status(404).json({ message: " Devis non trouvé" });
        }

        res.status(200).json(devis);
    } catch (error) {
        res.status(500).json({ message: " Erreur lors de la récupération", error });
    }
};

//  Valider un devis
const validerDevis = async (req, res) => {
    try {
        const { id } = req.params;
        const devis = await Devis.findById(id);

        if (!devis) {
            return res.status(404).json({ message: " Devis non trouvé" });
        }

        devis.status = "Validé";
        await devis.save();

        res.status(200).json({ message: " Devis validé avec succès", devis });
    } catch (error) {
        res.status(500).json({ message: " Erreur lors de la validation", error });
    }
};

//  Supprimer un devis
const supprimerDevis = async (req, res) => {
    try {
        const { id } = req.params;
        const devisSupprime = await Devis.findByIdAndDelete(id);

        if (!devisSupprime) {
            return res.status(404).json({ message: " Devis non trouvé" });
        }

        res.status(200).json({ message: " Devis supprimé avec succès" });
    } catch (error) {
        res.status(500).json({ message: " Erreur lors de la suppression", error });
    }
};

module.exports ={creerDevis,
    modifierDevis,
    getAllDevis,
    getDevisById, 
    validerDevis,
    supprimerDevis
}
