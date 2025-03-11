const express = require ('express'); 
const  RendezVous = require('../models/Rendezvous'); 
const Utilisateur = require('../models/Utilisateur');
const { doesNotMatch } = require('node:assert');


    //  Lister tous les rendezVous
    const listRendezVous = async (req, res) => { 
    try {
        const rendezVous = await RendezVous.find(); 
        return res.status(202).json(rendezVous);  
    } catch (error) {
        res.status(404).json({messsage: "Liste de rendezVous introuvable"}); 
    }
}


  //creer un rendezVous et assigner automatiquement un mecanicien disponible 
  const createRendezvous = async (req, res) => {

    try {
        const { heure, date, status } = req.body; 
        const client = req.utilisateur._id;
        const mecanicienDisponible = await Utilisateur.findOne({role: "mecanicien", disponible: true});
        
        const mecanicien = mecanicienDisponible ? mecanicienDisponible._id : null; 

        // creer un rendezVous avec ou sans meca 
        const rendezVous = new RendezVous ({heure, date, status, client, mecanicien}); 

        // passer a occupé le meca si l'on avait assigné
        if (mecanicienDisponible) {
            mecanicienDisponible.disponible = false; 
            mecanicienDisponible.save(); 
        }
        
        const rendezvous = new RendezVous({ heure, date, status, client, mecanicien }); 
        await rendezvous.save(); 
        return res.status(202).json(rendezvous); 
    } catch (error) {
      return  res.status(404).json({ message: error.message}); 
    }
}


        // Réserver un rendezVous 
        const reserveRendezVous = async (req, res) => {
            try {
                const {rendezVousId} = req.body; 
                const clientId = req.utilisateur._id; // dans le token
                
                // verfifier si le rendezvous est disponible et existe
                const rendezVous = await RendezVous.findOne({_id: rendezVousId, status: disponible}); 
                if (!rendezVous) {
                   return res.status(404).json({message: "Rendezvous non disponible"});
                }

                rendezVous.client = clientId; 
                rendezVous.status= "réservé"; 

                await rendezVous.save(); 

            }  catch (error) {
               return res.status(404).json({message: "Erreur de la réservation"})
            }
        }


        // Assigner un mecanicien 
        const assignRendezVous = async (req, res) => {
            try {
                const {rendezVousId, mecanicienId} = req.body; 

            // verfifier si le rendezvous est disponible et existe
            const rendezVous = await RendezVous.findOne({_id: rendezVousId, status: disponible}); 
            if (!rendezVous) {
              return  res.status(404).json({message: "Rendezvous non disponible"});
            }

            //verifier si le mecanicien existe et bien un mecanicien 
            const mecanicien = await Utilisateur.findOne({_id: mecanicienId, role: "mecanicien"});   
            if (!mecanicien) {
              return  res.status(404).json({message: "Mecanicien introuvable"})
            }

            //assigner mecanicien
            rendezVous.mecanicien = mecanicienId; 
            rendezVous.status = "assigné";
            await rendezVous.save(); 

            // marqué le mecanicien occupé
            mecanicien.disponible = "false";
            await mecanicien.save(); 
        } catch (error) {
           return res.status(404).json({message: "Erreur au niveau de l'assignation mecanicien"})
        }
    }
    

        // Assigner auto un mecanicien disponible à un rendezaVous 
        const assignAvailableMecanicien = async (req, res) => {
            try {
                const {rendezVousId} = req.body; 
         
        // Vérifier si le rendez-vous existe
        const rendezVous = await RendezVous.findById(rendezVousId);
        if (!rendezVous) {
            return res.status(404).json({ message: "Rendez-vous introuvable" });
        }

        // Trouver un meca dispo 
        const mecanicienDisponible = await Utilisateur.findOne({role: "mecanicien", disponible:true});
        
        // assigné un mecanicien
        rendezVous.mecanicien = mecanicienDisponible._id;
        rendezVous.status = "assigné"; 
        await rendezVous.save();   

        // rendre occupé un mécanicien 
        mecanicienDisponible.disponible = false; 
        await mecanicienDisponible.save(); 

        } catch (error) {
           return res.status(404).json({message: "erreur à l'assignation meca auto"}); 
        }

        }


module.exports = {createRendezvous, reserveRendezVous, assignRendezVous, assignAvailableMecanicien, listRendezVous}; 

