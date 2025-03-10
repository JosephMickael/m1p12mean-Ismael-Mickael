const express = require('express');
const router = express.Router();

const utilisateurController = require('../controller/Utilisateur_controller');
const rendezVousController = require('../controller/rendezvous_controller');

// Utilisateur 

router.get('/get-utilisateur', utilisateurController.getAllUser)
router.post('/create-utilisateur', utilisateurController.createUser)
router.put('/update-utilisateur/:id', utilisateurController.deleteUser)
router.delete('/delete-utilisateur/:id', utilisateurController.getAllUser)


// Rendezvous *

router.post('/create-rendezvous', rendezVousController.createRendezvous); 

const authenticationController = require('../controller/Auth_controller')
router.post('/login', authenticationController.login)
router.post('/logout', authenticationController.logout)

module.exports = router
