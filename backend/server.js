const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const routes = require('../backend/routes/route')

require('dotenv').config();

const app = express()
const PORT = process.env.PORT 
console.log(process.env.MONGO_URI);

// Middleware 
// app.use(cors());
app.use(express.json())

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'https://garage-m1p12-mean.vercel.ap');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    next();
});

// Connexion à mongoose
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('MongoDB Connecté'))
    .catch(err => console.log(err))

app.use('/garage_api', routes)

app.listen(PORT, () => console.log(`Server démarré sur le PORT ${PORT}`))
