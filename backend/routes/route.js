const express = require('express');
const router = express.Router();

const utilisateurController = require('../controller/Utilisateur_controller');
const rendezVousController = require('../controller/rendezvous_controller');
const verifierAuthentification = require('../middlewares/auth.middleware');
const devisController = require('../controller/devis_controller');

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
router.get('/rdv-details', rendezVousController.getRendezVousDetails);
router.get('/today-rdv', rendezVousController.getTodayRendezVous);
router.get('/next-rdv', rendezVousController.getNextFiveRendezVous);
router.put('/update-rdv/:rendezVousId', verifierAuthentification, rendezVousController.updateRendezVous);
router.delete('/delete-rdv/:rendezVousId', verifierAuthentification, rendezVousController.deleteRendezVous);
router.get('/mecanicien-rendezvous', verifierAuthentification, rendezVousController.getMecanicienConnecteRendezVous);

// Utilisateur 
router.get('/get-utilisateur', utilisateurController.getAllUser)
router.get('/users-details', utilisateurController.usersDetails)
router.post('/create-utilisateur', utilisateurController.createUser)
router.put('/update-utilisateur/:id', utilisateurController.updateUser)
router.delete('/delete-utilisateur/:id', utilisateurController.deleteUser)
router.get('/current-user', verifierAuthentification, utilisateurController.getCurrentUser)
router.put('/update-password', verifierAuthentification, utilisateurController.updatePassword);
router.get('/get-utilisateur/:id', utilisateurController.getUserById)

//Devis
router.post('/create-devis', verifierAuthentification, devisController.creerDevis);
router.put('/modifier-devis', verifierAuthentification, devisController.modifierDevis);
router.get('/getAllDevis', verifierAuthentification, devisController.getAllDevis);
router.get('/getDevis', verifierAuthentification, devisController.getDevisById);
router.put('/valider-devis', verifierAuthentification, devisController.validerDevis);
router.delete('/supprimer-devis', verifierAuthentification, devisController.supprimerDevis);

const authenticationController = require('../controller/Auth_controller');
router.post('/login', authenticationController.login)
router.post('/logout', authenticationController.logout)

module.exports = router
