const express = require('express');
const RendezVous = require('../models/Rendezvous');
const Utilisateur = require('../models/Utilisateur');

// Recuperation de tout les rendez-vous 
const getRendezVous = async (req, res) => {
    try {
        const listeRendezVous = await RendezVous.find()
            .populate('client', 'nom email')
            .populate('mecanicien', 'nom email specialite');;
        res.json(listeRendezVous)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

// Récupération de tous les rendez-vous associés au mécanicien connecté
const getMecanicienConnecteRendezVous = async (req, res) => {
    try {
        if (!req.utilisateur) {
            return res.status(401).json({ message: "Utilisateur non authentifié" });
        }

        if (!req.utilisateur.role.includes('mecanicien')) {
            return res.status(403).json({ message: "Accès autorisé uniquement aux mécaniciens" });
        }

        const mecanicienId = req.utilisateur._id;

        // Récupérer tous les rendez-vous où ce mécanicien est assigné
        const rendezVous = await RendezVous.find({ mecanicien: mecanicienId })
            .populate('client', 'nom email')
            .sort({ date: 1, heure: 1 }); // Tri par date et heure

        return res.status(200).json({
            success: true,
            count: rendezVous.length,
            data: rendezVous
        });
    } catch (error) {
        console.error("Erreur dans getMecanicienConnecteRendezVous:", error);
        return res.status(500).json({
            success: false,
            message: "Erreur lors de la récupération des rendez-vous du mécanicien",
            error: error.message
        });
    }
};

// Recuperarion nombre rdv en fonction du status
const getRendezVousDetails = async (req, res) => {
    try {
        const totalRdv = await RendezVous.countDocuments()
        const rdvConfirme = await RendezVous.countDocuments({ status: 'confirmé' })
        const rdvEnAttente = await RendezVous.countDocuments({ status: 'en attente' })
        const rdvAnnule = await RendezVous.countDocuments({ status: 'annulé' })

        res.json({ totalRdv, rdvConfirme, rdvEnAttente, rdvAnnule })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

// Récupère tout les rendezvous à ce jour
const getTodayRendezVous = async (req, res) => {
    try {
        // Création de la date du jour (début et fin)
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Début de la journée

        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1); // Jour suivant

        // Recherche de tous les rendez-vous pour aujourd'hui
        const rendezVous = await RendezVous.find({
            date: {
                $gte: today,
                $lt: tomorrow
            }
        }).populate('client', 'nom prenom email telephone')
            .populate('mecanicien', 'nom prenom');

        res.status(200).json({
            success: true,
            count: rendezVous.length,
            data: rendezVous
        });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Récupère les 5 prochains rendez-vous à partir d'aujourd'hui
const getNextFiveRendezVous = async (req, res) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Début de la journée

        const prochainRendezVous = await RendezVous.find({
            date: {
                $gte: today
            },
            status: { $nin: ["annulé", "terminé"] } // Ne pas inclure les rendez-vous annulés ou terminés
        })
            .sort({ date: 1 }) // Tri par date croissante
            .limit(5)
            .populate('client', 'nom email')
            .populate('mecanicien', 'nom');

        res.status(200).json({
            success: true,
            count: prochainRendezVous.length,
            data: prochainRendezVous
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Erreur lors de la récupération des prochains rendez-vous",
            error: error.message
        });
    }
};

// Modifier un rendez-vous
const updateRendezVous = async (req, res) => {
    try {
        const { rendezVousId } = req.params;
        const updateData = req.body;

        const updatedRendezVous = await RendezVous.findByIdAndUpdate(
            rendezVousId,
            updateData,
            { new: true, runValidators: true }
        ).populate('client', 'nom email')
            .populate('mecanicien', 'nom email');

        res.status(200).json({
            success: true,
            message: "Rendez-vous mis à jour avec succès",
            data: updatedRendezVous
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Erreur lors de la mise à jour du rendez-vous",
            error: error.message
        });
    }
};

// Supprimer un rendez-vous
const deleteRendezVous = async (req, res) => {
    try {
        const { rendezVousId } = req.params;

        // Vérifier si le rendez-vous existe
        const rendezVous = await RendezVous.findById(rendezVousId);
        if (!rendezVous) {
            return res.status(404).json({
                success: false,
                message: "Rendez-vous introuvable"
            });
        }

        // Vérification des permission
        // Seuls les managers ou le client propriétaire peuvent supprimer
        if (req.utilisateur.role === 'client' && req.utilisateur._id.toString() !== rendezVous.client.toString()) {
            return res.status(403).json({
                success: false,
                message: "Vous n'êtes pas autorisé à supprimer ce rendez-vous"
            });
        }

        // Si un mécanicien était assigné, le rendre à nouveau disponible
        if (rendezVous.mecanicien && rendezVous.mecanicien.length > 0) {
            for (const mecanicienId of rendezVous.mecanicien) {
                await Utilisateur.findByIdAndUpdate(
                    mecanicienId, { disponible: true }
                );
            }
        }

        // Supprimer le rendez-vous
        await RendezVous.findByIdAndDelete(rendezVousId);

        res.status(200).json({
            success: true,
            message: "Rendez-vous supprimé avec succès"
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Erreur lors de la suppression du rendez-vous",
            error: error.message
        });
    }
};

// Récupérer status rendezVous aujourd'hui
const recupererStatusRendezVous = async (req, res) => {
    const now = new Date();
    const startOfDay = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 0, 0, 0, 0));
    const endOfDay = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 23, 59, 59, 999));

    const userId = req.utilisateur._id;

    if (req.utilisateur.role == 'client') {
        const enAttente = await RendezVous.find({ status: { $in: ["en attente", "réservé", "assigné"] }, client: userId });
        const confirme = await RendezVous.find({ status: "confirmé", client: userId });
        const annule = await RendezVous.find({ status: "annulé", client: userId });
        const nombreEnAttente = Object.keys(enAttente).length;
        const nombreConfirme = Object.keys(confirme).length;
        const nombreAnnule = Object.keys(annule).length;

        const result = [
            { status: "En attente", count: nombreEnAttente },
            { status: "Confirmé", count: nombreConfirme },
            { status: "Annulé", count: nombreAnnule },
        ];
        return res.status(202).json(result);

    } else if (req.utilisateur.role == 'mecanicien') {
        const enAttente = await RendezVous.find({ status: { $in: ["en attente", "réservé", "assigné"] }, date: { $gte: startOfDay, $lte: endOfDay }, mecanicien: userId });
        const termine = await RendezVous.find({ status: "terminé", date: { $gte: startOfDay, $lte: endOfDay }, mecanicien: userId });
        const nombreEnAttente = Object.keys(enAttente).length;
        const nombreTermine = Object.keys(termine).length;

        const appointments = await RendezVous.find({
            date: { $gte: startOfDay, $lte: endOfDay }, mecanicien: userId
        })
        const totalRDV = appointments.length;
        const result = [
            { status: "En attente", count: nombreEnAttente },
            { status: "Terminé", count: nombreTermine },
            { total: totalRDV }
        ]
        return res.status(202).json(result);

    } else if (req.utilisateur.role == "manager") {
        const enAttente = await RendezVous.find({ status: { $in: ["en attente", "réservé", "assigné"] } });
        const confirme = await RendezVous.find({ status: "confirmé" });
        const annule = await RendezVous.find({ status: "anulé" });
        const nombreEnAttente = Object.keys(enAttente).length;
        const nombreConfirme = Object.keys(confirme).length;
        const nombreAnnule = Object.keys(annule).length;

        const result = [
            { status: "En attente", count: nombreEnAttente },
            { status: "Confirmé", count: nombreConfirme },
            { status: "Annulé", count: nombreAnnule },
        ];
        return res.status(202).json(result);
    }

    return res.status(500).json({ message: "Erreur du comptage" })

}

