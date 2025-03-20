const express = require ('express'); 
const  RendezVous = require('../models/Rendezvous'); 
const Utilisateur = require('../models/Utilisateur');

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
            const enAttente = await RendezVous.find({ status: { $in: ["en attente", "réservé", "assigné"] },  date: { $gte: startOfDay, $lte: endOfDay }, mecanicien: userId});
            const termine = await RendezVous.find({status: "terminé",  date: { $gte: startOfDay, $lte: endOfDay }, mecanicien: userId} ); 
            const nombreEnAttente = Object.keys(enAttente).length;
            const nombreTermine = Object.keys(termine).length;

            const appointments = await RendezVous.find({
                date: { $gte: startOfDay, $lte: endOfDay }, mecanicien: userId
            })          
            const totalRDV = appointments.length;
            const result = [
                { status: "En attente", count: nombreEnAttente},
                { status:"Terminé", count: nombreTermine},
                { total: totalRDV }
            ]
            return res.status(202).json(result); 

        } else if (req.utilisateur.role == "manager") {
            const enAttente = await RendezVous.find({ status: { $in: ["en attente", "réservé", "assigné"]} });
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
        
        return res.status(500).json({message: "Erreur du comptage"})
        
    }
    
    // Lister les rendezVous du jour 
    const listRendezVous = async (req, res) => {
        try {
            const userId = req.utilisateur._id;
            const role = req.utilisateur.role;
            //console.log(typeof role); 
            const now = new Date();
            const startOfDay = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 0, 0, 0, 0));                
            const endOfDay = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 23, 59, 59, 999));
    
            if (role == 'client') {
                // Récupérer les rendez-vous des 3 derniers mois
                const threeMonthsAgo = new Date();
                threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
    
                const appointments = await RendezVous.find({
                    status: { $in: ["en attente", "réservé", "assigné", "confirmé"] },
                    client: userId,
                    date: { $gte: threeMonthsAgo }
                }).sort({ date: -1 });
    
                return res.status(200).json(appointments);
    
            } else if (role == 'mecanicien') {
    
                const appointments = await RendezVous.find({
                    mecanicien: userId,
                    date: { $gte: startOfDay, $lte: endOfDay }
                })
                .populate({path: "client", select: "nom"})
                .sort({ date: 1 });
    
                return res.status(200).json(appointments);
    
            } else if (role == 'manager') {
                
                const appointments = await RendezVous.find({
                    date: { $gte: startOfDay, $lte: endOfDay }
                })
                .populate([{path: "client", select: "nom"}, {path: "mecanicien", select: "nom"}])
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
    const recupererMecanicien =  async (req, res) => {
        try {
        const mecaniciens = await Utilisateur.find({ role: 'mecanicien' }); // Filtrer par rôle
        res.status(200).json(mecaniciens);
        } catch (error) {
        res.status(500).json({ message: 'Erreur serveur', error });
        }
    };



    //  Lister tous les rendezVous
    const listRendezVousDisponible = async (req, res) => { 
    try {
        const rendezVous = await RendezVous.find({ status: "annulé" }); 
        rendezVous.status = "disponible"; 
        return res.status(202).json(rendezVous);  
    } catch (error) {
        res.status(404).json({messsage: "Liste de rendezVous introuvable"}); 
    }
}


  //creer un rendezVous et assigner automatiquement un mecanicien disponible 
  const createRendezvous = async (req, res) => {

    try {

         if (!req.utilisateur) {
            return res.status(401).json({ message: 'Utilisateur non authentifié.' });
        }

        const { heure, date, status, services } = req.body; 
        const client = req.utilisateur._id;     
        const mecanicienDisponible = await Utilisateur.findOne({ role: "mecanicien"});   
        const rendezvous = new RendezVous({ heure, date, status,services , client, mecanicien: [mecanicienDisponible] }); 
        await rendezvous.save(); 
        return res.status(202).json(rendezvous); 
    } catch (error) {
      return  res.status(500).json({ message: "Erreur back"+error.message}); 
    }
}


        // Réserver un rendezVous 
        const reserveRendezVous = async (req, res) => {
            
                const {rendezVousId} = req.body; 
                const clientId = req.utilisateur._id;               
                const rendezVous = await RendezVous.findOne({_id: rendezVousId, status: "disponible"}); 
                rendezVous.client = clientId; 
                rendezVous.status= "réservé"; 
                await rendezVous.save(); 
                return res.status(202).json(rendezVous); 
          
        }


        // Assigner un mecanicien à un rendezVous par le manager
        const assignRendezVous = async (req, res) => {
                const {rendezVousId, mecanicienId} = req.body; 

            const rendezVous = await RendezVous.findOne({ _id: rendezVousId }); 
            if (!rendezVous) {
              return  res.status(404).json({message: "Rendezvous non disponible"});
            }

            const mecanicien = await Utilisateur.findOne({ _id: mecanicienId, role: "mecanicien" });   
            if (!mecanicien) {
              return  res.status(404).json({message: "Mecanicien introuvable"}) 
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
                const {rendezVousId} = req.body; 
         
        const rendezVous = await RendezVous.findById(rendezVousId);
        if (!rendezVous) {
            return res.status(404).json({ message: "Rendez-vous introuvable" });
        }

        const mecanicienDisponible = await Utilisateur.findOne({role: "mecanicien", disponible:true});
        
        rendezVous.mecanicien = mecanicienDisponible._id;
        rendezVous.status = "assigné"; 
        await rendezVous.save();   

        mecanicienDisponible.disponible = false; 
        await mecanicienDisponible.save(); 

        } catch (error) {
           return res.status(404).json({message: "erreur à l'assignation meca auto"}); 
        }

        }

         // Lister les RDV assignés selon le mécanicien
        const assignedRendezVous = async (req, res) => {
        try {
            if (!req.utilisateur) {
            return res.status(401).json({ message: "Utilisateur non authentifié." });
        }

        const mecanicienId = req.utilisateur._id; 
        
        const rendezVous = await RendezVous.find({ status: "assigné", mecanicien: mecanicienId  }).populate({path: "client", select: "nom"}); 

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
                console.log(rendezVousId); 
                const rendezVousAnnule = await RendezVous.findByIdAndUpdate( rendezVousId, 
                    { status: 'confirmé'},
                    { new: true }
                );
                console.log("test", rendezVousAnnule); 
                if (!rendezVousAnnule) {
                    res.status(404).json({message: "RDV non trouvé"})
                }
            } catch (error) {
                console.error(error);
                res.status(500).json({message: "erreur lors de la confirmation"})
            }
        }

        // Annuler un rendezVous 
        const annulationRendezVous = async (req, res) => {
            try {
                const { rendezVousId } = req.body; 
                const rendezVousAnnule = await RendezVous.findByIdAndUpdate( rendezVousId, 
                    { status: 'annulé'},
                    { new: true }
                );
                if (!rendezVousAnnule) {
                    res.status(404).json({message: "RDV non trouvé"})
                }
            } catch (error) {
                console.error(error);
                res.status(500).json({message: "erreur lors de l'annulation"})
            }
        }
        


module.exports = {confirmerRendezVous, listRendezVous, annulationRendezVous, recupererMecanicien, recupererStatusRendezVous, createRendezvous, reserveRendezVous, assignRendezVous, assignAvailableMecanicien, listRendezVousDisponible, assignedRendezVous}; 

