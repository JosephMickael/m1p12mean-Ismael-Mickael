const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const routes = require('./routes/route')

require('dotenv').config();

// const corsOptions = {
//     origin: process.env.FRONTEND_URL || '*',
//     methods: ['GET', 'POST', 'PUT', 'DELETE'],
//     allowedHeaders: ['Content-Type', 'Authorization']
// };


const app = express()
const PORT = process.env.PORT || 5001
console.log(process.env.MONGO_URI);

// Middleware 
// app.use(cors(corsOptions));
app.use(express.json())

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'https://garage-m1p12mean-mickael-ismael.vercel.app');
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
