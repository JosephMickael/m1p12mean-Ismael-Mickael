const mongoose = require('mongoose'); 
const { type } = require('os');


const pieceSchema = new mongoose.Schema({
    nom : { type: String, required: true },
    reference : { type: String, required: true}, 
    prixUnitaireHT: { type: Number, required: true}, 
    prixUnitaireTTC: { type: Number, required: true},
    quantite: { type: String, required: true}
})


const DevisSchema = new mongoose.Schema({
    client : {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Utilisateur',
        required: true
    },
    mecanicien : {
        type: mongoose.Schema.Types.ObjectId, 
        ref:'Utilisateur',
        required: true
    },
    manager : {
        type: mongoose.Schema.Types.ObjectId, 
        ref:'Utilisateue',
        required: true
    }, 
    dateCreation : {
        type : Date, default: Date.now 
    },
    status : {
        type: String, 
        enum: ['En attente', 'Validé', 'Refusé'], 
        default: 'En attente'
    }, 
    services : [{
        type: String, 
        required: true
    }],
    piece: [pieceSchema]
}) 
    
const Devis = mongoose.model('Devis', DevisSchema); 

module.exports = { Devis }; 