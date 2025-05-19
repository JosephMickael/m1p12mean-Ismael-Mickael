const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const routes = require('./routes/route');


require('dotenv').config();


const app = express()
const PORT = process.env.PORT || 5001
console.log(process.env.MONGO_URI);

 
app.use(express.json())

const corsOptions = {
    origin: "https://garage-m1p12mean-mickael-ismael.vercel.app",
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  };

app.use(cors(corsOptions));


// Connexion à mongoose
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('MongoDB Connecté'))
    .catch(err => console.log(err))

app.use('/garage_api', routes)

app.listen(PORT, () => console.log(`Server démarré sur le PORT ${PORT}`))
