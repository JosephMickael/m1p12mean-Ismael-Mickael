const Stripe = require('stripe'); 
const Devis = require('../models/Devis'); 
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);


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
module.exports = { creersession }; 