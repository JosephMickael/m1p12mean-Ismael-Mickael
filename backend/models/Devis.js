const mongoose = require('mongoose');
const Mail = require('nodemailer/lib/mailer');

const pieceSchema = new mongoose.Schema({
    nom: { type: String, required: true },
    reference: { type: String, required: true },
    prixUnitaireTTC: { type: Number, required: true },
    quantite: { type: Number, required: true },
    total: { type: Number, required: true }
});

const servicesSchema = new mongoose.Schema({
    description: {type: String, required: true}, 
    coutServices: {type: Number, required: true} 
})

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
    emailClient: {
        type: String,
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
    services: [servicesSchema],
    pieces: [pieceSchema], 
    totalGeneral: { 
        type: Number, 
        default: 0 
    }
}); 

module.exports = mongoose.model('Devis', devisSchema);
