const mongoose = require('mongoose');

const pieceSchema = new mongoose.Schema({
    nom: { type: String, required: true },
    reference: { type: String, required: true }, 
    prixUnitaireHT: { type: Number, required: true }, 
    prixUnitaireTTC: { type: Number, required: true },
    quantite: { type: Number, required: true } 
});

module.exports = mongoose.model('Piece', pieceSchema); 