 const mongoose = require('mongoose'); 
const Utilisateur = require('../models/Utilisateur'); 

const RendezVousSchema = new mongoose.Schema({
    heure : { type: String, required: true}, 
    date : { type: Date, required: true}, 
    status : { type: String, required: true}, 
    client : {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref:'Utilisateur'
        }, 
    mecanicien : [{ 
        type: mongoose.Schema.Types.ObjectId,
        required: true, 
        ref:'Utilsateur'
    }]
}, {timestamps: true}); 

const RendezVous = mongoose.model('RendezVous', RendezVousSchema); 

module.exports = RendezVous; 
