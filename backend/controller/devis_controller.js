const Devis  = require('../models/Devis'); 
const Utilisateur = require('../models/Utilisateur');

// recupere tous les utilisateurs
const getAllUser = async (req, res) => {
    try {
        if (req.utilisateur.role == "mecanicien") {
        const client = await Utilisateur.find({ role: "client"});
        const manager = await Utilisateur.find({ role: "manager"}); 
        res.status(202).json({client, manager});

        } else if (req.utilisateur.role == "manager") {
        const client = await Utilisateur.find({ role: "client"});
        const mecanicien = await Utilisateur.find({ role: "mecanicien"});
        res.status(202).json({client, mecanicien});

        }
        return res.status(404).json({ message: "Sortie de la condition  erreur"})
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}


//  Créer un devis
const creerDevis = async (req, res) => {
    try {
        const { client, mecanicien, manager, services, pieces } = req.body;
        const nouveauDevis = new Devis({
            client,
            mecanicien,
            manager,
            services,
            pieces
        });

        await nouveauDevis.save();
        console.log("Nouveau devis ", nouveauDevis); 
        res.status(201).json({ nouveauDevis });
    } catch (error) {
        res.status(500).json({ message: " Erreur lors de la création du devis", error });
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
        const devis = await Devis.find().populate("client mecanicien manager");
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
    supprimerDevis}
