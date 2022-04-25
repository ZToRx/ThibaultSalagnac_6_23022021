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
        .then(sauce => res.status(200).json(sauce))
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
    const sauceObject = req.file ? {
        //Avec Image
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : {
        //Sans Image
        ...req.body
    };
    //Mise a jour
    Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id }) 
        .then(()=> res.status(200).json({ message: 'Sauce updated' }))
        .catch(error => res.status(400).json({ error }));
};

// Suppression
exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => {
            // Verification de la requete
            if(!sauce) {
                return res.status(404).json({ error });
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

exports.likeSauce = (req, res, next) => {
    switch(req.body.like) {
        case 1:
            Sauce.updateOne({ _id: req.params.id }, { $push: { usersLiked: req.body.userId}, $inc: { likes: +1}})
                .then(() => res.status(200).json({ message: 'liked'}))
                .catch((error) => res.status(400).json({ error }));
            break;
        case -1:
            Sauce.updateOne({ _id: req.params.id }, { $push: { usersDisliked: req.body.userId}, $inc: { dislikes: +1}})
                .then(() => res.status(200).json({ message: 'disliked'}))
                .catch((error) => res.status(400).json({ error }));
            break;
        case 0:
            Sauce.findOne({ _id: req.params.id })
                .then((sauce) => {
                    if(sauce.usersDisliked.includes(req.body.userId)){
                        Sauce.updateOne({ _id: req.params.id},
                                        { $pull: { usersDisliked: req.body.userId }, $inc: { dislikes: -1}})
                            .then(() => res.status(200).json({ message: 'You changed your mind'}))
                            .catch((error) => res.status(400).json({ error }));
                    } else if(sauce.usersLiked.includes(req.body.userId)) { 
                        Sauce.updateOne({ _id: req.params.id},
                                        { $pull: { usersLiked: req.body.userId}, $inc: { likes: -1}})
                            .then(() => res.status(200).json({ message: 'You changed your mind'}))
                            .catch((error) => res.status(400).json({ error }));
                    } else {
                        throw 'Youd never been here before'; 
                    }
                })
                .catch((error) => res.status(500).json({ error }));
            break;
        default:
            throw 'Wrong value';
    }
}