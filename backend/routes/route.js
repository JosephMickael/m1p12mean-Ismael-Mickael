const express = require('express');
const router = express.Router();

const utilisateurController = require('../controller/Utilisateur_controller');
const rendezVousController = require('../controller/rendezvous_controller');
const verifierAuthentification = require('../middlewares/auth.middleware');

// Utilisateur 
router.get('/get-utilisateur', utilisateurController.getAllUser)
router.get('/users-details', utilisateurController.usersDetails)
router.post('/create-utilisateur', utilisateurController.createUser)
router.get('/:id', utilisateurController.getUserById)
router.put('/update-utilisateur/:id', utilisateurController.updateUser)
router.delete('/delete-utilisateur/:id', utilisateurController.deleteUser)
router.get('/current-user', verifierAuthentification, utilisateurController.getCurrentUser)

// Rendezvous 
router.post('/create-rendezVous', verifierAuthentification, rendezVousController.createRendezvous);
router.get('/disponible-rendezVous', rendezVousController.listRendezVous);
router.post('/reserve-rendezVous', verifierAuthentification, rendezVousController.reserveRendezVous);
router.post('/assingn-mecanicien-disponibles-rendezVous', rendezVousController.assignAvailableMecanicien);// choisi par le Système et le client
router.post('/assign-mecanicien', rendezVousController.assignRendezVous);// choisi par le manager


const authenticationController = require('../controller/Auth_controller');
router.post('/login', authenticationController.login)
router.post('/logout', authenticationController.logout)

module.exports = router
