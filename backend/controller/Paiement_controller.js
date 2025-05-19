const Stripe = require('stripe'); 
const Devis = require('../models/Devis'); 
const axios = require('axios');
const { error } = require('console');

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
const api_key = process.env.API_AXIOS_KEY; 
const BASE_URL = `https://v6.exchangerate-api.com/v6/${api_key}/latest/USD`; 


const obtenirTaux = async (req, res) => {
    axios.get(BASE_URL).then( response => {
      const taux = response.data.conversion_rates.MGA/2;
      console.log(`0.5 $ = ${taux} MGA`); 
      res.status(200).send( {taux} ); 
    }).catch(error => {
      console.error('Erreur lors de la recuperation du taux', error.message); 
    })
}


const creersession = async (req, res) => {
  try {
    const { devisId, currency } = req.body;

    const devis = await Devis.findById(devisId); 
    const amount = devis.totalGeneral;


    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
    });

    if (paymentIntent) {
      devis.paiement = "Payé"; 
    }

    res.send({ clientSecret: paymentIntent.client_secret });
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
};
module.exports = { creersession, obtenirTaux }; 