// Lister les rendezVous des 3 mois prochain (client), du jour (meca) et (manager)
const listRendezVous = async (req, res) => {
    try {
        const userId = req.utilisateur._id;
        const role = req.utilisateur.role;
        //console.log(typeof role); 
        const now = new Date();
        const startOfDay = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 0, 0, 0, 0));
        const endOfDay = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 23, 59, 59, 999));

        if (role == 'client') {
            const threeMonths = new Date();
            threeMonths.setMonth(threeMonths.getMonth() + 3);

            const appointments = await RendezVous.find({
                status: { $in: ["en attente", "réservé", "assigné", "confirmé"] },
                client: userId,
                date: { $gte: new Date(), $lte: threeMonths }
            }).sort({ date: -1 });

            // degisena en en attente le status reservé sy assigné mba ts anahirana client 
            for (let i = 0; i <= appointments.length - 1; i++) {
                if (appointments[i].status == "réservé" || appointments[i].status == "assigné") {
                    appointments[i].status = "en attente";
                }
            }

            return res.status(200).json(appointments);

        } else if (role == 'mecanicien') {

            const appointments = await RendezVous.find({
                mecanicien: userId,
                date: { $gte: startOfDay, $lte: endOfDay }
            })
                .populate({ path: "client", select: "nom" })
                .sort({ date: 1 });

            // console.log("valeur de appoitement meca", appointments)

            return res.status(200).json(appointments);

        } else if (role == 'manager') {

            const appointments = await RendezVous.find({ date: { $gte: startOfDay, $lte: endOfDay } })
                .populate([{ path: "client", select: "nom" }, { path: "mecanicien", select: "nom" }])
                .sort({ date: 1 })
                .exec();

            //console.log("Rendez-vous récupérés:", appointments);


            // Ajouter des statistiques pour le manager
            const totalRDV = appointments.length;
            const confirmes = appointments.filter(rdv => rdv.status == "confirmé").length;
            const annules = appointments.filter(rdv => rdv.status == "annulé").length;

            return res.status(200).json({
                total: totalRDV,
                confirmes,
                annules,
                appointments
            });
        }

        res.status(403).json({ message: "Accès refusé" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur lors de la récupération des rendez-vous" });
    }
};


