const mongoose = require('mongoose');

const devisSchema = new mongoose.Schema({
    client: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Utilisateur',
        required: true
    },
    mecanicien: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Utilisateur',
        required: true
    },
    manager: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Utilisateur', 
        required: true
    }, 
    dateCreation: { 
        type: Date, 
        default: Date.now 
    },
    status: {
        type: String, 
        enum: ['En attente', 'Validé', 'Refusé'], 
        default: 'En attente'
    }, 
    services: [{
        type: String, 
        required: true
    }],
    pieces: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'Piece',
        required: true
    }
}); 

module.exports = mongoose.model('Devis', devisSchema);


