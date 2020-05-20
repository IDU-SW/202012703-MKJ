const Game = require('../models/game.model');
const mongoose = require('mongoose');


// Create new Game document
Game.statics.create = function (payload) {
    const game = new this(payload);

    return game.save();
};

// Find Game List
Game.statics.findAll = function () {
    return this.find({});
};

// Find One Game by gameId
Game.statics.findOneByGameid = function (gameId) {
    console.log('GAME ID: ', gameId);

    return this.findOne({ _id: gameId });
};

// Update by gameId
Game.statics.updateByGameid = function (gameId, payload) {
    return this.findOneAndUpdate({ _id: gameId }, payload, { new: true });
};

// Delete by gameId
Game.statics.deleteByGameid = function (gameId) {
    return this.findOneAndDelete({ _id: gameId });
};

// Create Model & Export
module.exports = mongoose.model('Game', Game);
