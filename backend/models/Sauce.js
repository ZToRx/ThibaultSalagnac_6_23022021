const mongoose = require('mongoose');

const sauceSchema = mongoose.Schema({
    name: {type: String, required: true},
    manufacturer: {type: String},
    description: {type: String},
    mainPepper: {type: String},
    imageUrl: {type: String},
    heat: {type: Number, min: 1, max: 10, required: true},
    likes: {type: Number, min: 0, required: true},
    dislikes: {type: Number, min: 0, required: true},
    usersLiked: [{type: String}],
    usersDisliked: [{type: String}]
});

module.exports = mongoose.model('Sauce', sauceSchema);
