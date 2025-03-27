const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const routes = require('../backend/routes/route')

require('dotenv').config();

const app = express()
const PORT = process.env.PORT || 5001
console.log(process.env.MONGO_URI);

// Middleware 
app.use(cors())
app.use(express.json())

// Connexion à mongoose
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('MongoDB Connecté'))
    .catch(err => console.log(err))

app.use('/garage_api', routes)

app.listen(PORT, () => console.log(`Server démarré sur le PORT ${PORT}`))
