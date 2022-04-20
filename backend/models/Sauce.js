const mongoose = require('mongoose');

const sauceSchema = mongoose.Schema({
    userId: {type: String, required: true},
    name: {type: String, required: true},
    manufacturer: {type: String, required: true},
    description: {type: String, required: true},
    mainPepper: {type: String, required: true},
    imageUrl: {type: String, required: true},
    heat: {type: Number, min: 1, max: 10, required: true, default: 0},
    likes: {type: Number, min: 0, required: true, default: 0},
    dislikes: {type: Number, min: 0, required: true, default: 0},
    usersLiked: {type: Array, required: true, default: []},
    usersDisliked: {type: Array, required: true, default: []}
});

module.exports = mongoose.model('Sauce', sauceSchema);
