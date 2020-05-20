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
Game.statics.findOneByGameid = function (gmaeId) {
    return this.findOne({ gameId });
};

// Update by gameId
Game.statics.updateByGameid = function (gmaeId, payload) {
    return this.findOneAndUpdate({ gameId }, payload, { new: true });
};

// Delete by gameId
Game.statics.deleteByGameid = function (gmaeId) {
    return this.remove({ gameId });
};

// Create Model & Export
module.exports = mongoose.model('Game', Game);
