const mongoose = require('mongoose'); 
const Utilisateur = require('../models/Utilisateur'); 

const RendezVousSchema = new mongoose.Schema({
    heure : { type: String, required: true}, 
    date : { type: Date, required: true}, 
    status : { type: String, 
      default: "disponible",   
      enum: ["en attente", "confirmé", "assigné", "annulé", "disponible", "réservé"]
    },
    services : { type: String, required: true, default: ''},
    client : {
        type: mongoose.Schema.Types.ObjectId,
        ref:'Utilisateur'
        }, 
    mecanicien : [{ 
        type: mongoose.Schema.Types.ObjectId,
        required: true, 
        ref:'Utilisateur'
    }]
}, {timestamps: true}); 

module.exports = mongoose.model('RendezVous', RendezVousSchema); 

