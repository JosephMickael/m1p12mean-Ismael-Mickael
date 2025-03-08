const express = require ('express'); 
const  RendezVous = require('../models/Rendezvous'); 

// Obtenir un rendezVous
const createRendezvous = async (req, res) => {

    try {
        const { heure, date, status, client, mecanicien } = req.body; 

        const rendezvous = new RendezVous({ heure, date, status, client, mecanicien }); 
        await rendezvous.save(); 
        return res.status(202).json(rendezvous); 
    } catch (error) {
        res.status(404).json({ message: error.message}); 
    }
}

module.exports = {createRendezvous}; 