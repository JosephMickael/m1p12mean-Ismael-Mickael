const express = require('express');
const router = express.Router();

const utilisateurController = require('../controller/Utilisateur_controller');
const rendezVousController = require('../controller/rendezvous_controller');
const verifierAuthentification = require('../middlewares/auth.middleware');
const upload = require('../middlewares/multer.middlware');
const devisController = require('../controller/devis_controller');
const contactController = require('../controller/Contact_controller')
const emailController = require('../controller/Email_controller');
const paiementController = require('../controller/Paiement_controller'); 


// Rendezvous 
router.get('/all-rendezvous', rendezVousController.getRendezVous)
router.post('/create-rendezVous', verifierAuthentification, rendezVousController.createRendezvous);//OK
router.get('/disponible-rendezVous', verifierAuthentification, rendezVousController.listRendezVousDisponible);//OK
router.post('/reserve-rendezVous', verifierAuthentification, rendezVousController.reserveRendezVous);
router.post('/assingn-mecanicien-disponibles-rendezVous', verifierAuthentification, rendezVousController.assignAvailableMecanicien);//OK
router.post('/assign-mecanicien-rendezVous', verifierAuthentification, rendezVousController.assignRendezVous);//OK
router.get('/list-assignedrendezVous', verifierAuthentification, rendezVousController.assignedRendezVous); //OK
router.get('/listMecaniciens', verifierAuthentification, rendezVousController.recupererMecanicien); //OK
router.get('/listSatus', verifierAuthentification, rendezVousController.recupererStatusRendezVous);
router.get('/listRendezVous', verifierAuthentification, rendezVousController.listRendezVous);
router.put('/confirmerRendezVous', verifierAuthentification, rendezVousController.confirmerRendezVous);
router.put('/annulerRendezVous', verifierAuthentification, rendezVousController.annulationRendezVous);
router.get('/rdv-details', verifierAuthentification, rendezVousController.getRendezVousDetails);
router.get('/today-rdv', verifierAuthentification, rendezVousController.getTodayRendezVous);
router.get('/next-rdv', verifierAuthentification, rendezVousController.getNextFiveRendezVous);
router.put('/update-rdv/:rendezVousId', verifierAuthentification, rendezVousController.updateRendezVous);
router.delete('/delete-rdv/:rendezVousId', verifierAuthentification, rendezVousController.deleteRendezVous);
router.get('/mecanicien-rendezvous', verifierAuthentification, rendezVousController.getMecanicienConnecteRendezVous);

// Utilisateur 
router.get('/get-utilisateur', verifierAuthentification, utilisateurController.getAllUser)
router.get('/get-managers', verifierAuthentification, utilisateurController.getAllManagers)
router.get('/users-details', verifierAuthentification, utilisateurController.usersDetails)
router.post('/create-utilisateur', utilisateurController.createUser)
router.put('/update-utilisateur/:id', verifierAuthentification, utilisateurController.updateUser)
router.delete('/delete-utilisateur/:id', verifierAuthentification, utilisateurController.deleteUser)
router.get('/current-user', verifierAuthentification, utilisateurController.getCurrentUser)
router.put('/update-password', verifierAuthentification, utilisateurController.updatePassword);
router.get('/get-utilisateur/:id', verifierAuthentification, utilisateurController.getUserById)

//Devis
router.post('/create-devis', verifierAuthentification, devisController.creerDevis);
router.put('/modifier-devis/:id', verifierAuthentification, devisController.modifierDevis);
router.get('/devis', verifierAuthentification, devisController.getAllDevis);
router.get('/devis/:id', verifierAuthentification, devisController.getDevisById);
router.put('/valider-devis/:id', verifierAuthentification, devisController.validerDevis);
router.delete('/supprimer-devis/:id', verifierAuthentification, devisController.supprimerDevis);
router.get('/get-utilisateur-devis', verifierAuthentification, utilisateurController.getAllUserDevis);


// Contact
router.post('/send', verifierAuthentification, contactController.sendMessage)
router.get('/managers/messages', verifierAuthentification, contactController.getMessage)
router.put('/read/:messageId', verifierAuthentification, contactController.markAsRead)
router.delete('/message/:messageId', verifierAuthentification, contactController.deleteMessage)

// Envoi Email
router.post('/send-email', verifierAuthentification, emailController.sendEmail);
router.post('/send-devisMail', verifierAuthentification, upload.single('pdf'),  emailController.sendDevisMailPost); 

// Paiement 
router.post('/payement', verifierAuthentification, paiementController.creersession); 
router.get('/taux', verifierAuthentification, paiementController.obtenirTaux); 

const authenticationController = require('../controller/Auth_controller');
router.post('/login', authenticationController.login)
router.post('/logout', authenticationController.logout)

module.exports = router
