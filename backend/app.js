const express = require('express');

const app = express();
const mongoose = require('mongoose');

//Connexion a MongoDB
mongoose.connect('mongodb+srv://admin:'+ process.env.MDPMONGOOSECLUSTER0 +'@cluster0.rhz4b.mongodb.net/Cluster0?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));


app.use((req, res) => {
   res.json({ message: 'Votre requête a bien été reçue !' }); 
});

module.exports = app;