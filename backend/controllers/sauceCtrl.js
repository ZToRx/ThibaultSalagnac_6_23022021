const Sauce = require('../models/Sauce');
const fs = require('fs');

// Recuperation de toutes les sauces
exports.getAllSauces = (req, res, next) => {
    Sauce.find()
        .then(sauces => res.status(200).json(sauces))
        .catch(error => res.status(400).json({ error }));
};

// Recuperation d'une sauce
exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => res.satus(200).json(sauce))
        .catch(error => res.status(400).json({ error }));
};

// Creation
exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;
    // Nouvelle Sauce avec l'adresse de l'image
    const sauce = new Sauce({
        ...sauceObject,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });
    // Sauvegarde dans la DB
    sauce.save()
        .then(() => res.status(201).json({ message: 'New Sauce registered'}))
        .catch(error => res.status(400).json({ error }));
};

// Modification
exports.modifySauce = (req, res, next) => {
    // Seconde verification d'authorization
    if(req.body.userId === req.auth.userId) {
        Sauce.findOne({_id: req.params['id']})
            .then((sauce) =>{
                if(req.file) {
                    // Avec image
                    // Suppression de l'ancienne
                   const filename = sauce.imageUrl.split('/images/')[1];
                   fs.unlink(`images/${filename}`, () => {
                       // Objet avec la nouvelle adresse de l'image
                       const sauceObject = {
                           ...JSON.parse(req.body.sauce),
                           imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
                    };
                    // Mise a jour
                    Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id})
                       .then(() => res.status(200).json({ message: 'Sauce updated'}))
                       .catch(error => res.status(400).json({ error }));
                   });
                } else {
                    //Mise a jour sans image
                    Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id})
                        .then(() => res.status(200).json({ message: 'Sauce updated'}))
                        .catch(error => res.status(400).json({ error }));
                }
            })
            .catch((error) => res.stauts(500).json({ error }))
        } else { return res.status(401).json({ error })}
};

// Suppression
exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.is})
        .then(sauce => {
            // Verification de la requete
            if(!sauce) {
                return res.status(404).json({ error });
            }
            // Seconde Verification de l'autorization
            if(sauce.userId !== req.auth.userId){
                return res.status(401).json({ error });
            }
            // Suppression de l'image
            const filename = sauce.imageUrl.split('/images/')[1];
            fs.unlink(`images/${filename}`, () => {
                // Suppression dans la DB
                Sauce.deleteOne({ sauce })
                    .then(() => res.status(200).json({ message: 'Sauce deleted'}))
                    .catch(error => res.status(400).json({ error }));
            })
        })
        .catch(error => res.status(500).json({ error }));
}

// like/dislike a venir