const bcrypt = require('bcrypt');
const mongoose = require('mongoose')

const UtilisateurSchema = new mongoose.Schema({
    nom: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    motDePasse: { type: String, required: true },
    disponible: { type: Boolean, default: true },
    role: { type: [String], default: ['client'], enum: ['client', 'mecanicien', 'manager'] },
    specialite: { type: String, default: '' }
}, { timestamps: true })

// Hachage du mot de passe avant de sauvegarder l'utilisateur
UtilisateurSchema.pre('save', async function (next) {
    if (!this.isModified('motDePasse')) return next();
    try {
        this.motDePasse = await bcrypt.hash(this.motDePasse, 10);
        next();
    } catch (error) {
        next(error);
    }
});

// Méthode pour comparer le mot de passe saisi avec celui de la bdd
UtilisateurSchema.methods.compareMotDePasse = async function (userPassword) {
    return bcrypt.compare(userPassword, this.motDePasse);
};

module.exports = mongoose.model('Utilisateur', UtilisateurSchema)