// Récupérer tous les utilisateurs ayant le rôle "mecanicien"
const recupererMecanicien = async (req, res) => {
    try {
        const mecaniciens = await Utilisateur.find({ role: 'mecanicien' }); // Filtrer par rôle
        res.status(200).json(mecaniciens);
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur', error });
    }
};

//  Lister tous les rendezVous disponible 
const listRendezVousDisponible = async (req, res) => {
    try {
        const rendezVous = await RendezVous.find({ status: "annulé", date: { $gte: new Date() } });
        rendezVous.status = "disponible";

        return res.status(202).json(rendezVous);
    } catch (error) {
        res.status(404).json({ messsage: "Liste de rendezVous introuvable" });
    }
}


//creer un rendezVous et assigner automatiquement un mecanicien aleatoirement (CLIENT)
const createRendezvous = async (req, res) => {

    try {

        if (!req.utilisateur) {
            return res.status(401).json({ message: 'Utilisateur non authentifié.' });
        }

        const { heure, date, status, services } = req.body;
        const client = req.utilisateur._id;
        const mecanicienDisponible = await Utilisateur.aggregate([
            { $match: { role: "mecanicien" } },
            { $sample: { size: 1 } }
        ]);

        // Au cas ou il n'y a pas de mecanicien disponible 
        if (!mecanicienDisponible || mecanicienDisponible.length === 0) {
            return res.status(401).json({ message: 'Vous ne pouvez pas encore prendre un rendez-vous' })
        }

        // console.log("Mecanicien id", mecanicienDisponible._id);
        mecanicienId = mecanicienDisponible[0]._id;
        const rendezvous = new RendezVous({ heure, date, status, services, client, mecanicien: [mecanicienId] });
        //console.log("rendezVous creer",rendezvous)
        await rendezvous.save();
        return res.status(202).json(rendezvous);
    } catch (error) {
        return res.status(500).json({ message: "Erreur back" + error.message });
    }
}


// Réserver un rendezVous 
const reserveRendezVous = async (req, res) => {

    const { rendezVousId } = req.body;
    const clientId = req.utilisateur._id;
    //console.log(clientId);               
    const rendezVous = await RendezVous.findOne({ _id: rendezVousId, status: "annulé" });
    //console.log("Valeur de la rendezVous", rendezVous);
    rendezVous.client = clientId;
    rendezVous.status = "réservé";
    await rendezVous.save();
    return res.status(202).json(rendezVous);

}


