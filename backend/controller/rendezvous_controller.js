const express = require ('express'); 
const  RendezVous = require('../models/Rendezvous'); 
const Utilisateur = require('../models/Utilisateur');

    // Récupérer status rendezVous 
    const recupererStatusRendezVous = async (req, res) => {

            const userId = req.utilisateur._id; 
            const enAttente = await RendezVous.find({ status: { $in: ["en attente", "réservé", "assigné"] }, client: userId });
            const confirme = await RendezVous.find({ status: "confirmé" }); 
            const annule = await RendezVous.find({ status: "anulé" }); 
            const nombreEnAttente = Object.keys(enAttente).length;
            const nombreConfirme = Object.keys(confirme).length;
            const nombreAnnule = Object.keys(annule).length; 

            const result = [
            { status: "En attente", count: nombreEnAttente },
            { status: "Confirmé", count: nombreConfirme },
            { status: "Annulé", count: nombreAnnule }
            ];

            return res.status(202).json(result); 
        
    }

    // Liste rendezVous client et Meca 
    const listRendezVous = async (req, res) => {
        try {
            const userId = req.utilisateur._id;  
            const rendezVous = await RendezVous.find({ status: { $in : ["en attente", "réservé", "assigné", "confirmé"]}, 
            client: userId })
            return res.status(202).json(rendezVous); 
        } catch (error) {
            console.error(error)
            res.status(500).json({message: "Erreur a la recup des rendezVous"})
        }
    }

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
        const rendezVous = await RendezVous.find({ status: "disponible" }); 
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
        const mecanicienDisponible = await Utilisateur.findOne({role: "mecanicien"});
        
        const mecanicien = mecanicienDisponible ? mecanicienDisponible._id : null; 

        if (mecanicienDisponible) {
            mecanicienDisponible.disponible = false; 
            mecanicienDisponible.save(); 
        }
        
        const rendezvous = new RendezVous({ heure, date, status,services , client, mecanicien: [mecanicien] }); 
        await rendezvous.save(); 
        return res.status(202).json(rendezvous); 
    } catch (error) {
      return  res.status(500).json({ message: error.message}); 
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
        


module.exports = {listRendezVous, annulationRendezVous, recupererMecanicien, recupererStatusRendezVous, createRendezvous, reserveRendezVous, assignRendezVous, assignAvailableMecanicien, listRendezVousDisponible, assignedRendezVous}; 

