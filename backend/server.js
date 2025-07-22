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
const corsOptions = {
    origin: process.env.CLIENT_PAGE,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
};
// const corsOptions = {
//     origin: (origin, callback) => {
//         const allowedOrigins = [
//             'https://m1p12mean-mickael-ismael.vercel.app',
//             'http://localhost:4200'
//         ];
//         if (!origin || allowedOrigins.includes(origin)) {
//             callback(null, true);
//         } else {
//             callback(new Error('Not allowed by CORS'));
//         }
//     },
//     methods: ['GET', 'POST', 'PUT', 'DELETE'],
//     allowedHeaders: ['Content-Type', 'Authorization'],
//     credentials: true
// };

app.use(cors(corsOptions));
// app.options('*', cors(corsOptions));

app.use((req, res, next) => {
    console.log(`Reçu ${req.method} depuis ${req.headers.origin}`);
    next();
});


// app.use(cors(corsOptions));

// app.use(cors(corsOptions));

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