// Assigner un mecanicien à un rendezVous par le manager
const assignRendezVous = async (req, res) => {
    const { rendezVousId, mecanicienId } = req.body;

    const rendezVous = await RendezVous.findOne({ _id: rendezVousId });
    if (!rendezVous) {
        return res.status(404).json({ message: "Rendezvous non disponible" });
    }

    const mecanicien = await Utilisateur.findOne({ _id: mecanicienId, role: "mecanicien" });
    if (!mecanicien) {
        return res.status(404).json({ message: "Mecanicien introuvable" })
    }

    rendezVous.mecanicien = mecanicienId;
    rendezVous.status = "assigné";
    await rendezVous.save();
    mecanicien.disponible = "false";
    await mecanicien.save();
    return res.status(200).json({ message: "Rendezvous assigné avec succès" });

}


// Assigner auto un mecanicien disponible à un rendezaVous 
const assignAvailableMecanicien = async (req, res) => {
    try {
        const { rendezVousId } = req.body;

        const rendezVous = await RendezVous.findById(rendezVousId);
        if (!rendezVous) {
            return res.status(404).json({ message: "Rendez-vous introuvable" });
        }

        const mecanicienDisponible = await Utilisateur.findOne({ role: "mecanicien", disponible: true });

        rendezVous.mecanicien = mecanicienDisponible._id;
        rendezVous.status = "assigné";
        await rendezVous.save();

        mecanicienDisponible.disponible = false;
        await mecanicienDisponible.save();

    } catch (error) {
        return res.status(404).json({ message: "erreur à l'assignation meca auto" });
    }

}

// Lister les RDV assignés selon le mécanicien
const assignedRendezVous = async (req, res) => {
    try {
        if (!req.utilisateur) {
            return res.status(401).json({ message: "Utilisateur non authentifié." });
        }

        const mecanicienId = req.utilisateur._id;

        const rendezVous = await RendezVous.find({ status: "assigné", mecanicien: mecanicienId }).populate({ path: "client", select: "nom" });

        if (rendezVous.length > 0) {
            return res.status(200).json(rendezVous);
        } else {
            return res.status(404).json({ message: "Aucun rendez-vous assigné trouvé." });

        }

    } catch (error) {
        return res.status(500).json({ message: "Erreur lors de la récupération des rendez-vous assignés." });
    }
};

// confirmer rendezVous 
const confirmerRendezVous = async (req, res) => {
    try {
        const { rendezVousId } = req.body;
        // console.log(rendezVousId);
        const rendezVous = await RendezVous.findByIdAndUpdate(rendezVousId,
            { status: 'confirmé' },
            { new: true }
        );
        // console.log("test", rendezVousAnnule);
        if (!rendezVous) {
            res.status(404).json({ message: "RDV non trouvé" })
        }
        return res.status(202).json(rendezVous);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "erreur lors de la confirmation" })
    }
}

// Annuler un rendezVous 
const annulationRendezVous = async (req, res) => {
    try {
        const { rendezVousId } = req.body;
        const rendezVousAnnule = await RendezVous.findByIdAndUpdate(rendezVousId,
            { status: 'annulé' },
            { new: true }
        );
        if (!rendezVousAnnule) {
            res.status(404).json({ message: "RDV non trouvé" })
        }
        return res.status(202).json(rendezVousAnnule);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "erreur lors de l'annulation" })
    }
}



module.exports = {
    confirmerRendezVous,
    listRendezVous,
    annulationRendezVous,
    recupererMecanicien,
    recupererStatusRendezVous,
    createRendezvous,
    reserveRendezVous,
    assignRendezVous,
    assignAvailableMecanicien,
    listRendezVousDisponible,
    assignedRendezVous,
    getRendezVous,
    getRendezVousDetails,
    getTodayRendezVous,
    getNextFiveRendezVous,
    updateRendezVous,
    deleteRendezVous,
    getMecanicienConnecteRendezVous
};

