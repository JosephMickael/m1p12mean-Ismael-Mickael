const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const routes = require('./routes/route');


require('dotenv').config();


const app = express()
const PORT = process.env.PORT || 5001
console.log(process.env.MONGO_URI);


app.use(express.json())

// Décocher mode prod
// const corsOptions = {
//     origin: process.env.CLIENT_PAGE,
//     methods: ['GET', 'POST', 'PUT', 'DELETE'],
//     allowedHeaders: ['Content-Type', 'Authorization'],
// };

// app.use(cors(corsOptions));

const allowedOrigins = [
    'http://localhost:4200',
    'https://m1p12mean-ismael-mickael-8d4wbypuu-joseph-mickaels-projects.vercel.app'
];

const corsOptions = {
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));

// Mode Dev uniquement
// app.use(cors({
//     origin: 'http://localhost:4200',
//     credentials: true
// }));

// app.options('*', cors({
//     origin: 'http://localhost:4200',
//     credentials: true
// }));

// Connexion à mongoose
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('MongoDB Connecté'))
    .catch(err => console.log(err))

app.use('/garage_api', routes)

app.listen(PORT, () => console.log(`Server démarré sur le PORT ${PORT}`))
