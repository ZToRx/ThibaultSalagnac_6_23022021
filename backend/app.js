const express = require('express');

const app = express();
const mongoose = require('mongoose');
const path = require('path');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const userRoutes = require('./routes/userRoutes');
const sauceRoutes = require('./routes/sauceRoutes');

//Connexion a MongoDB
mongoose.connect(process.env.MONGOOSEADRESS,
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

//Security
app.use(helmet());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, //15 min
  max: 1000 //1000 request by IP
});
app.use(limiter);

//Headers CORS
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

//Middleware
app.use(express.json());
app.use('/api/auth', userRoutes);
app.use('/api/sauces', sauceRoutes);
app.use('/images', express.static(path.join(__dirname,'images')));

module.exports = app;